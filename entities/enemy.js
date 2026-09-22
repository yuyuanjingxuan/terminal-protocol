// entities/enemy.js - Base Enemy class
class Enemy {
  constructor(game, path) {
    this.game = game;
    this.path = path;
    this.pathIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.speed = 50; // pixels per second
    this.health = 30;
    this.maxHealth = 30;
    this.isDead = false;
    this.reward = 10; // resources rewarded when killed
  }

  update(deltaTime) {
    if (this.isDead) return;

    // Move along path
    if (this.pathIndex < this.path.length - 1) {
      const targetPoint = this.path[this.pathIndex + 1];
      const dx = targetPoint.x - this.x;
      const dy = targetPoint.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const moveX = (dx / distance) * this.speed * deltaTime;
        const moveY = (dy / distance) * this.speed * deltaTime;

        this.x += moveX;
        this.y += moveY;

        // Check if we've reached the next point
        const newDistance = Math.sqrt(
          Math.pow(targetPoint.x - this.x, 2) + Math.pow(targetPoint.y - this.y, 2)
        );

        if (newDistance < 5) { // Close enough to next point
          this.pathIndex++;
        }
      }
    } else {
      // Reached the end - damage player
      this.game.takeDamage(1);
      this.isDead = true;
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.game.gainResources(this.reward);
  }

  render(ctx) {
    // Draw enemy with neon effect
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(255, 68, 68, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw health bar
    const healthPercentage = this.health / this.maxHealth;
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(this.x - 10, this.y - 15, 20 * healthPercentage, 4);
  }
}

// Basic enemy implementation
class BasicEnemy extends Enemy {
  constructor(game, path) {
    super(game, path);
    this.speed = 60;
    this.health = 25;
    this.maxHealth = 25;
    this.reward = 8;
  }

  render(ctx) {
    // Draw basic enemy with neon effect
    ctx.fillStyle = '#F44336';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = '#F44336';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(244, 67, 54, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw health bar
    const healthPercentage = this.health / this.maxHealth;
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(this.x - 10, this.y - 15, 20 * healthPercentage, 4);
  }
}