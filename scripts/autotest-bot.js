// Headless auto-play bot — balance/regression test for all 36 campaign levels.
// Injected via page.addScriptTag (served over HTTP, e.g. `python -m http.server`).
// Plays each level with a simple TD strategy (DPS-first build, tech investment,
// early wave calls) and reports win/lose, waves, health, towers, time.
// Usage (Playwright):
//   await page.addScriptTag({ url: 'http://localhost:PORT/scripts/autotest-bot.js' });
//   const results = await page.evaluate(() => window.__runAutotest()); // all 36
//   const results = await page.evaluate(() => window.__runAutotest(['c5l6'])); // subset
// Requires the `window.__tp` test hook in main.js.
(function () {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function buildAt(g, type, x, y) {
    const info = TOWER_TYPES[type];
    if (!info) return false;
    if (!g.isValidTowerPosition(x, y)) return false;
    const tower = new info.class(g, x, y);
    g.techTree.applyToTower(tower);
    if (!g.spendResources(tower.cost)) return false;
    g.addTower(tower);
    return true;
  }

  // Candidate spots: 40px grid, scored by how much path length falls in range.
  function candidateSpots(g, range) {
    const path = g.currentLevel.path;
    const spots = [];
    for (let x = 20; x <= 780; x += 40) {
      for (let y = 20; y <= 580; y += 40) {
        if (!g.isValidTowerPosition(x, y)) continue;
        // Must be near the path (within range) to be useful
        let minD = Infinity;
        for (let i = 0; i < path.length - 1; i++) {
          const d = g.distanceToSegment(x, y, path[i], path[i + 1]);
          if (d < minD) minD = d;
        }
        if (minD < 36 || minD > range) continue;
        // Coverage: sample path every 10px, count points within range
        let cover = 0;
        for (let i = 0; i < path.length - 1; i++) {
          const a = path[i], b = path[i + 1];
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          const steps = Math.max(1, Math.floor(len / 10));
          for (let s = 0; s <= steps; s++) {
            const px = a.x + (b.x - a.x) * s / steps;
            const py = a.y + (b.y - a.y) * s / steps;
            if (Math.hypot(px - x, py - y) <= range) cover++;
          }
        }
        spots.push({ x, y, cover });
      }
    }
    // Prefer spots covering the most path, deterministic order
    spots.sort((a, b) => b.cover - a.cover || a.x - b.x || a.y - b.y);
    return spots;
  }

  function pickTowerType(g, levelKey) {
    const hasStealth = /c[2-6]/.test(levelKey);
    const hasArmored = /c[3-6]/.test(levelKey);
    const hasHealer = /c[4-6]/.test(levelKey);
    const hasSplitter = /c[5-6]/.test(levelKey);
    const r = g.resources;
    const count = (type) => g.towers.filter(t => t.type === type).length;
    const dpsCount = ['laser', 'plasma', 'railgun', 'cannon', 'missile', 'bomb']
      .reduce((n, t) => n + count(t), 0);
    const supportCount = ['emp', 'pulse', 'disruptor']
      .reduce((n, t) => n + count(t), 0);
    // Support towers only when DPS leads (support without kills is a waste)
    if (dpsCount >= supportCount + 1) {
      if (hasStealth && count('emp') < 2 && r >= 45) return 'emp';
      if (hasHealer && count('pulse') < 1 && r >= 70) return 'pulse';
      if (hasSplitter && count('cannon') < 2 && r >= 60) return 'cannon';
    }
    // DPS: laser first (cheap, high DPS density); railgun for armored once we can afford it
    if (hasArmored && count('railgun') < 3 && r >= 120 && dpsCount >= 3) return 'railgun';
    if (r >= 50) return 'laser';
    return null;
  }

  // Invest accumulated tech points like a real player would (laser-focused).
  // Called at the start of each level; tech tree persists across levels.
  const TECH_PRIORITY = [
    'energy_1', 'energy_2', 'energy_3',   // laser damage/range/cooldown
    'support_1', 'support_2', 'support_3', // +health, +starting resources
    'global_1', 'global_2',               // cheaper towers, faster fire
    'explosive_1', 'explosive_2', 'explosive_3',
    'electromagnetic_1', 'electromagnetic_2', 'electromagnetic_3'
  ];
  function investTech(g) {
    const tt = g.techTree;
    for (const id of TECH_PRIORITY) {
      if (tt.canUnlock(id)) tt.unlockNode(id);
    }
  }

  function botTick(g) {
    // 1) Upgrade existing towers only once the base is established (6+ towers),
    //    so early resources go to building, not upgrading.
    if (g.towers.length >= 6) {
      for (const t of g.towers) {
        if (t.level < t.maxLevel && g.resources >= t.upgradeCost() + 100) {
          g.selectedTower = t;
          g.upgradeSelectedTower();
        }
      }
    }
    g.selectedTower = null;
    // 2) Build new towers while we can afford; track whether we built anything
    let builtAny = false;
    let guard = 0;
    while (guard++ < 20) {
      const type = pickTowerType(g, g.currentLevel.key);
      if (!type) break;
      const range = TOWER_TYPES[type].range;
      const spots = candidateSpots(g, range);
      let built = false;
      for (const s of spots) {
        if (buildAt(g, type, s.x, s.y)) { built = true; builtAny = true; break; }
      }
      if (!built) break;
    }
    // 3) Ready state: start once we can't afford the cheapest tower (45) or have 5+.
    //    Playing state: call next wave early for the bonus.
    const wm = g.waveManager;
    if (g.gameState === 'ready') {
      if (g.towers.length >= 5 || g.resources < 45) g.startPlaying();
    } else if (g.gameState === 'playing' && !wm.isWaveActive && wm.currentWave < wm.waves.length) {
      wm.callNextWave();
    }
  }

  async function playLevel(tp, key) {
    const g = tp.game;
    // Skip intro/briefing overlays
    const brief = document.getElementById('briefingPanel');
    if (brief) brief.classList.remove('show');
    const dlg = document.getElementById('dialogueBox');
    if (dlg) dlg.classList.remove('show');

    // Invest tech points earned from prior levels BEFORE loadLevel reads
    // getStartingResources()/getStartingHealth() (mirrors a real player).
    investTech(g);
    tp.loadLevel(key);
    g.speed = 3;
    g.selectedTowerType = null;

    // Intercept gameOver to capture the true win/lose result
    let result = null;
    const origGameOver = g.gameOver.bind(g);
    g.gameOver = (isWin, reason) => { result = { win: isWin, reason: reason || null }; origGameOver(isWin, reason); };

    const t0 = Date.now();
    while (g.gameState !== 'gameover' && Date.now() - t0 < 180000) {
      botTick(g);
      await sleep(100);
    }
    g.gameOver = origGameOver;
    const win = !!(result && result.win);
    const waves = g.waveManager ? g.waveManager.currentWave : 0;
    const totalWaves = g.waveManager ? g.waveManager.waves.length : 0;
    const health = g.health;
    const towers = g.towers.length;
    const res = Math.floor(g.resources);
    // Hide result screen for next level
    const rs = document.getElementById('resultScreen');
    if (rs) rs.classList.remove('show');
    return { key, win, reason: result ? result.reason : 'timeout', waves: `${waves}/${totalWaves}`, health, towers, res, secs: Math.round((Date.now() - t0) / 1000) };
  }

  window.__botTick = botTick; // Exposed for diagnostics

  window.__runAutotest = async function (keys) {
    const tp = window.__tp;
    const g = tp.game;
    const allKeys = Object.keys(levels);
    const runKeys = keys || allKeys;
    const results = [];
    for (const key of runKeys) {
      const r = await playLevel(tp, key);
      results.push(r);
      console.log(`[autotest] ${key}: ${r.win ? 'WIN' : 'LOSE'} waves=${r.waves} hp=${r.health} towers=${r.towers} res=${r.res} ${r.secs}s`);
    }
    return results;
  };
})();
