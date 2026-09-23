// systems/waveManager.js - Wave management system
class WaveManager {
  constructor(game) {
    this.game = game;
    this.waves = [];
    this.currentWave = 0;
    this.waveTimer = 0;
    this.waveInterval = 5; // seconds between waves
    this.isWaveActive = false;
  }

  addWave(enemies) {
    this.waves.push(enemies);
  }

  startNextWave() {
    if (this.currentWave < this.waves.length) {
      this.isWaveActive = true;
      const waveEnemies = this.waves[this.currentWave];

      // Spawn all enemies in this wave
      waveEnemies.forEach(enemyData => {
        const enemy = new BasicEnemy(this.game, enemyData.path);
        this.game.addEnemy(enemy);
      });

      this.currentWave++;
    }
  }

  update(deltaTime) {
    // Wave is done when all its enemies are dead
    if (this.isWaveActive && this.game.enemies.length === 0) {
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
    this.currentWave = 0;
    this.waveTimer = 0;
    this.isWaveActive = false;
  }
}