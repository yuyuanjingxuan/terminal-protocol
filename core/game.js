// core/game.js - Game loop and state management
class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
    this.speed = 1; // game speed multiplier (1x/2x/3x)
    this.gameState = 'menu'; // menu | ready | playing | gameover
    this.currentLevel = null;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.resources = BALANCE.startingResources; // Starting resources (overridden by techTree in loadLevel)
    this.health = BALANCE.startingHealth; // Starting health
    this.waveManager = null;
    this.selectedTowerType = null; // Nothing selected by default
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseOnCanvas = false;

    // Visual & audio polish (Phase 6)
    this.effects = new ParticleSystem(this);
    this.audio = null; // AudioManager, wired by TerminalProtocol

    // Meta-progression (Phase 5)
    this.techTree = new TechTree(this);
    this.saveSystem = new SaveSystem();
    this.completedLevels = []; // level keys completed at least once
    this.unlockedLevels = ['c1l1']; // level keys the player can start
    this.onLevelComplete = null; // callback: fired after a level is completed

    // Phase 7: tower selection (upgrade) + time limit (level 6-4)
    this.selectedTower = null; // built tower the player has selected
    this.timeLimit = 0;        // seconds; 0 = no limit
    this.timeRemaining = 0;

    // Phase 8: difficulty + endless mode
    this.difficulty = 'normal';   // easy | normal | hard
    this.endlessMode = false;     // true while playing endless mode
    this.endlessBestWave = 0;     // best wave reached in endless mode
    this.campaignCompleted = false; // Phase 9: epilogue shown once after first c6l6 clear
    this.seenTowerBar = false;    // Phase 9: tower bar first-time hint shown
    this.seenTechTree = false;    // Phase 9: tech tree first-time hint shown
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.waveManager = new WaveManager(this);
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(currentTime) {
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Clamp large frame gaps (e.g. tab switch) and apply game speed
    const dt = Math.min(this.deltaTime, 0.05) * this.speed;
    this.update(dt);
    this.render();

    if (this.isRunning) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  update(deltaTime) {
    // Effects always animate (menu backdrop, result screen, etc.)
    this.effects.update(deltaTime);

    if (this.gameState !== 'playing') return;

    // Update game state
    this.waveManager.update(deltaTime);
    this.towers.forEach(tower => tower.update(deltaTime));
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    this.projectiles.forEach(projectile => projectile.update(deltaTime));

    // Clean up dead entities
    this.enemies = this.enemies.filter(enemy => !enemy.isDead);
    this.projectiles = this.projectiles.filter(projectile => !projectile.isDead);

    // Check game over conditions
    if (this.health <= 0) {
      this.gameOver(false);
      return;
    }

    // Phase 7: time limit (level 6-4 "重置倒计时")
    if (this.timeLimit > 0) {
      this.timeRemaining -= deltaTime;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.gameOver(false, 'timeup');
        return;
      }
    }

    // Check wave completion
    if (this.waveManager.checkWavesComplete() && this.enemies.length === 0) {
      this.gameOver(true);
    }
  }

  // Enter the "ready" state: level loaded, player builds defenses before wave 1
  setReady() {
    this.gameState = 'ready';
  }

  // Start (or resume) the wave flow
  startPlaying() {
    if (this.gameState === 'ready' || this.gameState === 'playing') {
      this.gameState = 'playing';
    }
  }

  render() {
    const ctx = this.ctx;
    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply screen shake offset to the world
    const shake = this.effects.getShakeOffset();
    ctx.save();
    ctx.translate(shake.x, shake.y);

    // Render path
    if (this.currentLevel && this.currentLevel.path) {
      this.renderPath(ctx);
    }

    // Render game elements
    this.towers.forEach(tower => tower.render(ctx));
    this.enemies.forEach(enemy => enemy.render(ctx));
    this.projectiles.forEach(projectile => projectile.render(ctx));

    // Render particle effects on top of entities
    this.effects.render(ctx);

    ctx.restore();

    // Render placement preview (ghost tower + range circle)
    this.renderPlacementPreview(ctx);

    // Render UI
    this.renderUI();

    // Boss warning banner (flashing, top-center)
    this.renderBossWarning(ctx);

    // Copyright watermark (bottom-right, subtle; survives screenshots/recordings)
    ctx.save();
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(140, 160, 180, 0.45)';
    ctx.fillText('Terminal Protocol © yuyuanjingxuan', this.canvas.width - 8, this.canvas.height - 6);
    ctx.restore();
  }

  renderPlacementPreview(ctx) {
    if (!this.selectedTowerType || !this.mouseOnCanvas) return;
    const info = TOWER_TYPES[this.selectedTowerType];
    if (!info) return;

    const gridSize = 40;
    const x = Math.floor(this.mouseX / gridSize) * gridSize + gridSize / 2;
    const y = Math.floor(this.mouseY / gridSize) * gridSize + gridSize / 2;
    const valid = this.isValidTowerPosition(x, y);

    const rangeColor = valid ? 'rgba(0, 255, 136, 0.6)' : 'rgba(255, 68, 68, 0.6)';
    const fillAlpha = valid ? 'rgba(0, 255, 136, 0.07)' : 'rgba(255, 68, 68, 0.07)';

    // Range circle
    ctx.strokeStyle = rangeColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(x, y, info.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = fillAlpha;
    ctx.fill();

    // Ghost tower body (same shape as the real tower)
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = info.color;
    ctx.fillRule = 'evenodd';
    drawTowerShape(ctx, x, y, 15, info.shape);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  isValidTowerPosition(x, y) {
    // Check bounds
    if (x < 20 || x > this.canvas.width - 20 || y < 20 || y > this.canvas.height - 20) {
      return false;
    }

    // Check not on path
    const path = this.currentLevel?.path;
    if (path) {
      for (let i = 0; i < path.length - 1; i++) {
        if (this.distanceToSegment(x, y, path[i], path[i + 1]) < 35) {
          return false;
        }
      }
    }

    // Check not overlapping existing towers
    for (const tower of this.towers) {
      const dist = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
      if (dist < 30) return false;
    }

    return true;
  }

  distanceToSegment(px, py, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt(Math.pow(px - a.x, 2) + Math.pow(py - a.y, 2));
    let t = ((px - a.x) * dx + (py - a.y) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const closestX = a.x + t * dx;
    const closestY = a.y + t * dy;
    return Math.sqrt(Math.pow(px - closestX, 2) + Math.pow(py - closestY, 2));
  }

  renderPath(ctx) {
    const path = this.currentLevel.path;
    if (!path || path.length < 2) return;

    // Draw path glow
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();

    // Draw path core
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw start marker
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(path[0].x, path[0].y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw end marker (terminal: magenta square, distinct from red enemies)
    const end = path[path.length - 1];
    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 15;
    ctx.fillRect(end.x - 12, end.y - 12, 24, 24);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(224, 64, 251, 0.4)';
    ctx.fillRect(end.x - 7, end.y - 7, 14, 14);
  }

  renderUI() {
    // Update the HTML panel (avoids overlapping canvas text)
    const resEl = document.getElementById('resources');
    const hpEl = document.getElementById('health');
    const waveEl = document.getElementById('waveInfo');
    const selEl = document.getElementById('selectedInfo');

    if (resEl) resEl.textContent = I18N.t('resources', { n: Math.floor(this.resources) });
    if (hpEl) hpEl.textContent = I18N.t('health', { n: this.health });
    const techEl = document.getElementById('techPoints');
    if (techEl) techEl.textContent = I18N.t('techPoints', { n: this.techTree.points });
    if (waveEl) {
      const wm = this.waveManager;
      if (this.endlessMode) {
        waveEl.textContent = I18N.t('endlessWave', { n: wm.currentWave });
      } else if (this.gameState === 'ready') {
        waveEl.textContent = I18N.t('waveReady', { n: wm.waves.length });
      } else if (wm.isWaveActive) {
        waveEl.textContent = I18N.t('waveActive', { cur: wm.currentWave, n: wm.waves.length });
      } else if (wm.currentWave < wm.waves.length) {
        const remaining = Math.ceil(wm.waveInterval - wm.waveTimer);
        waveEl.textContent = I18N.t('waveCountdown', { cur: wm.currentWave, n: wm.waves.length, s: remaining });
      } else {
        waveEl.textContent = I18N.t('waveActive', { cur: wm.currentWave, n: wm.waves.length });
      }
    }

    // Wave button: "准备就绪" in ready state, "下一波" between waves
    const nextWaveBtn = document.getElementById('nextWaveBtn');
    if (nextWaveBtn) {
      if (this.gameState === 'ready') {
        nextWaveBtn.textContent = I18N.t('readyBtn');
        nextWaveBtn.disabled = false;
      } else {
        nextWaveBtn.textContent = I18N.t('nextWaveBtn');
        nextWaveBtn.disabled = this.gameState !== 'playing' ||
          this.waveManager.isWaveActive ||
          this.waveManager.currentWave >= this.waveManager.waves.length;
      }
    }

    if (selEl) {
      if (this.selectedTowerType) {
        const info = TOWER_TYPES[this.selectedTowerType];
        selEl.textContent = I18N.t('selected', { name: I18N.towerName(this.selectedTowerType), cost: info.cost });
        selEl.style.color = info.color;
        selEl.style.display = 'block';
      } else if (this.selectedTower) {
        selEl.textContent = I18N.t('upgradeHint');
        selEl.style.color = '#ffd54f';
        selEl.style.display = 'block';
      } else {
        selEl.style.display = 'none';
      }
    }

    // Phase 7: time limit display (level 6-4)
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) {
      if (this.timeLimit > 0) {
        timerEl.textContent = I18N.t('timerLabel', { n: Math.ceil(this.timeRemaining) });
        timerEl.style.display = 'block';
        timerEl.style.color = this.timeRemaining < 30 ? '#ff4444' : '#ffd54f';
      } else {
        timerEl.style.display = 'none';
      }
    }

    // Phase 7: upgrade panel (shown when a built tower is selected)
    const upEl = document.getElementById('upgradePanel');
    if (upEl) {
      const tower = this.selectedTower;
      if (tower && (this.gameState === 'ready' || this.gameState === 'playing')) {
        const nameEl = upEl.querySelector('.up-name');
        const lvlEl = upEl.querySelector('.up-level');
        const btnEl = upEl.querySelector('.up-btn');
        if (nameEl) nameEl.textContent = I18N.towerName(tower.type);
        if (lvlEl) lvlEl.textContent = I18N.t('towerLevel', { n: tower.level });
        if (btnEl) {
          if (tower.level >= tower.maxLevel) {
            btnEl.textContent = I18N.t('upgradeMax');
            btnEl.disabled = true;
          } else {
            btnEl.textContent = I18N.t('upgradeBtn', { n: tower.upgradeCost() });
            btnEl.disabled = this.resources < tower.upgradeCost();
          }
        }
        upEl.style.display = 'block';
      } else {
        upEl.style.display = 'none';
      }
    }
  }

  // Flashing red banner shown for a few seconds before a boss wave spawns
  renderBossWarning(ctx) {
    const wm = this.waveManager;
    if (!wm || wm.bossWarningTimer <= 0) return;
    // Blink: visible for 0.4s, hidden for 0.2s
    if (Math.floor(wm.bossWarningTimer * 2.5) % 2 === 0) return;

    const text = I18N.t('bossWarning');
    ctx.save();
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const w = Math.min(this.canvas.width - 40, ctx.measureText(text).width + 60);
    const x = (this.canvas.width - w) / 2;
    const y = 56;
    ctx.fillStyle = 'rgba(120, 0, 0, 0.75)';
    ctx.fillRect(x, y, w, 36);
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, 36);
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#ff8888';
    ctx.fillText(text, this.canvas.width / 2, y + 19);
    ctx.restore();
  }

  gameOver(isWin, reason) {
    this.gameState = 'gameover';
    this.isRunning = false;

    // Phase 8: endless mode — record the best wave reached on defeat
    if (this.endlessMode) {
      const reached = this.waveManager ? this.waveManager.currentWave : 0;
      if (reached > this.endlessBestWave) {
        this.endlessBestWave = reached;
        this.saveSystem.save(this);
      }
    }

    // Play win/lose jingle
    if (this.audio) {
      if (isWin) this.audio.playWin();
      else this.audio.playLose();
    }

    // Award meta-progression on victory
    if (isWin) this.completeLevel();

    // Phase 7: on victory, play post-level dialogue first (if any), then result screen
    if (isWin && this.onVictoryDialogue) {
      this.onVictoryDialogue();
      return;
    }

    this.showResultScreen(isWin, reason);
  }

  // Show the result screen overlay (win / lose)
  showResultScreen(isWin, reason) {
    // Show result screen (HTML overlay)
    const overlay = document.getElementById('resultScreen');
    if (overlay) {
      const title = document.getElementById('resultTitle');
      const subtitle = document.getElementById('resultSubtitle');
      if (title) {
        title.textContent = isWin ? I18N.t('winTitle') : (reason === 'timeup' ? I18N.t('timeUpTitle') : I18N.t('loseTitle'));
        title.style.color = isWin ? '#00ff88' : '#ff4444';
      }
      if (subtitle) {
        const waves = this.waveManager ? this.waveManager.waves.length : 0;
        if (this.endlessMode && !isWin) {
          subtitle.textContent = I18N.t('endlessLoseSubtitle', { n: this.waveManager ? this.waveManager.currentWave : 0 });
        } else {
          subtitle.textContent = isWin
            ? I18N.t('winSubtitle', { n: waves }) + (this.lastTechReward ? I18N.t('techReward', { n: this.lastTechReward }) : '')
            : (reason === 'timeup' ? I18N.t('timeUpSubtitle') : I18N.t('loseSubtitle'));
        }
      }
      // "Next Level" only on victory when a next level exists (never in endless)
      const nextBtn = document.getElementById('resultNextBtn');
      if (nextBtn) {
        const allLevels = Object.keys(levels);
        const levelKey = this.currentLevel ? this.currentLevel.key : null;
        const idx = allLevels.indexOf(levelKey);
        const hasNext = isWin && !this.endlessMode && idx >= 0 && !!allLevels[idx + 1];
        nextBtn.style.display = hasNext ? 'inline-block' : 'none';
      }
      overlay.classList.add('show');
    }

    console.log(isWin ? 'Level Complete!' : 'Game Over!');
  }

  // Award tech points for completing a level and unlock the next one
  completeLevel() {
    const levelKey = this.currentLevel ? this.currentLevel.key : null;
    if (!levelKey) return;

    // Tech reward (Phase 7): 1 per normal level, 2 per boss level (42 total)
    const levelIndex = Object.keys(levels).indexOf(levelKey);
    const levelData = levels[levelKey];
    const reward = (levelData && levelData.boss) ? 2 : 1;
    this.lastTechReward = reward;

    if (!this.completedLevels.includes(levelKey)) {
      this.completedLevels.push(levelKey);
      this.techTree.addPoints(reward);
    }

    // Unlock the next level in sequence
    const allLevels = Object.keys(levels);
    const nextKey = allLevels[levelIndex + 1];
    if (nextKey && !this.unlockedLevels.includes(nextKey)) {
      this.unlockedLevels.push(nextKey);
    }

    this.saveSystem.save(this);
    if (this.onLevelComplete) this.onLevelComplete();
  }

  addTower(tower) {
    this.towers.push(tower);
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  addProjectile(projectile) {
    this.projectiles.push(projectile);
  }

  spendResources(amount) {
    if (this.resources >= amount) {
      this.resources -= amount;
      return true;
    }
    return false;
  }

  gainResources(amount) {
    this.resources += amount;
  }

  takeDamage(amount) {
    this.health -= amount;
  }

  isLevelUnlocked(levelName) {
    return this.unlockedLevels.includes(levelName);
  }

  // Phase 7: find the tower under a canvas point (for click-to-select)
  towerAt(x, y) {
    for (const tower of this.towers) {
      const r = (tower.size || 15) + 8;
      if (Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2)) <= r) {
        return tower;
      }
    }
    return null;
  }

  // Phase 7: upgrade the selected tower. Returns true on success.
  upgradeSelectedTower() {
    const tower = this.selectedTower;
    if (!tower) return false;
    const cost = tower.upgradeCost();
    if (tower.level >= tower.maxLevel) return false;
    if (!this.spendResources(cost)) return false;
    tower.upgrade();
    if (this.inputHandler) this.inputHandler.showToast(I18N.t('upgradedMsg', { name: I18N.towerName(tower.type), n: tower.level }));
    return true;
  }
}