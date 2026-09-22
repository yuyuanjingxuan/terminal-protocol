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

    // Draw path with neon effect
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 25;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }

    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }

    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw start and end points with neon effect
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(path[0].x, path[0].y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Add glow to start point
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
    ctx.beginPath();
    ctx.arc(path[0].x, path[0].y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(path[path.length - 1].x, path[path.length - 1].y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Add glow to end point
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(255, 68, 68, 0.5)';
    ctx.beginPath();
    ctx.arc(path[path.length - 1].x, path[path.length - 1].y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
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