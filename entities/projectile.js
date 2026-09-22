// entities/projectile.js - Projectile class
class Projectile {
  constructor(game, startX, startY, targetX, targetY, damage) {
    this.game = game;
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.damage = damage;
    this.speed = 300; // pixels per second
    this.isDead = false;

    // Calculate direction
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.velocityX = (dx / distance) * this.speed;
    this.velocityY = (dy / distance) * this.speed;
  }

  update(deltaTime) {
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;

    // Check if reached target
    const distanceToTarget = Math.sqrt(
      Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2)
    );

    if (distanceToTarget < 5) {
      this.hitTarget();
    }
  }

  hitTarget() {
    this.isDead = true;

    // Find enemy at target position and deal damage
    const enemies = this.game.enemies;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const distance = Math.sqrt(
        Math.pow(enemy.x - this.targetX, 2) + Math.pow(enemy.y - this.targetY, 2)
      );

      if (distance < 15) { // Close enough to be the target
        enemy.takeDamage(this.damage);
        break;
      }
    }
  }

  render(ctx) {
    // Draw projectile
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}