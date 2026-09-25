// content/i18n.js - UI language (zh / en)
// All player-visible strings live here. Code reads them via I18N.t(key, ...args)
// at render time, so switching language re-renders everything live.

const I18N = {
  lang: 'zh',
  _listeners: [],

  STRINGS: {
    zh: {
      // Page
      docTitle: '终端协议',
      // HUD
      resources: '资源: {n}',
      health: '生命值: {n}',
      techPoints: '科技点: {n}',
      waveReady: '波次: 0/{n} — 建造防御，然后按「准备就绪」',
      waveActive: '波次: {cur}/{n}',
      waveCountdown: '波次: {cur}/{n}（{s}秒后下一波）',
      readyBtn: '准备就绪 ▶',
      nextWaveBtn: '下一波 ▶',
      selected: '已选择: {name}（{cost}）',
      sellHint: '右键出售（回收 50%）',
      soldMsg: '已出售 {name}，回收 {n} 资源',
      ttDamage: '伤害 {n}',
      ttRange: '射程 {n}',
      // Result screen
      winTitle: '关卡完成',
      loseTitle: '终端被入侵',
      winSubtitle: '已清除全部 {n} 波敌人！',
      techReward: '  +{n} 科技点',
      loseSubtitle: '终端已被入侵……',
      retry: '↻ 重试',
      nextLevel: '下一关 ▶',
      mainMenu: '⌂ 主菜单',
      // Main menu
      menuTitle: '终端协议',
      menuSubtitle: '守护终端 · 抵御入侵',
      startGame: '▶ 开始游戏',
      levelName: '第 {n} 关',
      levelDone: '✓ 已通关',
      levelStart: '▶ 开始',
      levelLocked: '🔒 未解锁',
      chapterLabel: '第 {n} 章',
      chapterDone: '✓ 已通关',
      // Difficulty (Phase 8)
      difficultyLabel: '难度',
      diffEasy: '简单',
      diffNormal: '普通',
      diffHard: '困难',
      // Endless mode (Phase 8)
      endlessBtn: '∞ 无尽模式',
      endlessLocked: '🔒 通关全部关卡后解锁',
      endlessWave: '无尽波次: {n}',
      endlessBest: '最佳波次: {n}',
      endlessLoseSubtitle: '坚持到第 {n} 波',
      // Briefing / dialogue
      briefingTitle: '任务简报',
      briefingContinue: '继续 ▶',
      dialogueContinue: '继续',
      dialogueEnd: '结束',
      prologueHead: '哨兵协议 · 启动序列',
      prologueSkip: '跳过 ▶',
      epilogueHead: '哨兵协议 · 终章',
      logFragmentTitle: '日志碎片',
      ambientNote: '检测到环境广播',
      // Tower upgrade
      upgradeBtn: '升级（{n}）',
      upgradeMax: '已满级',
      towerLevel: 'Lv.{n}',
      upgradeHint: '点击已建造的塔可升级',
      upgradedMsg: '{name} 升级到 Lv.{n}',
      // Phase 9: in-level tutorial hints (c1l1)
      tutorialStep1: '从底部塔栏选择一座塔（或按 1-0），然后点击地图建造',
      tutorialStep2: '按 Esc 取消选塔，点击已建造的塔，在右下角面板点「升级」强化（最高 Lv.3）；右键出售（返还 50%）',
      tutorialStep3: '按「准备就绪 ▶」开始第一波；提前按「下一波」可获得资源奖励',
      tutorialNext: '下一步 ▶',
      // Phase 9: one-time first-time hints (tower bar / tech tree)
      firstTimeTowerBar: '点击塔栏选择塔型，再点击地图建造；按 1-0 可快捷选择',
      firstTimeTechTree: '科技树：用通关获得的科技点强化各系塔，点击节点解锁',
      firstTimeGotIt: '知道了',
      // Time limit (6-4)
      timerLabel: '重置倒计时 {n}s',
      timeUpTitle: '重置倒计时结束',
      timeUpSubtitle: '重置程序已执行……',
      // Boss defeated
      bossDefeated: '核心进程已摧毁',
      // Tech panel
      techBtn: '⚡ 科技',
      techPanelTitle: '科技树',
      close: '关闭',
      export: '导出',
      import: '导入',
      reset: '重置',
      techCost: '{n} 点',
      // Save messages
      saveCopied: '存档已复制到剪贴板',
      saveCopyPrompt: '复制你的存档码：',
      savePastePrompt: '粘贴你的存档码：',
      saveImported: '存档已导入',
      saveImportFailed: '导入失败 - 无效存档码',
      saveResetConfirm: '确定重置全部进度（科技点、已解锁关卡）？',
      saveResetDone: '进度已重置',
      // Audio buttons
      toggleSfx: '开关音效',
      toggleMusic: '开关音乐',
      // Boss
      bossLabel: '核心进程',
      // Towers
      tower_laser: '激光',
      tower_plasma: '等离子',
      tower_railgun: '轨道炮',
      tower_cannon: '加农炮',
      tower_missile: '导弹',
      tower_bomb: '炸弹',
      tower_emp: 'EMP',
      tower_pulse: '眩晕脉冲',
      tower_disruptor: '干扰器',
      tower_repair: '资源塔',
      // Tower descriptions (tooltip)
      towerDesc_laser: '单体高伤，射速快',
      towerDesc_plasma: '单体中伤，射速较慢',
      towerDesc_railgun: '超远射程，极高单体伤害',
      towerDesc_cannon: '小范围溅射伤害',
      towerDesc_missile: '中范围溅射，射速快',
      towerDesc_bomb: '大范围溅射，射速慢',
      towerDesc_emp: '减速敌人 50%，持续 2 秒',
      towerDesc_pulse: '范围眩晕 1.5 秒，无伤害',
      towerDesc_disruptor: '连锁闪电，最多 3 个目标',
      towerDesc_repair: '每 2 秒生成 5 资源',
      // Tower counters (tooltip: which enemies a tower is strong against)
      ttCounter: '克制 {n}',
      towerCounter_laser: '快速敌人',
      towerCounter_plasma: '普通敌人',
      towerCounter_railgun: '装甲 / Boss',
      towerCounter_cannon: '成群敌人',
      towerCounter_missile: '成群敌人',
      towerCounter_bomb: '成群 / 分裂体',
      towerCounter_emp: '隐身 / 快速',
      towerCounter_pulse: '隐身 / 成群',
      towerCounter_disruptor: '成群 / 隐身',
      // Early wave call reward
      earlyCallMsg: '提前召唤下一波，奖励 {n} 资源',
      // Boss warning banner
      bossWarning: '⚠ 警告：核心进程接近 ⚠',
      // Tech tree factions
      faction_energy: '能量系',
      faction_explosive: '爆破系',
      faction_electromagnetic: '电磁系',
      faction_support: '支援系',
      faction_global: '全局',
      // Tech tree nodes
      tech_energy_1: '超充电池',
      tech_energy_1_desc: '能量系塔伤害 +15%',
      tech_energy_2: '远程增幅',
      tech_energy_2_desc: '能量系塔射程 +20%',
      tech_energy_3: '快速循环',
      tech_energy_3_desc: '能量系塔射速 +20%',
      tech_explosive_1: '高爆弹药',
      tech_explosive_1_desc: '爆破系塔爆炸范围 +20%',
      tech_explosive_2: '破片弹头',
      tech_explosive_2_desc: '爆破系塔伤害 +15%',
      tech_explosive_3: '快速装填',
      tech_explosive_3_desc: '爆破系塔射速 +20%',
      tech_electromagnetic_1: '强化电磁脉冲',
      tech_electromagnetic_1_desc: '电磁系减速与眩晕效果持续 +25%',
      tech_electromagnetic_2: '广域脉冲',
      tech_electromagnetic_2_desc: '电磁系塔射程 +15%',
      tech_electromagnetic_3: '连锁反应',
      tech_electromagnetic_3_desc: '干扰器额外连锁 1 个目标',
      tech_support_1: '高效产出',
      tech_support_1_desc: '资源塔产出 +50%',
      tech_support_2: '强化核心',
      tech_support_2_desc: '每关初始生命值 +{n}',
      tech_support_3: '资源优化',
      tech_support_3_desc: '每关初始资源 +{n}',
      tech_global_1: '高级训练',
      tech_global_1_desc: '所有塔造价 -10%',
      tech_global_2: '超频系统',
      tech_global_2_desc: '所有塔射速 +10%'
    },
    en: {
      // Page
      docTitle: 'Terminal Protocol',
      // HUD
      resources: 'Resources: {n}',
      health: 'Health: {n}',
      techPoints: 'Tech: {n}',
      waveReady: 'Wave: 0/{n} — build defenses, then press "Ready"',
      waveActive: 'Wave: {cur}/{n}',
      waveCountdown: 'Wave: {cur}/{n} (next in {s}s)',
      readyBtn: 'Ready ▶',
      nextWaveBtn: 'Next Wave ▶',
      selected: 'Selected: {name} ({cost})',
      sellHint: 'Right-click to sell (50% refund)',
      soldMsg: 'Sold {name}, refunded {n} resources',
      ttDamage: 'DMG {n}',
      ttRange: 'Range {n}',
      // Result screen
      winTitle: 'LEVEL COMPLETE',
      loseTitle: 'TERMINAL BREACHED',
      winSubtitle: 'All {n} waves cleared!',
      techReward: '  +{n} tech',
      loseSubtitle: 'The terminal has been breached...',
      retry: '↻ Retry',
      nextLevel: 'Next Level ▶',
      mainMenu: '⌂ Main Menu',
      // Main menu
      menuTitle: 'TERMINAL PROTOCOL',
      menuSubtitle: 'Defend the terminal · Repel the invasion',
      startGame: '▶ Start Game',
      levelName: 'Level {n}',
      levelDone: '✓ Cleared',
      levelStart: '▶ Start',
      levelLocked: '🔒 Locked',
      chapterLabel: 'Chapter {n}',
      chapterDone: '✓ Cleared',
      // Difficulty (Phase 8)
      difficultyLabel: 'Difficulty',
      diffEasy: 'Easy',
      diffNormal: 'Normal',
      diffHard: 'Hard',
      // Endless mode (Phase 8)
      endlessBtn: '∞ Endless Mode',
      endlessLocked: '🔒 Clear all levels to unlock',
      endlessWave: 'Endless Wave: {n}',
      endlessBest: 'Best Wave: {n}',
      endlessLoseSubtitle: 'Survived to wave {n}',
      // Briefing / dialogue
      briefingTitle: 'MISSION BRIEFING',
      briefingContinue: 'Continue ▶',
      dialogueContinue: 'Continue',
      dialogueEnd: 'End',
      prologueHead: 'Sentinel Protocol · Boot Sequence',
      prologueSkip: 'Skip ▶',
      epilogueHead: 'Sentinel Protocol · Epilogue',
      logFragmentTitle: 'LOG FRAGMENT',
      ambientNote: 'Ambient broadcast detected',
      // Tower upgrade
      upgradeBtn: 'Upgrade ({n})',
      upgradeMax: 'MAX LEVEL',
      towerLevel: 'Lv.{n}',
      upgradeHint: 'Click a built tower to upgrade',
      upgradedMsg: '{name} upgraded to Lv.{n}',
      // Phase 9: in-level tutorial hints (c1l1)
      tutorialStep1: 'Pick a tower from the bottom bar (or press 1-0), then click the map to build it',
      tutorialStep2: 'Press Esc to deselect, click a built tower, then press "Upgrade" in the bottom-right panel (max Lv.3); right-click to sell (50% refund)',
      tutorialStep3: 'Press "Ready ▶" to start the first wave — calling "Next Wave" early grants a resource bonus',
      tutorialNext: 'Next ▶',
      // Phase 9: one-time first-time hints (tower bar / tech tree)
      firstTimeTowerBar: 'Click a tower in the bar to select it, then click the map to build; press 1-0 for quick select',
      firstTimeTechTree: 'Tech Tree: spend tech points (earned by clearing levels) to buff tower factions; click a node to unlock',
      firstTimeGotIt: 'Got it',
      // Time limit (6-4)
      timerLabel: 'Reset countdown {n}s',
      timeUpTitle: 'RESET COUNTDOWN EXPIRED',
      timeUpSubtitle: 'The reset program has been executed...',
      // Boss defeated
      bossDefeated: 'Core process destroyed',
      // Tech panel
      techBtn: '⚡ Tech',
      techPanelTitle: 'Tech Tree',
      close: 'Close',
      export: 'Export',
      import: 'Import',
      reset: 'Reset',
      techCost: '{n} pts',
      // Save messages
      saveCopied: 'Save code copied to clipboard',
      saveCopyPrompt: 'Copy your save code:',
      savePastePrompt: 'Paste your save code:',
      saveImported: 'Save imported',
      saveImportFailed: 'Import failed - invalid save code',
      saveResetConfirm: 'Reset all progress (tech points, unlocked levels)?',
      saveResetDone: 'Progress reset',
      // Audio buttons
      toggleSfx: 'Toggle sound effects',
      toggleMusic: 'Toggle music',
      // Boss
      bossLabel: 'CORE PROCESS',
      // Towers
      tower_laser: 'Laser',
      tower_plasma: 'Plasma',
      tower_railgun: 'Railgun',
      tower_cannon: 'Cannon',
      tower_missile: 'Missile',
      tower_bomb: 'Bomb',
      tower_emp: 'EMP',
      tower_pulse: 'Stun Pulse',
      tower_disruptor: 'Disruptor',
      tower_repair: 'Resource',
      // Tower descriptions (tooltip)
      towerDesc_laser: 'Single target, high damage, fast fire rate',
      towerDesc_plasma: 'Single target, medium damage, slower fire rate',
      towerDesc_railgun: 'Ultra long range, very high single-target damage',
      towerDesc_cannon: 'Small area splash damage',
      towerDesc_missile: 'Medium area splash, fast fire rate',
      towerDesc_bomb: 'Large area splash, slow fire rate',
      towerDesc_emp: 'Slows enemies by 50% for 2 seconds',
      towerDesc_pulse: 'Area stun for 1.5s, no damage',
      towerDesc_disruptor: 'Chain lightning to up to 3 targets',
      towerDesc_repair: 'Generates 5 resources every 2 seconds',
      // Tower counters (tooltip: which enemies a tower is strong against)
      ttCounter: 'Strong vs {n}',
      towerCounter_laser: 'Fast enemies',
      towerCounter_plasma: 'Basic enemies',
      towerCounter_railgun: 'Armored / Boss',
      towerCounter_cannon: 'Swarm enemies',
      towerCounter_missile: 'Swarm enemies',
      towerCounter_bomb: 'Swarm / Splitters',
      towerCounter_emp: 'Stealth / Fast',
      towerCounter_pulse: 'Stealth / Swarm',
      towerCounter_disruptor: 'Swarm / Stealth',
      // Early wave call reward
      earlyCallMsg: 'Early call: +{n} resources',
      // Boss warning banner
      bossWarning: '⚠ WARNING: CORE PROCESS APPROACHING ⚠',
      // Tech tree factions
      faction_energy: 'Energy',
      faction_explosive: 'Explosive',
      faction_electromagnetic: 'Electromagnetic',
      faction_support: 'Support',
      faction_global: 'Global',
      // Tech tree nodes
      tech_energy_1: 'Overcharged Cells',
      tech_energy_1_desc: 'Energy tower damage +15%',
      tech_energy_2: 'Long Range',
      tech_energy_2_desc: 'Energy tower range +20%',
      tech_energy_3: 'Fast Cycle',
      tech_energy_3_desc: 'Energy tower fire rate +20%',
      tech_explosive_1: 'High-Explosive Rounds',
      tech_explosive_1_desc: 'Explosive tower blast radius +20%',
      tech_explosive_2: 'Fragmentation Warheads',
      tech_explosive_2_desc: 'Explosive tower damage +15%',
      tech_explosive_3: 'Quick Reload',
      tech_explosive_3_desc: 'Explosive tower fire rate +20%',
      tech_electromagnetic_1: 'Enhanced EMP',
      tech_electromagnetic_1_desc: 'EM slow & stun duration +25%',
      tech_electromagnetic_2: 'Wide Pulse',
      tech_electromagnetic_2_desc: 'EM tower range +15%',
      tech_electromagnetic_3: 'Chain Reaction',
      tech_electromagnetic_3_desc: 'Disruptor chains to 1 extra target',
      tech_support_1: 'Efficient Output',
      tech_support_1_desc: 'Resource tower output +50%',
      tech_support_2: 'Reinforced Core',
      tech_support_2_desc: 'Starting health +{n} per level',
      tech_support_3: 'Resource Optimization',
      tech_support_3_desc: 'Starting resources +{n} per level',
      tech_global_1: 'Advanced Training',
      tech_global_1_desc: 'All tower costs -10%',
      tech_global_2: 'Overclock System',
      tech_global_2_desc: 'All tower fire rate +10%'
    }
  },

  // t('key', {n: 5}) → localized string with {n} placeholders filled
  t(key, args) {
    const table = this.STRINGS[this.lang] || this.STRINGS.zh;
    let s = table[key] !== undefined ? table[key] : (this.STRINGS.zh[key] || key);
    if (args) {
      for (const k of Object.keys(args)) {
        s = s.split('{' + k + '}').join(String(args[k]));
      }
    }
    return s;
  },

  // Localized display name for a tower type ('laser' → 激光 / Laser)
  towerName(type) {
    return this.t('tower_' + type);
  },

  // Localized short description for a tower type (tooltip)
  towerDesc(type) {
    return this.t('towerDesc_' + type);
  },

  // Localized "strong against" hint for a tower type (tooltip).
  // Returns '' when the tower has no counter entry (e.g. resource tower).
  towerCounter(type) {
    const key = 'towerCounter_' + type;
    const table = this.STRINGS[this.lang] || this.STRINGS.zh;
    if (table[key] !== undefined) return table[key];
    return this.STRINGS.zh[key] !== undefined ? this.STRINGS.zh[key] : '';
  },

  // Localized display name for a tech node ('energy_1' → 超充电池 / Overcharged Cells)
  techName(id, args) {
    return this.t('tech_' + id, args);
  },

  techDesc(id, args) {
    return this.t('tech_' + id + '_desc', args);
  },

  // Localized display name for a tech faction ('energy' → 能量系 / Energy)
  factionName(id) {
    return this.t('faction_' + id);
  },

  // Localized level display name. Uses the level's own name/nameEn when the
  // level exists in content/levels.js (36 named levels); falls back to the
  // generic '第 N 关' for legacy keys.
  levelName(key) {
    if (typeof levels !== 'undefined' && levels[key]) {
      return this.lang === 'en' ? levels[key].nameEn : levels[key].name;
    }
    return this.t('levelName', { n: String(key).replace('level', '') });
  },

  // Localized chapter display name (0-5 → 边缘缓冲区 / The Edge Buffer)
  chapterName(idx) {
    if (typeof chapters !== 'undefined' && chapters[idx]) {
      return this.lang === 'en' ? chapters[idx].nameEn : chapters[idx].name;
    }
    return this.t('chapterLabel', { n: idx + 1 });
  },

  setLanguage(lang) {
    if (lang !== 'zh' && lang !== 'en') return;
    this.lang = lang;
    try { localStorage.setItem('terminalProtocolLang', lang); } catch (e) { /* ignore */ }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    this._listeners.forEach(fn => { try { fn(lang); } catch (e) { /* ignore */ } });
  },

  onLanguageChange(fn) {
    this._listeners.push(fn);
  },

  // Language label shown on the toggle button (the OTHER language, so the
  // button always advertises what it will switch TO)
  toggleLabel() {
    return this.lang === 'zh' ? 'English' : '中文';
  }
};

// Restore persisted language choice (before any UI renders)
try {
  const saved = localStorage.getItem('terminalProtocolLang');
  if (saved === 'en' || saved === 'zh') I18N.lang = saved;
} catch (e) { /* ignore */ }

if (typeof module !== 'undefined' && module.exports) module.exports = I18N;
