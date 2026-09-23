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

    // Level selector buttons (in-game quick switch)
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.game.isLevelUnlocked(btn.dataset.level)) return;
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadLevel(btn.dataset.level);
      });
    });

    // Wave controls: "准备就绪" starts the first wave; "Next Wave" calls the next early
    document.getElementById('nextWaveBtn').addEventListener('click', () => {
      if (this.game.gameState === 'ready') {
        this.game.startPlaying();
        this.game.waveManager.startNextWave();
      } else {
        this.game.waveManager.callNextWave();
      }
    });

    // Main menu buttons
    const menuStartBtn = document.getElementById('menuStartBtn');
    if (menuStartBtn) {
      menuStartBtn.addEventListener('click', () => this.loadLevel('level1'));
    }
    const menuLevelContainer = document.getElementById('menuLevelList');
    if (menuLevelContainer) {
      menuLevelContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.menu-level-btn');
        if (!btn || btn.disabled) return;
        this.loadLevel(btn.dataset.level);
      });
    }

    // Result screen buttons
    const resultRetryBtn = document.getElementById('resultRetryBtn');
    if (resultRetryBtn) {
      resultRetryBtn.addEventListener('click', () => {
        const key = this.game.currentLevel ? this.game.currentLevel.key : 'level1';
        this.loadLevel(key);
      });
    }
    const resultNextBtn = document.getElementById('resultNextBtn');
    if (resultNextBtn) {
      resultNextBtn.addEventListener('click', () => {
        const allLevels = Object.keys(levels);
        const key = this.game.currentLevel ? this.game.currentLevel.key : null;
        const idx = allLevels.indexOf(key);
        const nextKey = idx >= 0 ? allLevels[idx + 1] : null;
        if (nextKey) this.loadLevel(nextKey);
      });
    }
    const resultMenuBtn = document.getElementById('resultMenuBtn');
    if (resultMenuBtn) {
      resultMenuBtn.addEventListener('click', () => this.showMainMenu());
    }

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
        this.flashSaveMsg(I18N.t('saveCopied'));
      }).catch(() => {
        prompt(I18N.t('saveCopyPrompt'), text);
      });
    });
    document.getElementById('importSaveBtn').addEventListener('click', () => {
      const text = prompt(I18N.t('savePastePrompt'));
      if (!text) return;
      if (this.game.saveSystem.importSave(text, this.game)) {
        this.game.saveSystem.save(this.game);
        this.updateLevelButtons();
        this.renderTechPanel();
        this.flashSaveMsg(I18N.t('saveImported'));
      } else {
        this.flashSaveMsg(I18N.t('saveImportFailed'));
      }
    });
    document.getElementById('resetSaveBtn').addEventListener('click', () => {
      if (!confirm(I18N.t('saveResetConfirm'))) return;
      this.game.techTree.reset();
      this.game.completedLevels = [];
      this.game.unlockedLevels = ['level1'];
      this.game.saveSystem.clear();
      this.updateLevelButtons();
      this.renderTechPanel();
      this.flashSaveMsg(I18N.t('saveResetDone'));
    });

    // Language toggle (main menu button + in-game button)
    const wireLangBtn = (id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => {
        I18N.setLanguage(I18N.lang === 'zh' ? 'en' : 'zh');
      });
    };
    wireLangBtn('langBtn');
    wireLangBtn('langBtn2');
    I18N.onLanguageChange(() => this.applyLanguageUI());

    // Apply the current language to all static UI, then show the main menu
    this.applyLanguageUI();
    this.showMainMenu();

    console.log('Terminal Protocol initialized');
  }

  // Show the main menu overlay (level select)
  showMainMenu() {
    this.game.gameState = 'menu';
    this.game.isRunning = false;
    this.game.selectedTowerType = null;
    this.inputHandler.updateTowerButtons();

    // Hide result screen if visible
    const resultScreen = document.getElementById('resultScreen');
    if (resultScreen) resultScreen.classList.remove('show');

    // Build the level list (locked levels shown but disabled)
    const container = document.getElementById('menuLevelList');
    if (container) {
      container.innerHTML = '';
      Object.keys(levels).forEach(key => {
        const unlocked = this.game.isLevelUnlocked(key);
        const btn = document.createElement('button');
        btn.className = 'menu-level-btn' + (unlocked ? '' : ' locked');
        btn.disabled = !unlocked;
        btn.dataset.level = key;
        const done = this.game.completedLevels.includes(key);
        const status = !unlocked ? I18N.t('levelLocked') : (done ? I18N.t('levelDone') : I18N.t('levelStart'));
        btn.innerHTML = `<span class="menu-level-name">${I18N.levelName(key)}</span><span class="menu-level-status">${status}</span>`;
        container.appendChild(btn);
      });
    }

    const menu = document.getElementById('mainMenu');
    if (menu) menu.classList.add('show');
  }

  // Re-render all static UI text for the current language (called on init
  // and on every language switch). Dynamic HUD text (resources/health/wave)
  // is refreshed every frame by game.renderUI().
  applyLanguageUI() {
    const t = (k, args) => I18N.t(k, args);
    document.title = t('docTitle');

    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    // Main menu
    set('menuTitle', t('menuTitle'));
    set('menuSubtitle', t('menuSubtitle'));
    set('menuStartBtn', t('startGame'));

    // Result screen buttons
    set('resultRetryBtn', t('retry'));
    set('resultNextBtn', t('nextLevel'));
    set('resultMenuBtn', t('mainMenu'));

    // Tech panel
    set('techBtn', t('techBtn'));
    set('techPanelTitle', t('techPanelTitle'));
    const closeBtn = document.getElementById('techCloseBtn');
    if (closeBtn) closeBtn.title = t('close');
    set('exportSaveBtn', t('export'));
    set('importSaveBtn', t('import'));
    set('resetSaveBtn', t('reset'));

    // Audio button tooltips
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) muteBtn.title = t('toggleSfx');
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) musicBtn.title = t('toggleMusic');

    // Tower buttons
    document.querySelectorAll('.tower-btn').forEach(btn => {
      const nameEl = btn.querySelector('.tname');
      if (nameEl) nameEl.textContent = I18N.towerName(btn.dataset.type);
    });

    // Language toggle buttons always show the language they switch TO
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.textContent = I18N.toggleLabel();
    const langBtn2 = document.getElementById('langBtn2');
    if (langBtn2) langBtn2.textContent = I18N.lang === 'zh' ? 'EN' : '中';

    // Re-render dynamic lists (menu level list + tech panel)
    if (this.game && this.game.gameState === 'menu') this.showMainMenu();
    this.renderTechPanel();
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
      factionEl.innerHTML = `<div class="tech-faction-name" style="color:${faction.color}">${I18N.factionName(faction.id)}</div>`;

      Object.entries(tt.nodes)
        .filter(([id, node]) => node.faction === faction.id)
        .sort((a, b) => a[1].tier - b[1].tier)
        .forEach(([id, node]) => {
          const unlocked = tt.isUnlocked(id);
          const canBuy = tt.canUnlock(id);
          const btn = document.createElement('button');
          btn.className = 'tech-node' + (unlocked ? ' unlocked' : '') + (canBuy ? ' available' : '');
          btn.disabled = unlocked || !canBuy;
          // support_2 / support_3 descriptions embed BALANCE bonus values
          const descArgs = id === 'support_2' ? { n: BALANCE.techBonusHealth }
            : id === 'support_3' ? { n: BALANCE.techBonusResources } : undefined;
          const desc = I18N.techDesc(id, descArgs);
          btn.innerHTML = `<span class="tech-node-name">${I18N.techName(id)}</span>` +
            `<span class="tech-node-desc">${desc}</span>` +
            `<span class="tech-node-cost">${unlocked ? '✓' : I18N.t('techCost', { n: node.cost })}</span>`;
          btn.title = desc;
          btn.addEventListener('click', () => {
            if (tt.unlockNode(id)) {
              this.game.saveSystem.save(this.game);
              this.renderTechPanel();
              const techEl = document.getElementById('techPoints');
              if (techEl) techEl.textContent = I18N.t('techPoints', { n: tt.points });
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
    if (this.game.effects) this.game.effects.clear();

    // Hide overlays
    const menu = document.getElementById('mainMenu');
    if (menu) menu.classList.remove('show');
    const resultScreen = document.getElementById('resultScreen');
    if (resultScreen) resultScreen.classList.remove('show');

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

    // Enter "ready" state: player builds defenses, then presses 准备就绪 to start wave 1
    this.game.setReady();

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