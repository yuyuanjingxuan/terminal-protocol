// core/game.js - Game loop and state management
class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
    this.currentLevel = null;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.resources = 100; // Starting resources
    this.health = 10; // Starting health
    this.waveManager = null;
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

    this.update(this.deltaTime);
    this.render();

    if (this.isRunning) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }

  update(deltaTime) {
    // Update game state
    this.towers.forEach(tower => tower.update(deltaTime));
    this.enemies.forEach(enemy => enemy.update(deltaTime));
    this.projectiles.forEach(projectile => projectile.update(deltaTime));

    // Clean up dead entities
    this.enemies = this.enemies.filter(enemy => !enemy.isDead);
    this.projectiles = this.projectiles.filter(projectile => !projectile.isDead);

    // Check game over conditions
    if (this.health <= 0) {
      this.gameOver(false);
    }

    // Check wave completion
    if (this.waveManager.checkWavesComplete() && this.enemies.length === 0) {
      this.gameOver(true);
    }
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render game elements
    this.enemies.forEach(enemy => enemy.render(this.ctx));
    this.towers.forEach(tower => tower.render(this.ctx));
    this.projectiles.forEach(projectile => projectile.render(this.ctx));

    // Render UI
    this.renderUI();
  }

  renderUI() {
    // Draw resources and health
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Resources: ${this.resources}`, 10, 20);
    this.ctx.fillText(`Health: ${this.health}`, 10, 40);
  }

  gameOver(isWin) {
    this.isRunning = false;
    console.log(isWin ? 'Level Complete!' : 'Game Over!');
    // TODO: Show game over screen
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
}