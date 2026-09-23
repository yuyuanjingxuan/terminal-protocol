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

    if (!this.isWaveActive && this.currentWave < this.waves.length) {
      this.waveTimer += deltaTime;

      if (this.waveTimer >= this.waveInterval) {
        this.startNextWave();
        this.waveTimer = 0;
      }
    }
  }

  checkWavesComplete() {
    return this.currentWave >= this.waves.length;
  }

  reset() {
    this.waves = [];
    this.currentWave = 0;
    this.waveTimer = 0;
    this.isWaveActive = false;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.bossWarningTimer = 0;
  }
}