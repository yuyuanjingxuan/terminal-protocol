// entities/tower.js - Base Tower class
class Tower {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.range = 100;
    this.damage = 10;
    this.cooldown = 1; // seconds
    this.currentCooldown = 0;
    this.target = null;
    this.cost = 50;
  }

  update(deltaTime) {
    this.currentCooldown -= deltaTime;

    if (this.currentCooldown <= 0) {
      this.findTarget();
      if (this.target) {
        this.attack();
        this.currentCooldown = this.cooldown;
      }
    }
  }

  findTarget() {
    // Find closest enemy in range
    let closestEnemy = null;
    let closestDistance = this.range;

    this.game.enemies.forEach(enemy => {
      const distance = Math.sqrt(
        Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    });

    this.target = closestEnemy;
  }

  attack() {
    if (this.target) {
      // Create a projectile
      const projectile = new Projectile(
        this.game,
        this.x,
        this.y,
        this.target.x,
        this.target.y,
        this.damage
      );
      this.game.addProjectile(projectile);
    }
  }

  render(ctx) {
    // Draw tower base with neon effect
    ctx.fillStyle = '#00a2ff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = '#00a2ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(0, 162, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator (for debugging)
    ctx.strokeStyle = 'rgba(0, 162, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Basic tower implementation
class BasicTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 15;
    this.cooldown = 0.8;
    this.cost = 60;
  }

  render(ctx) {
    // Draw basic tower with neon effect
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = '#4CAF50';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(76, 175, 80, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw tower top
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}