// systems/waveManager.js - Wave management system
class WaveManager {
  constructor(game) {
    this.game = game;
    this.waves = [];
    this.currentWave = 0;
    this.waveTimer = 0;
    this.waveInterval = BALANCE.waveInterval; // seconds between waves
    this.isWaveActive = false;
    this.spawnInterval = BALANCE.spawnInterval; // seconds between enemy spawns within a wave
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.bossWarningTimer = 0; // seconds remaining of the boss warning banner
    this.endless = false; // Phase 8: endless mode (procedural waves)
  }

  addWave(enemies) {
    this.waves.push(enemies);
  }

  startNextWave() {
    if (this.currentWave < this.waves.length) {
      this.isWaveActive = true;
      const waveEnemies = this.waves[this.currentWave];

      // Queue enemies with staggered spawn times
      this.spawnQueue = waveEnemies.map((enemyData, i) => ({
        data: enemyData,
        time: i * this.spawnInterval
      }));
      this.spawnTimer = 0;

      this.currentWave++;

      // Boss wave: raise the warning banner + alarm before enemies spawn
      if (waveEnemies.some(e => e.type === 'boss')) {
        this.bossWarningTimer = 4;
        if (this.game.audio) this.game.audio.playBossWarning();
      }

      // Wave start effect + sound at the path start (Phase 6)
      const path = this.game.currentLevel ? this.game.currentLevel.path : null;
      if (path && path.length > 0 && this.game.effects) {
        this.game.effects.waveStart(path[0].x, path[0].y);
      }
      if (this.game.audio) this.game.audio.playWaveStart();
    }
  }

  callNextWave() {
    // Manually call the next wave early (skips the countdown)
    if (!this.isWaveActive && this.currentWave < this.waves.length) {
      // Reward for calling early: proportional to the countdown skipped
      const skipped = Math.max(0, this.waveInterval - this.waveTimer);
      const bonus = Math.floor(skipped * 2); // ~2 resources per second skipped
      if (bonus > 0) {
        this.game.gainResources(bonus);
        if (this.game.inputHandler) {
          this.game.inputHandler.showToast(I18N.t('earlyCallMsg', { n: bonus }));
        }
      }
      this.waveTimer = 0;
      this.startNextWave();
    }
  }

  spawnFromQueue(deltaTime) {
    if (!this.spawnQueue || this.spawnQueue.length === 0) return;
    this.spawnTimer += deltaTime;

    while (this.spawnQueue.length > 0 && this.spawnTimer >= this.spawnQueue[0].time) {
      const { data } = this.spawnQueue.shift();
      const cls = ENEMY_TYPES[data.type] || BasicEnemy;
      const enemy = new cls(this.game, data.path);

      // Phase 7: inject the level's boss name so the boss bar shows it
      if (data.type === 'boss' && this.game.currentLevel && this.game.currentLevel.boss) {
        data.bossName = this.game.currentLevel.boss.name;
        data.bossNameEn = this.game.currentLevel.boss.nameEn;
      }

      // Phase 7: apply per-wave stat overrides (hp/shield/stealth/split/summon/...)
      enemy.applyOverrides(data);

      // Phase 8: apply difficulty multipliers (hp/shield/speed)
      const diff = BALANCE.difficulty[this.game.difficulty] || BALANCE.difficulty.normal;
      enemy.health *= diff.hp;
      enemy.maxHealth *= diff.hp;
      enemy.shield *= diff.hp;
      enemy.maxShield *= diff.hp;
      enemy.baseSpeed *= diff.speed;

      this.game.addEnemy(enemy);
    }
  }

  update(deltaTime) {
    // Boss warning banner countdown
    if (this.bossWarningTimer > 0) {
      this.bossWarningTimer = Math.max(0, this.bossWarningTimer - deltaTime);
    }

    // Spawn queued enemies for the active wave
    if (this.isWaveActive) {
      this.spawnFromQueue(deltaTime);
    }

    // Wave is done when all its enemies are dead (and queue is empty)
    if (this.isWaveActive && this.game.enemies.length === 0 && this.spawnQueue.length === 0) {
      this.isWaveActive = false;
      this.waveTimer = 0;
    }

    // Phase 8: endless mode — keep one procedurally generated wave queued ahead
    if (this.endless && !this.isWaveActive && this.currentWave >= this.waves.length &&
        this.game.enemies.length === 0 && this.spawnQueue.length === 0) {
      this.addWave(this.generateEndlessWave(this.currentWave + 1));
    }

    if (!this.isWaveActive && this.currentWave < this.waves.length) {
      this.waveTimer += deltaTime;

      if (this.waveTimer >= this.waveInterval) {
        this.startNextWave();
        this.waveTimer = 0;
      }
    }
  }

  checkWavesComplete() {
    // Endless mode never completes — waves are generated forever
    return !this.endless && this.currentWave >= this.waves.length;
  }

  // Phase 8: procedurally generate endless wave n (1-based).
  // Enemy count, HP, speed, and rewards scale with the wave number;
  // a boss appears every 10th wave.
  generateEndlessWave(n) {
    const path = this.game.currentLevel ? this.game.currentLevel.path : null;
    const wave = [];
    const count = 6 + Math.floor(n * 1.5);
    const hpScale = 1 + (n - 1) * 0.12;
    const speedScale = 1 + Math.min(0.5, (n - 1) * 0.01);
    const rewardScale = 1 + (n - 1) * 0.05;

    for (let i = 0; i < count; i++) {
      let type = 'basic';
      if (n >= 3 && i % 4 === 1) type = 'fast';
      if (n >= 5 && i % 5 === 2) type = 'armored';
      if (n >= 6 && i % 8 === 5) type = 'healer';
      if (n >= 8 && i % 7 === 3) type = 'stealth';
      if (n >= 10 && i % 6 === 4) type = 'splitter';
      const base = BALANCE.enemies[type];
      wave.push({
        type: type,
        path: path,
        hp: Math.round(base.hp * hpScale),
        speed: Math.round(base.speed * speedScale),
        reward: Math.round(base.reward * rewardScale)
      });
    }

    // Boss every 10th wave, scaling with the cycle number
    if (n % 10 === 0) {
      const boss = BALANCE.enemies.boss;
      const cycle = n / 10;
      wave.push({
        type: 'boss',
        path: path,
        hp: Math.round(boss.hp * (1 + (cycle - 1) * 0.5)),
        reward: Math.round(boss.reward * rewardScale)
      });
    }
    return wave;
  }

  reset() {
    this.waves = [];
    this.currentWave = 0;
    this.waveTimer = 0;
    this.isWaveActive = false;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.bossWarningTimer = 0;
    this.endless = false;
  }
}