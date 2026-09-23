// systems/waveManager.js - Wave management system
class WaveManager {
  constructor(game) {
    this.game = game;
    this.waves = [];
    this.currentWave = 0;
    this.waveTimer = 0;
    this.waveInterval = 5; // seconds between waves
    this.isWaveActive = false;
    this.spawnInterval = 0.8; // seconds between enemy spawns within a wave
    this.spawnQueue = [];
    this.spawnTimer = 0;
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
    }
  }

  callNextWave() {
    // Manually call the next wave early (skips the countdown)
    if (!this.isWaveActive && this.currentWave < this.waves.length) {
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
      this.game.addEnemy(enemy);
    }
  }

  update(deltaTime) {
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
  }
}