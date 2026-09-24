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
    this.inputHandler.updateTowerButtons(); // sync button costs from BALANCE

    // Tower selection buttons (click again to deselect)
    document.querySelectorAll('.tower-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.game.selectedTowerType = (this.game.selectedTowerType === type) ? null : type;
        this.inputHandler.updateTowerButtons();
      });
    });

    // Tower button tooltips: hover to see stats + role description
    const tooltip = document.getElementById('towerTooltip');
    if (tooltip) {
      const container = document.getElementById('gameContainer');
      document.querySelectorAll('.tower-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          const type = btn.dataset.type;
          const info = TOWER_TYPES[type];
          const s = BALANCE.towers[type];
          const stats = [];
          if (s.damage > 0) stats.push(I18N.t('ttDamage', { n: s.damage }));
          if (s.range > 0) stats.push(I18N.t('ttRange', { n: s.range }));
          const counter = I18N.towerCounter(type);
          tooltip.innerHTML =
            `<b>${I18N.towerName(type)}</b> <span class="tt-cost">${info.cost}</span><br>` +
            (stats.length ? stats.join(' · ') + '<br>' : '') +
            `<span class="tt-desc">${I18N.towerDesc(type)}</span><br>` +
            (counter ? `<span class="tt-counter">${I18N.t('ttCounter', { n: counter })}</span><br>` : '') +
            `<span class="tt-hint">${I18N.t('sellHint')}</span>`;
          const rect = btn.getBoundingClientRect();
          const contRect = container.getBoundingClientRect();
          tooltip.style.left = (rect.left - contRect.left + rect.width / 2) + 'px';
          tooltip.classList.add('show');
        });
        btn.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
      });
    }

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
      menuStartBtn.addEventListener('click', () => this.startCampaign());
    }

    // Phase 8: difficulty selector (main menu)
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.difficulty = btn.dataset.diff;
        this.game.saveSystem.save(this.game);
        this.updateDifficultyUI();
      });
    });

    // Phase 8: endless mode entry (unlocked after clearing all 36 levels)
    const endlessBtn = document.getElementById('endlessBtn');
    if (endlessBtn) {
      endlessBtn.addEventListener('click', () => {
        if (this.isEndlessUnlocked()) this.loadEndless();
      });
    }

    // Phase 7: tower upgrade button
    const upBtn = document.querySelector('#upgradePanel .up-btn');
    if (upBtn) {
      upBtn.addEventListener('click', () => this.game.upgradeSelectedTower());
    }

    // Result screen buttons
    const resultRetryBtn = document.getElementById('resultRetryBtn');
    if (resultRetryBtn) {
      resultRetryBtn.addEventListener('click', () => {
        // Phase 8: retrying endless mode reloads endless, not a campaign level
        if (this.game.endlessMode) { this.loadEndless(); return; }
        const key = this.game.currentLevel ? this.game.currentLevel.key : 'c1l1';
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
        const chapter = chapterIndexForLevel(this.game.currentLevel.key);
        this.audioManager.startMusic(chapter);
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
          const chapter = chapterIndexForLevel(this.game.currentLevel.key);
          this.audioManager.startMusic(chapter);
        }
      });
    }

    // Initialize renderer
    this.renderer = new Renderer(this.game);

    // Load saved meta-progression (Phase 5)
    this.game.saveSystem.load(this.game);
    this.game.onLevelComplete = () => this.updateLevelButtons();
    // Phase 7: on victory, play post-level dialogue (if any) before the result screen
    this.game.onVictoryDialogue = () => this.playVictoryDialogue();
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
      this.game.unlockedLevels = ['c1l1'];
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

    // Build the chapter grid (6 chapters × 6 level slots)
    const container = document.getElementById('menuLevelList');
    if (container) {
      container.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'menu-chapters';
      chapters.forEach((chapter, ci) => {
        const chapterEl = document.createElement('div');
        chapterEl.className = 'menu-chapter';
        const header = document.createElement('div');
        header.className = 'menu-chapter-header';
        header.textContent = I18N.chapterName(ci);
        chapterEl.appendChild(header);

        const slots = document.createElement('div');
        slots.className = 'menu-chapter-slots';
        chapter.levels.forEach((lv, li) => {
          const key = lv.key;
          const unlocked = this.game.isLevelUnlocked(key);
          const done = this.game.completedLevels.includes(key);
          const slot = document.createElement('button');
          slot.className = 'menu-slot' + (unlocked ? '' : ' locked') + (done ? ' done' : '');
          slot.disabled = !unlocked;
          slot.dataset.level = key;
          const status = !unlocked ? I18N.t('levelLocked') : (done ? I18N.t('levelDone') : I18N.t('levelStart'));
          slot.innerHTML = `<span class="slot-name">${I18N.levelName(key)}</span><span class="slot-status">${status}</span>`;
          slot.addEventListener('click', () => this.loadLevel(key));
          slots.appendChild(slot);
        });
        chapterEl.appendChild(slots);
        grid.appendChild(chapterEl);
      });
      container.appendChild(grid);
    }

    // Phase 8: refresh difficulty selector + endless button state
    this.updateDifficultyUI();

    const menu = document.getElementById('mainMenu');
    if (menu) menu.classList.add('show');
  }

  // Phase 8: sync the difficulty selector + endless button with game state
  updateDifficultyUI() {
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.diff === this.game.difficulty);
    });
    const endlessBtn = document.getElementById('endlessBtn');
    const hint = document.getElementById('endlessHint');
    const unlocked = this.isEndlessUnlocked();
    if (endlessBtn) endlessBtn.disabled = !unlocked;
    if (hint) {
      hint.textContent = unlocked
        ? I18N.t('endlessBest', { n: this.game.endlessBestWave })
        : I18N.t('endlessLocked');
    }
  }

  // Phase 8: endless mode unlocks after all 36 campaign levels are cleared
  isEndlessUnlocked() {
    const all = Object.keys(levels);
    return all.length > 0 && all.every(k => this.game.completedLevels.includes(k));
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

    // Phase 8: difficulty + endless labels
    set('difficultyLabel', t('difficultyLabel'));
    const diffKeys = { easy: 'diffEasy', normal: 'diffNormal', hard: 'diffHard' };
    Object.entries(diffKeys).forEach(([diff, key]) => {
      const btn = document.querySelector('.diff-btn[data-diff="' + diff + '"]');
      if (btn) btn.textContent = t(key);
    });
    set('endlessBtn', t('endlessBtn'));
    // Re-sync the endless hint (locked text is language-dependent)
    if (this.game && this.game.gameState === 'menu') this.updateDifficultyUI();

    // Phase 9: prologue labels
    set('prologueHead', t('prologueHead'));
    set('prologueSkip', t('prologueSkip'));

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
    // (In-game quick-switch level buttons were removed in Phase 7; level
    // selection now lives in the main menu chapter grid. Kept as a no-op
    // because onLevelComplete and save import/reset still call it.)
  }

  // ---- Phase 7: story / dialogue flow -------------------------------------

  // Show a sequence of dialogue lines in the dialogue box. Each line is
  // { who, zh, en, [title, titleEn] }. Calls onDone when the last line is
  // dismissed.
  showDialogue(lines, onDone) {
    const box = document.getElementById('dialogueBox');
    if (!box) { if (onDone) onDone(); return; }
    const speakerEl = box.querySelector('.dlg-speaker');
    const textEl = box.querySelector('.dlg-text');
    const btnEl = box.querySelector('.dlg-btn');
    const isEn = I18N.lang === 'en';
    let idx = 0;

    const renderLine = () => {
      const line = lines[idx];
      let ch;
      if (line.who === 'system') {
        ch = { name: '章节过场', nameEn: 'CHAPTER', color: '#00f0ff' };
      } else {
        ch = (STORY && STORY.characters && STORY.characters[line.who]) ||
          { name: '系统', nameEn: 'SYSTEM', color: '#00f0ff' };
      }
      speakerEl.textContent = isEn ? ch.nameEn : ch.name;
      speakerEl.style.color = ch.color;
      const body = isEn ? line.en : line.zh;
      if (line.title || line.titleEn) {
        const title = isEn ? (line.titleEn || line.title) : (line.title || line.titleEn);
        textEl.innerHTML = `<div class="dlg-title">${title}</div><div>${body}</div>`;
      } else {
        textEl.textContent = body;
      }
      btnEl.textContent = (idx < lines.length - 1) ? I18N.t('dialogueContinue') : I18N.t('dialogueEnd');
    };

    const advance = () => {
      idx++;
      if (idx >= lines.length) {
        box.classList.remove('show');
        if (onDone) onDone();
      } else {
        renderLine();
      }
    };

    btnEl.onclick = advance;
    renderLine();
    box.classList.add('show');
  }

  // Show the mission briefing panel (Cen Zhao) for a level.
  showBriefing(key, lines) {
    const panel = document.getElementById('briefingPanel');
    if (!panel) return;
    if (!lines || lines.length === 0) return;
    const isEn = I18N.lang === 'en';
    const titleEl = panel.querySelector('.bf-title');
    const speakerEl = panel.querySelector('.bf-speaker');
    const textEl = panel.querySelector('.bf-text');
    const btnEl = panel.querySelector('.bf-btn');
    titleEl.textContent = I18N.t('briefingTitle');
    const cen = STORY.characters.cen;
    speakerEl.textContent = isEn ? cen.nameEn : cen.name;
    speakerEl.style.color = cen.color;
    textEl.innerHTML = lines.map(l => `<div>${isEn ? l.en : l.zh}</div>`).join('');
    btnEl.textContent = I18N.t('briefingContinue');
    btnEl.onclick = () => panel.classList.remove('show');
    panel.classList.add('show');
  }

  // On level load: show the chapter intro (first level of a chapter) and/or
  // the mission briefing.
  showLevelIntro(key) {
    if (!STORY) return;
    const ci = chapterIndexForLevel(key);
    const chapter = chapters[ci];
    const isFirstLevel = chapter && chapter.levels[0].key === key;
    const briefingLines = (STORY.briefings && STORY.briefings[key]) || [];

    if (isFirstLevel && STORY.chapters[ci]) {
      const intro = STORY.chapters[ci];
      const introLine = {
        who: 'system',
        title: intro.title,
        titleEn: intro.titleEn,
        zh: intro.intro,
        en: intro.introEn
      };
      this.showDialogue([introLine], () => this.showBriefing(key, briefingLines));
    } else {
      this.showBriefing(key, briefingLines);
    }
  }

  // On victory: play the post-level dialogue (log fragment + events), then
  // show the result screen.
  playVictoryDialogue() {
    const key = this.game.currentLevel ? this.game.currentLevel.key : null;
    if (!key || !STORY) { this.game.showResultScreen(true, 'win'); return; }
    const isEn = I18N.lang === 'en';
    const queue = [];

    // Log fragment (Lu Mingyuan) first, if this level has one
    const frag = STORY.logFragments && STORY.logFragments[key];
    if (frag) {
      let text = isEn ? frag.en : frag.zh;
      if (frag.note) text += '\n' + (isEn ? (frag.noteEn || frag.note) : frag.note);
      queue.push({ who: 'lu', zh: text, en: text });
    }

    // Post-victory events
    const events = STORY.events && STORY.events[key];
    if (events && events.length) queue.push(...events);

    if (queue.length === 0) {
      this.game.showResultScreen(true, 'win');
    } else {
      this.showDialogue(queue, () => this.game.showResultScreen(true, 'win'));
    }
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

  // Phase 9: start the campaign — play the opening prologue once, then c1l1
  startCampaign() {
    if (!this.game.prologueSeen) {
      this.showPrologue(() => {
        this.game.prologueSeen = true;
        this.game.saveSystem.save(this.game);
        this.loadLevel('c1l1');
      });
    } else {
      this.loadLevel('c1l1');
    }
  }

  // Phase 9: terminal boot-sequence prologue (typewriter, skippable, once)
  showPrologue(onDone) {
    const overlay = document.getElementById('prologue');
    if (!overlay) { if (onDone) onDone(); return; }
    const linesEl = overlay.querySelector('.prologue-lines');
    const skipBtn = overlay.querySelector('.prologue-skip');
    const isEn = I18N.lang === 'en';
    const lines = (STORY && STORY.prologue)
      ? STORY.prologue.map(l => isEn ? l.en : l.zh)
      : [];
    linesEl.innerHTML = '';
    overlay.classList.add('show');

    let finished = false;
    let lineIdx = 0, charIdx = 0;
    let activeDiv = null;
    let timer = null;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (timer) { clearInterval(timer); timer = null; }
      linesEl.innerHTML = '';
      lines.forEach(l => {
        const div = document.createElement('div');
        div.className = 'prologue-line';
        div.textContent = l;
        linesEl.appendChild(div);
      });
      setTimeout(() => {
        overlay.classList.remove('show');
        if (onDone) onDone();
      }, 1000);
    };

    skipBtn.onclick = finish;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) finish(); });

    const step = () => {
      if (lineIdx >= lines.length) { finish(); return; }
      const line = lines[lineIdx];
      if (!activeDiv) {
        activeDiv = document.createElement('div');
        activeDiv.className = 'prologue-line';
        linesEl.appendChild(activeDiv);
      }
      if (charIdx < line.length) {
        charIdx++;
        activeDiv.textContent = line.slice(0, charIdx);
      } else {
        lineIdx++;
        charIdx = 0;
        activeDiv = null;
      }
    };

    if (lines.length === 0) { finish(); return; }
    timer = setInterval(step, 18);
  }

  loadLevel(levelName) {
    // Load level data (Phase 7: 36 levels across 6 chapters)
    const levelData = levels[levelName];
    if (!levelData) {
      console.error(`Level ${levelName} not found`);
      return;
    }
    const chapterIdx = chapterIndexForLevel(levelName);
    const chapter = chapters[chapterIdx];
    const path = chapter ? chapter.path : levelData.path;

    // Reset game state (starting resources/health respect tech tree, Phase 5)
    this.game.towers = [];
    this.game.enemies = [];
    this.game.projectiles = [];
    this.game.resources = this.game.techTree.getStartingResources();
    this.game.health = this.game.techTree.getStartingHealth();
    this.game.selectedTowerType = null;
    this.game.selectedTower = null;
    this.game.endlessMode = false; // Phase 8: campaign level (not endless)
    this.inputHandler.updateTowerButtons();
    if (this.game.effects) this.game.effects.clear();

    // Phase 7: time limit (level 6-4 reset countdown)
    this.game.timeLimit = levelData.timeLimit || 0;
    this.game.timeRemaining = this.game.timeLimit;

    // Hide overlays
    const menu = document.getElementById('mainMenu');
    if (menu) menu.classList.remove('show');
    const resultScreen = document.getElementById('resultScreen');
    if (resultScreen) resultScreen.classList.remove('show');
    const briefingPanel = document.getElementById('briefingPanel');
    if (briefingPanel) briefingPanel.classList.remove('show');
    const dialogueBox = document.getElementById('dialogueBox');
    if (dialogueBox) dialogueBox.classList.remove('show');

    // Restart the loop if a previous game ended
    if (!this.game.isRunning) {
      this.game.isRunning = true;
      this.game.lastTime = performance.now();
      requestAnimationFrame(this.game.loop.bind(this.game));
    }

    // Set current level (key = 'c1l1'..., name = display name, path from chapter)
    this.game.currentLevel = {
      key: levelName,
      name: levelData.name,
      path: path,
      boss: levelData.boss || null,
      ambient: !!levelData.ambient
    };

    // Setup wave manager
    const waveManager = this.game.waveManager;
    waveManager.reset();

    // Add waves (path is resolved at spawn time)
    levelData.waves.forEach(wave => {
      const waveEnemies = wave.map(enemyData => ({
        type: enemyData.type,
        path: path
      }));
      waveManager.addWave(waveEnemies);
    });

    // Enter "ready" state: player builds defenses, then presses 准备就绪 to start wave 1
    this.game.setReady();

    // Phase 7: ambient broadcast note (level 6-2)
    if (levelData.ambient) {
      this.inputHandler.showToast(I18N.t('ambientNote'));
    }

    // Restart BGM for this chapter if audio is already unlocked (Phase 6)
    if (this.audioManager.ctx) {
      this.audioManager.startMusic(chapterIdx);
    }

    // Phase 7: chapter intro (first level of a chapter) + mission briefing
    this.showLevelIntro(levelName);
  }

  // Phase 8: endless mode — infinite scaling waves on the final level's map
  loadEndless() {
    const levelData = levels['c6l6'];
    if (!levelData) return;
    const chapterIdx = chapterIndexForLevel('c6l6');
    const chapter = chapters[chapterIdx];
    const path = chapter ? chapter.path : levelData.path;

    // Reset game state (same as loadLevel)
    this.game.towers = [];
    this.game.enemies = [];
    this.game.projectiles = [];
    this.game.resources = this.game.techTree.getStartingResources();
    this.game.health = this.game.techTree.getStartingHealth();
    this.game.selectedTowerType = null;
    this.game.selectedTower = null;
    this.game.endlessMode = true;
    this.inputHandler.updateTowerButtons();
    if (this.game.effects) this.game.effects.clear();

    this.game.timeLimit = 0;
    this.game.timeRemaining = 0;

    // Hide overlays
    const menu = document.getElementById('mainMenu');
    if (menu) menu.classList.remove('show');
    const resultScreen = document.getElementById('resultScreen');
    if (resultScreen) resultScreen.classList.remove('show');
    const briefingPanel = document.getElementById('briefingPanel');
    if (briefingPanel) briefingPanel.classList.remove('show');
    const dialogueBox = document.getElementById('dialogueBox');
    if (dialogueBox) dialogueBox.classList.remove('show');

    // Restart the loop if a previous game ended
    if (!this.game.isRunning) {
      this.game.isRunning = true;
      this.game.lastTime = performance.now();
      requestAnimationFrame(this.game.loop.bind(this.game));
    }

    this.game.currentLevel = {
      key: 'endless',
      name: I18N.t('endlessBtn'),
      path: path,
      boss: null,
      ambient: false
    };

    // Endless: no pre-defined waves; WaveManager generates them procedurally.
    // Pre-generate wave 1 so "准备就绪" starts it immediately.
    const waveManager = this.game.waveManager;
    waveManager.reset();
    waveManager.endless = true;
    waveManager.addWave(waveManager.generateEndlessWave(1));

    this.game.setReady();

    // BGM: final chapter
    if (this.audioManager.ctx) {
      this.audioManager.startMusic(chapterIdx);
    }
  }
}

// Initialize game when page loads
window.addEventListener('load', () => {
  const game = new TerminalProtocol();
  game.init();
});