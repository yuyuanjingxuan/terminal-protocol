// main.js - Main entry point
class TerminalProtocol {
  constructor() {
    this.game = null;
    this.inputHandler = null;
    this.audioManager = null;
    this.renderer = null;
  }

  init() {
    // Initialize game
    this.game = new Game();
    this.game.init('gameCanvas');

    // Initialize input handler
    this.inputHandler = new InputHandler(this.game);

    // Tower selection buttons (click again to deselect)
    document.querySelectorAll('.tower-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.game.selectedTowerType = (this.game.selectedTowerType === type) ? null : type;
        this.inputHandler.updateTowerButtons();
      });
    });

    // Level selector buttons
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadLevel(btn.dataset.level);
      });
    });

    // Wave controls: call next wave early + game speed
    document.getElementById('nextWaveBtn').addEventListener('click', () => {
      this.game.waveManager.callNextWave();
    });

    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.speed = parseInt(btn.dataset.speed, 10);
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    // Initialize audio manager and wire it to the game (Phase 6)
    this.audioManager = new AudioManager();
    this.game.audio = this.audioManager;

    // Unlock audio on the first user gesture anywhere (browser autoplay policy)
    const unlockAudio = () => {
      this.audioManager.unlock();
      if (this.game.currentLevel) {
        const chapter = Object.keys(levels).indexOf(this.game.currentLevel.key);
        this.audioManager.startMusic(chapter >= 0 ? chapter : 0);
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    // Mute / music toggle buttons
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        this.audioManager.setEnabled(!this.audioManager.enabled);
        muteBtn.textContent = this.audioManager.enabled ? '🔊' : '🔇';
        muteBtn.classList.toggle('off', !this.audioManager.enabled);
      });
    }
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        this.audioManager.setMusicEnabled(!this.audioManager.musicEnabled);
        musicBtn.classList.toggle('off', !this.audioManager.musicEnabled);
        if (this.audioManager.musicEnabled && this.game.currentLevel) {
          const chapter = Object.keys(levels).indexOf(this.game.currentLevel.key);
          this.audioManager.startMusic(chapter >= 0 ? chapter : 0);
        }
      });
    }

    // Initialize renderer
    this.renderer = new Renderer(this.game);

    // Load saved meta-progression (Phase 5)
    this.game.saveSystem.load(this.game);
    this.game.onLevelComplete = () => this.updateLevelButtons();
    this.updateLevelButtons();
    this.renderTechPanel();

    // Tech panel controls
    document.getElementById('techBtn').addEventListener('click', () => {
      const panel = document.getElementById('techPanel');
      panel.classList.toggle('open');
      this.renderTechPanel();
    });
    document.getElementById('techCloseBtn').addEventListener('click', () => {
      document.getElementById('techPanel').classList.remove('open');
    });

    // Export / import save
    document.getElementById('exportSaveBtn').addEventListener('click', () => {
      const text = this.game.saveSystem.exportSave(this.game);
      navigator.clipboard.writeText(text).then(() => {
        this.flashSaveMsg('Save copied to clipboard');
      }).catch(() => {
        prompt('Copy your save code:', text);
      });
    });
    document.getElementById('importSaveBtn').addEventListener('click', () => {
      const text = prompt('Paste your save code:');
      if (!text) return;
      if (this.game.saveSystem.importSave(text, this.game)) {
        this.game.saveSystem.save(this.game);
        this.updateLevelButtons();
        this.renderTechPanel();
        this.flashSaveMsg('Save imported');
      } else {
        this.flashSaveMsg('Import failed - invalid code');
      }
    });
    document.getElementById('resetSaveBtn').addEventListener('click', () => {
      if (!confirm('Reset all progress (tech points, unlocked levels)?')) return;
      this.game.techTree.reset();
      this.game.completedLevels = [];
      this.game.unlockedLevels = ['level1'];
      this.game.saveSystem.clear();
      this.updateLevelButtons();
      this.renderTechPanel();
      this.flashSaveMsg('Progress reset');
    });

    // Load level
    this.loadLevel('level1');

    // Start game loop
    console.log('Terminal Protocol initialized');
  }

  flashSaveMsg(msg) {
    const el = document.getElementById('saveMsg');
    if (!el) return;
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(this._saveMsgTimer);
    this._saveMsgTimer = setTimeout(() => { el.style.opacity = '0'; }, 2000);
  }

  updateLevelButtons() {
    document.querySelectorAll('.level-btn').forEach(btn => {
      const name = btn.dataset.level;
      const unlocked = this.game.isLevelUnlocked(name);
      btn.disabled = !unlocked;
      btn.classList.toggle('locked', !unlocked);
      btn.textContent = unlocked ? name.replace('level', '') : '🔒';
    });
  }

  renderTechPanel() {
    const container = document.getElementById('techNodes');
    if (!container) return;
    const tt = this.game.techTree;
    container.innerHTML = '';

    tt.factions.forEach(faction => {
      const factionEl = document.createElement('div');
      factionEl.className = 'tech-faction';
      factionEl.innerHTML = `<div class="tech-faction-name" style="color:${faction.color}">${faction.name}</div>`;

      Object.entries(tt.nodes)
        .filter(([id, node]) => node.faction === faction.id)
        .sort((a, b) => a[1].tier - b[1].tier)
        .forEach(([id, node]) => {
          const unlocked = tt.isUnlocked(id);
          const canBuy = tt.canUnlock(id);
          const btn = document.createElement('button');
          btn.className = 'tech-node' + (unlocked ? ' unlocked' : '') + (canBuy ? ' available' : '');
          btn.disabled = unlocked || !canBuy;
          btn.innerHTML = `<span class="tech-node-name">${node.name}</span>` +
            `<span class="tech-node-desc">${node.description}</span>` +
            `<span class="tech-node-cost">${unlocked ? '✓' : node.cost + ' pt'}</span>`;
          btn.title = node.description;
          btn.addEventListener('click', () => {
            if (tt.unlockNode(id)) {
              this.game.saveSystem.save(this.game);
              this.renderTechPanel();
              const techEl = document.getElementById('techPoints');
              if (techEl) techEl.textContent = `Tech: ${tt.points} pts`;
              // Tech unlock sound + sparkle (Phase 6)
              if (this.game.audio) this.game.audio.playTechUnlock();
              if (this.game.effects) this.game.effects.techUnlock(this.game.canvas.width / 2, 60);
            }
          });
          factionEl.appendChild(btn);
        });

      container.appendChild(factionEl);
    });
  }

  loadLevel(levelName) {
    // Load level data
    const levelData = levels[levelName];
    if (!levelData) {
      console.error(`Level ${levelName} not found`);
      return;
    }

    // Reset game state (starting resources/health respect tech tree, Phase 5)
    this.game.towers = [];
    this.game.enemies = [];
    this.game.projectiles = [];
    this.game.resources = this.game.techTree.getStartingResources();
    this.game.health = this.game.techTree.getStartingHealth();
    this.game.selectedTowerType = null;
    this.inputHandler.updateTowerButtons();

    // Restart the loop if a previous game ended
    if (!this.game.isRunning) {
      this.game.isRunning = true;
      this.game.lastTime = performance.now();
      requestAnimationFrame(this.game.loop.bind(this.game));
    }

    // Set current level (key = object key like 'level1', name = display name)
    this.game.currentLevel = {
      key: levelName,
      name: levelData.name,
      path: levelData.path
    };

    // Setup wave manager
    const waveManager = this.game.waveManager;
    waveManager.reset();

    // Add waves (path is resolved at spawn time)
    levelData.waves.forEach(wave => {
      const waveEnemies = wave.map(enemyData => ({
        type: enemyData.type,
        path: levelData.path
      }));
      waveManager.addWave(waveEnemies);
    });

    // Start first wave
    waveManager.startNextWave();

    // Restart BGM for this chapter if audio is already unlocked (Phase 6)
    if (this.audioManager.ctx) {
      const chapter = Object.keys(levels).indexOf(levelName);
      this.audioManager.startMusic(chapter >= 0 ? chapter : 0);
    }
  }
}

// Initialize game when page loads
window.addEventListener('load', () => {
  const game = new TerminalProtocol();
  game.init();
});