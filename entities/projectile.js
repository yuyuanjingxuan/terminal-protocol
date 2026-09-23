// entities/projectile.js - Projectile classes
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
    this.color = 'yellow';

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

    // Impact spark effect
    if (this.game.effects) {
      this.game.effects.burst(this.targetX, this.targetY, this.color, 5, { speed: 80, life: 0.25, size: 2 });
    }

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
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

class ExplosionProjectile extends Projectile {
  constructor(game, startX, startY, targetX, targetY, damage, explosionRadius) {
    super(game, startX, startY, targetX, targetY, damage);
    this.explosionRadius = explosionRadius;
    this.color = '#ff6600';
  }

  hitTarget() {
    this.isDead = true;

    // Explosion effect + sound
    if (this.game.effects) this.game.effects.explosion(this.targetX, this.targetY, this.explosionRadius);
    if (this.game.audio) this.game.audio.playExplosion();

    // Find all enemies in explosion radius
    const enemies = this.game.enemies;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const distance = Math.sqrt(
        Math.pow(enemy.x - this.targetX, 2) + Math.pow(enemy.y - this.targetY, 2)
      );

      if (distance < this.explosionRadius) {
        enemy.takeDamage(this.damage);
      }
    }
  }

  render(ctx) {
    // Draw explosion projectile
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(255, 102, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

class LaserProjectile extends Projectile {
  constructor(game, startX, startY, targetX, targetY, damage) {
    super(game, startX, startY, targetX, targetY, damage);
    this.speed = 500; // Faster than regular projectiles
    this.color = '#00f0ff';
    this.width = 3;

    // Recalculate velocity with new speed
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.velocityX = (dx / distance) * this.speed;
    this.velocityY = (dy / distance) * this.speed;
  }

  render(ctx) {
    // Draw laser beam
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.velocityX * 0.1, this.y - this.velocityY * 0.1);
    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = this.width + 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.velocityX * 0.1, this.y - this.velocityY * 0.1);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

class EMPProjectile extends Projectile {
  constructor(game, startX, startY, targetX, targetY, damage, slowAmount, slowDuration) {
    super(game, startX, startY, targetX, targetY, damage);
    this.slowAmount = slowAmount;
    this.slowDuration = slowDuration;
    this.color = '#9c27b0';
  }

  hitTarget() {
    this.isDead = true;

    // EMP impact: purple ring
    if (this.game.effects) this.game.effects.pulseRing(this.targetX, this.targetY, 60, '#9c27b0');

    // Find enemy at target position and apply slow
    const enemies = this.game.enemies;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const distance = Math.sqrt(
        Math.pow(enemy.x - this.targetX, 2) + Math.pow(enemy.y - this.targetY, 2)
      );

      if (distance < 15) {
        enemy.takeDamage(this.damage);
        enemy.applySlow(this.slowAmount, this.slowDuration);
        // EM faction reveals stealthed enemies near the impact
        enemy.reveal(this.slowDuration + 1);
        for (const other of enemies) {
          if (other === enemy || other.isDead) continue;
          const d = Math.sqrt(Math.pow(other.x - enemy.x, 2) + Math.pow(other.y - enemy.y, 2));
          if (d < 60) other.reveal(this.slowDuration + 1);
        }
        break;
      }
    }
  }

  render(ctx) {
    // Draw EMP projectile
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(156, 39, 176, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

class PulseProjectile extends Projectile {
  constructor(game, startX, startY, radius, stunDuration) {
    super(game, startX, startY, startX, startY, 0);
    this.radius = radius;
    this.stunDuration = stunDuration;
    this.color = '#673ab7';
    this.speed = 0; // Doesn't move
    this.velocityX = 0;
    this.velocityY = 0;
    this.lifetime = 0.5; // seconds
    this.currentLifetime = 0;
  }

  update(deltaTime) {
    this.currentLifetime += deltaTime;

    if (this.currentLifetime >= this.lifetime) {
      this.hitTarget();
    }
  }

  hitTarget() {
    this.isDead = true;

    // Pulse: expanding ring + sound
    if (this.game.effects) this.game.effects.pulseRing(this.x, this.y, this.radius, '#673ab7');
    if (this.game.audio) this.game.audio.playPulse();

    // Find all enemies in pulse radius and stun them
    const enemies = this.game.enemies;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const distance = Math.sqrt(
        Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2)
      );

      if (distance < this.radius) {
        enemy.applyStun(this.stunDuration);
        // Pulse also reveals stealthed enemies in the radius
        enemy.reveal(this.stunDuration + 1);
      }
    }
  }

  render(ctx) {
    // Draw pulse effect
    const progress = this.currentLifetime / this.lifetime;
    const currentRadius = this.radius * progress;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = 'rgba(103, 58, 183, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

class ChainProjectile extends Projectile {
  constructor(game, startX, startY, targetX, targetY, damage, chainTargets, chainDamage, range) {
    super(game, startX, startY, targetX, targetY, damage);
    this.chainTargets = chainTargets;
    this.chainDamage = chainDamage;
    this.range = range;
    this.chainCount = 0;
    this.color = '#3f51b5';
    this.chainedEnemies = [];
  }

  hitTarget() {
    this.chainedEnemies.push({x: this.targetX, y: this.targetY});
    this.chainCount++;

    // Chain lightning spark
    if (this.game.effects) {
      this.game.effects.burst(this.targetX, this.targetY, this.color, 4, { speed: 70, life: 0.2, size: 2 });
    }

    // Damage current target
    const enemies = this.game.enemies;
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const distance = Math.sqrt(
        Math.pow(enemy.x - this.targetX, 2) + Math.pow(enemy.y - this.targetY, 2)
      );

      if (distance < 15) {
        enemy.takeDamage(this.damage);
        // Disruptor chains reveal stealthed enemies
        enemy.reveal(2);
        break;
      }
    }

    // Find next target to chain to
    if (this.chainCount < this.chainTargets) {
      let closestEnemy = null;
      let closestDistance = this.range;

      enemies.forEach(enemy => {
        // Don't chain to already chained enemies
        const alreadyChained = this.chainedEnemies.some(
          pos => Math.sqrt(Math.pow(pos.x - enemy.x, 2) + Math.pow(pos.y - enemy.y, 2)) < 15
        );

        if (!alreadyChained) {
          const distance = Math.sqrt(
            Math.pow(enemy.x - this.targetX, 2) + Math.pow(enemy.y - this.targetY, 2)
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = enemy;
          }
        }
      });

      if (closestEnemy) {
        // Chain to next enemy
        this.targetX = closestEnemy.x;
        this.targetY = closestEnemy.y;
        this.damage *= this.chainDamage;

        // Recalculate direction
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.velocityX = (dx / distance) * this.speed;
        this.velocityY = (dy / distance) * this.speed;
      } else {
        this.isDead = true;
      }
    } else {
      this.isDead = true;
    }
  }

  render(ctx) {
    // Draw chain lightning
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.targetX, this.targetY);
    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(63, 81, 181, 0.5)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.targetX, this.targetY);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw chained positions
    this.chainedEnemies.forEach(pos => {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

class RepairProjectile extends Projectile {
  constructor(game, startX, startY, targetX, targetY, repairAmount, repairDuration) {
    super(game, startX, startY, targetX, targetY, 0);
    this.repairAmount = repairAmount;
    this.repairDuration = repairDuration;
    this.color = '#4CAF50';
    this.speed = 400;

    // Recalculate velocity with new speed
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.velocityX = (dx / distance) * this.speed;
    this.velocityY = (dy / distance) * this.speed;
  }

  hitTarget() {
    this.isDead = true;

    // Repair beam: green motes at the target tower
    if (this.game.effects) this.game.effects.repairEffect(this.targetX, this.targetY);

    // Find tower at target position and repair it
    const towers = this.game.towers;
    for (let i = 0; i < towers.length; i++) {
      const tower = towers[i];
      const distance = Math.sqrt(
        Math.pow(tower.x - this.targetX, 2) + Math.pow(tower.y - this.targetY, 2)
      );

      if (distance < 15) {
        break;
      }
    }
  }

  render(ctx) {
    // Draw repair beam
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.targetX, this.targetY);
    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.6)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.targetX, this.targetY);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  }
}