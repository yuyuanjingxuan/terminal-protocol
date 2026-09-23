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

// Energy Faction - Single target high damage
class LaserTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 25;
    this.cooldown = 1.2;
    this.range = 150;
    this.cost = 80;
    this.color = '#00f0ff';
  }

  render(ctx) {
    // Draw laser tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class PlasmaTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 35;
    this.cooldown = 1.8;
    this.range = 120;
    this.cost = 100;
    this.color = '#00a2ff';
  }

  render(ctx) {
    // Draw plasma tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(0, 162, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(0, 162, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class RailgunTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 50;
    this.cooldown = 3.0;
    this.range = 200;
    this.cost = 150;
    this.color = '#0066ff';
  }

  render(ctx) {
    // Draw railgun tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 25;
    ctx.fillStyle = 'rgba(0, 102, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(0, 102, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Explosive Faction - Area of effect damage
class CannonTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 20;
    this.cooldown = 2.0;
    this.range = 100;
    this.cost = 90;
    this.color = '#ff6600';
    this.explosionRadius = 40;
  }

  attack() {
    if (this.target) {
      // Create explosion projectile
      const projectile = new ExplosionProjectile(
        this.game,
        this.x,
        this.y,
        this.target.x,
        this.target.y,
        this.damage,
        this.explosionRadius
      );
      this.game.addProjectile(projectile);
    }
  }

  render(ctx) {
    // Draw cannon tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(255, 102, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(255, 102, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();

    // Draw explosion radius indicator
    ctx.strokeStyle = 'rgba(255, 102, 0, 0.1)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class MissileTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 18;
    this.cooldown = 1.5;
    this.range = 130;
    this.cost = 75;
    this.color = '#ff3300';
    this.explosionRadius = 35;
  }

  attack() {
    if (this.target) {
      // Create missile projectile
      const projectile = new ExplosionProjectile(
        this.game,
        this.x,
        this.y,
        this.target.x,
        this.target.y,
        this.damage,
        this.explosionRadius
      );
      this.game.addProjectile(projectile);
    }
  }

  render(ctx) {
    // Draw missile tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(255, 51, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(255, 51, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();

    // Draw explosion radius indicator
    ctx.strokeStyle = 'rgba(255, 51, 0, 0.1)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class BombTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 22;
    this.cooldown = 2.5;
    this.range = 90;
    this.cost = 110;
    this.color = '#cc0000';
    this.explosionRadius = 50;
  }

  attack() {
    if (this.target) {
      // Create bomb projectile
      const projectile = new ExplosionProjectile(
        this.game,
        this.x,
        this.y,
        this.target.x,
        this.target.y,
        this.damage,
        this.explosionRadius
      );
      this.game.addProjectile(projectile);
    }
  }

  render(ctx) {
    // Draw bomb tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(204, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(204, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();

    // Draw explosion radius indicator
    ctx.strokeStyle = 'rgba(204, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Electromagnetic Faction - Control and debuff
class EMPTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 5;
    this.cooldown = 0.5;
    this.range = 140;
    this.cost = 70;
    this.color = '#9c27b0';
    this.slowAmount = 0.5; // 50% slow
    this.slowDuration = 2.0; // seconds
  }

  attack() {
    if (this.target) {
      // Create EMP projectile that slows enemies
      const projectile = new EMPProjectile(
        this.game,
        this.x,
        this.y,
        this.target.x,
        this.target.y,
        this.damage,
        this.slowAmount,
        this.slowDuration
      );
      this.game.addProjectile(projectile);
    }
  }

  render(ctx) {
    // Draw EMP tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(156, 39, 176, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(156, 39, 176, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class PulseTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 0; // No direct damage
    this.cooldown = 3.0;
    this.range = 180;
    this.cost = 90;
    this.color = '#673ab7';
    this.pulseRadius = 100;
    this.stunDuration = 1.5; // seconds
  }

  attack() {
    if (this.target) {
      // Create pulse that stuns all enemies in radius
      const projectile = new PulseProjectile(
        this.game,
        this.x,
        this.y,
        this.pulseRadius,
        this.stunDuration
      );
      this.game.addProjectile(projectile);
    }
  }

  render(ctx) {
    // Draw pulse tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(103, 58, 183, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(103, 58, 183, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();

    // Draw pulse radius indicator
    ctx.strokeStyle = 'rgba(103, 58, 183, 0.15)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.pulseRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class DisruptorTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 8;
    this.cooldown = 1.0;
    this.range = 160;
    this.cost = 85;
    this.color = '#3f51b5';
    this.chainTargets = 3; // Number of enemies to chain to
    this.chainDamage = 0.6; // 60% damage per chain
  }

  attack() {
    if (this.target) {
      // Create chain lightning projectile
      const projectile = new ChainProjectile(
        this.game,
        this.x,
        this.y,
        this.target.x,
        this.target.y,
        this.damage,
        this.chainTargets,
        this.chainDamage,
        this.range
      );
      this.game.addProjectile(projectile);
    }
  }

  render(ctx) {
    // Draw disruptor tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(63, 81, 181, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(63, 81, 181, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Support Faction - Buffs and utility
class RepairTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 0; // No direct damage
    this.cooldown = 2.0;
    this.range = 120;
    this.cost = 60;
    this.color = '#4CAF50';
    this.repairAmount = 5; // Health repaired per second
    this.repairDuration = 3.0; // seconds
  }

  findTarget() {
    // Find closest damaged tower in range
    let closestTower = null;
    let closestDistance = this.range;

    this.game.towers.forEach(tower => {
      if (tower === this) return; // Don't target self

      const distance = Math.sqrt(
        Math.pow(tower.x - this.x, 2) + Math.pow(tower.y - this.y, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestTower = tower;
      }
    });

    this.target = closestTower;
  }

  attack() {
    if (this.target) {
      // Create repair beam
      const projectile = new RepairProjectile(
        this.game,
        this.x,
        this.y,
        this.target.x,
        this.target.y,
        this.repairAmount,
        this.repairDuration
      );
      this.game.addProjectile(projectile);
    }
  }

  render(ctx) {
    // Draw repair tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }
}

class BoostTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 0; // No direct damage
    this.cooldown = 1.0;
    this.range = 150;
    this.cost = 75;
    this.color = '#FFEB3B';
    this.boostAmount = 0.3; // 30% damage boost
    this.boostDuration = 5.0; // seconds
  }

  findTarget() {
    // Find closest tower in range to boost
    let closestTower = null;
    let closestDistance = this.range;

    this.game.towers.forEach(tower => {
      if (tower === this) return; // Don't target self

      const distance = Math.sqrt(
        Math.pow(tower.x - this.x, 2) + Math.pow(tower.y - this.y, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestTower = tower;
      }
    });

    this.target = closestTower;
  }

  attack() {
    if (this.target) {
      // Apply boost to target tower
      this.target.damage *= (1 + this.boostAmount);
      this.target.color = '#FFEB3B'; // Change color to show boost

      // Reset boost after duration
      setTimeout(() => {
        this.target.damage /= (1 + this.boostAmount);
        // Reset color based on tower type
        if (this.target instanceof LaserTower) {
          this.target.color = '#00f0ff';
        } else if (this.target instanceof CannonTower) {
          this.target.color = '#ff6600';
        } else if (this.target instanceof EMPTower) {
          this.target.color = '#9c27b0';
        } else if (this.target instanceof RepairTower) {
          this.target.color = '#4CAF50';
        }
      }, this.boostDuration * 1000);
    }
  }

  render(ctx) {
    // Draw boost tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(255, 235, 59, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw range indicator
    ctx.strokeStyle = 'rgba(255, 235, 59, 0.2)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Tower type registry for selection UI
const TOWER_TYPES = {
  laser: { name: 'Laser', class: LaserTower, cost: 80, color: '#00f0ff', faction: 'Energy' },
  plasma: { name: 'Plasma', class: PlasmaTower, cost: 100, color: '#00a2ff', faction: 'Energy' },
  railgun: { name: 'Railgun', class: RailgunTower, cost: 150, color: '#0066ff', faction: 'Energy' },
  cannon: { name: 'Cannon', class: CannonTower, cost: 90, color: '#ff6600', faction: 'Explosive' },
  missile: { name: 'Missile', class: MissileTower, cost: 75, color: '#ff3300', faction: 'Explosive' },
  bomb: { name: 'Bomb', class: BombTower, cost: 110, color: '#cc0000', faction: 'Explosive' },
  emp: { name: 'EMP', class: EMPTower, cost: 70, color: '#9c27b0', faction: 'EM' },
  pulse: { name: 'Pulse', class: PulseTower, cost: 90, color: '#673ab7', faction: 'EM' },
  disruptor: { name: 'Disruptor', class: DisruptorTower, cost: 85, color: '#3f51b5', faction: 'EM' },
  repair: { name: 'Repair', class: RepairTower, cost: 60, color: '#4CAF50', faction: 'Support' }
};

class ResourceTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.damage = 0; // No direct damage
    this.cooldown = 5.0;
    this.range = 0; // No range, affects game directly
    this.cost = 120;
    this.color = '#FFC107';
    this.resourceAmount = 20; // Resources generated
  }

  attack() {
    // Generate resources directly
    this.game.gainResources(this.resourceAmount);
  }

  render(ctx) {
    // Draw resource tower
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(255, 193, 7, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw resource generation indicator
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('+' + this.resourceAmount, this.x, this.y + 25);
    ctx.textAlign = 'left';
  }
}