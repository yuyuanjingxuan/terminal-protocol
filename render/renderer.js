// render/renderer.js - Rendering system
class Renderer {
  constructor(game) {
    this.game = game;
  }

  render() {
    const ctx = this.game.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // Render path
    this.renderPath();

    // Render entities
    this.game.enemies.forEach(enemy => enemy.render(ctx));
    this.game.towers.forEach(tower => tower.render(ctx));
    this.game.projectiles.forEach(projectile => projectile.render(ctx));

    // Render UI
    this.renderUI();
  }

  renderPath() {
    const ctx = this.game.ctx;
    const path = this.game.currentLevel.path;

    if (!path || path.length < 2) return;

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }

    ctx.stroke();

    // Draw start and end points
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(path[0].x, path[0].y, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(path[path.length - 1].x, path[path.length - 1].y, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  renderUI() {
    const ctx = this.game.ctx;

    // Draw resources and health
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Resources: ${this.game.resources}`, 10, 20);
    ctx.fillText(`Health: ${this.game.health}`, 10, 40);

    // Draw wave info
    if (this.game.waveManager) {
      ctx.fillText(
        `Wave: ${this.game.waveManager.currentWave}/${this.game.waveManager.waves.length}`,
        10,
        60
      );
    }
  }
}