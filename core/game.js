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
    this.selectedTowerType = 'laser'; // Default tower type
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
    this.waveManager.update(deltaTime);
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
    const ctx = this.ctx;
    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render path
    if (this.currentLevel && this.currentLevel.path) {
      this.renderPath(ctx);
    }

    // Render game elements
    this.towers.forEach(tower => tower.render(ctx));
    this.enemies.forEach(enemy => enemy.render(ctx));
    this.projectiles.forEach(projectile => projectile.render(ctx));

    // Render UI
    this.renderUI();
  }

  renderPath(ctx) {
    const path = this.currentLevel.path;
    if (!path || path.length < 2) return;

    // Draw path glow
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();

    // Draw path core
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw start marker
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(path[0].x, path[0].y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw end marker
    const end = path[path.length - 1];
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(end.x, end.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  renderUI() {
    const ctx = this.ctx;
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Resources: ${Math.floor(this.resources)}`, 10, 10);
    ctx.fillText(`Health: ${this.health}`, 10, 30);
    ctx.fillText(`Wave: ${this.waveManager.currentWave}/${this.waveManager.waves.length}`, 10, 50);

    // Show selected tower info
    if (this.selectedTowerType) {
      const info = TOWER_TYPES[this.selectedTowerType];
      ctx.fillStyle = info.color;
      ctx.fillText(`Selected: ${info.name} (${info.cost})`, 10, 70);
    }
  }

  gameOver(isWin) {
    this.isRunning = false;
    
    // Show game over message on canvas
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    ctx.fillStyle = isWin ? '#00ff88' : '#ff4444';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      isWin ? 'LEVEL COMPLETE!' : 'GAME OVER',
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(
      isWin ? 'All waves defeated!' : 'The terminal was breached...',
      this.canvas.width / 2,
      this.canvas.height / 2 + 40
    );
    
    console.log(isWin ? 'Level Complete!' : 'Game Over!');
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