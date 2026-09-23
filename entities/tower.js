// entities/tower.js - Base Tower class

// --- Shape drawing helpers ---
function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function polygonPath(ctx, x, y, r, sides, rot) {
  for (let i = 0; i < sides; i++) {
    const a = rot + (i * 2 * Math.PI) / sides;
    const px = x + r * Math.cos(a);
    const py = y + r * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawTowerShape(ctx, x, y, r, shape) {
  ctx.beginPath();
  switch (shape) {
    case 'triangle':
      polygonPath(ctx, x, y, r, 3, -Math.PI / 2);
      break;
    case 'diamond':
      polygonPath(ctx, x, y, r, 4, -Math.PI / 2);
      break;
    case 'pentagon':
      polygonPath(ctx, x, y, r, 5, -Math.PI / 2);
      break;
    case 'hexagon':
      polygonPath(ctx, x, y, r, 6, -Math.PI / 2);
      break;
    case 'square':
      ctx.rect(x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6);
      break;
    case 'ring':
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.moveTo(x + r * 0.45, y);
      ctx.arc(x, y, r * 0.45, 0, Math.PI * 2, true);
      break;
    case 'double':
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.moveTo(x + r * 0.6, y);
      ctx.arc(x, y, r * 0.6, 0, Math.PI * 2, true);
      ctx.moveTo(x + r * 0.25, y);
      ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
      break;
    case 'cross': {
      const w = r * 0.45;
      ctx.rect(x - w, y - r, w * 2, r * 2);
      ctx.rect(x - r, y - w, r * 2, w * 2);
      break;
    }
    case 'bolt':
      ctx.moveTo(x + r * 0.2, y - r);
      ctx.lineTo(x - r * 0.5, y + r * 0.15);
      ctx.lineTo(x - r * 0.05, y + r * 0.15);
      ctx.lineTo(x - r * 0.2, y + r);
      ctx.lineTo(x + r * 0.5, y - r * 0.15);
      ctx.lineTo(x + r * 0.05, y - r * 0.15);
      ctx.closePath();
      break;
    case 'star':
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? r : r * 0.5;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = x + rad * Math.cos(a);
        const py = y + rad * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    default: // circle
      ctx.arc(x, y, r, 0, Math.PI * 2);
  }
}

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
    this.shape = 'circle';
    this.size = 15;
    this.canReveal = false; // EM faction can target stealthed enemies
  }

  update(deltaTime) {
    this.currentCooldown -= deltaTime;

    if (this.currentCooldown <= 0) {
      this.findTarget();
      if (this.target) {
        this.attack();
        this.currentCooldown = this.cooldown;

        // Muzzle flash + faction attack sound (Phase 6)
        if (this.game.effects) this.game.effects.muzzleFlash(this.x, this.y, this.color);
        if (this.game.audio) this.game.audio.playAttack(this.faction);
      }
    }
  }

  findTarget() {
    // Find closest enemy in range (stealthed enemies are invisible unless this tower can reveal)
    let closestEnemy = null;
    let closestDistance = this.range;

    this.game.enemies.forEach(enemy => {
      if (enemy.isDead) return;
      if (!enemy.isTargetable() && !this.canReveal) return;

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
    const r = this.size || 15;
    const color = this.color || '#00a2ff';

    // Range indicator
    ctx.strokeStyle = hexToRgba(color, 0.2);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();

    // Tower body with neon glow (unique shape per type)
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = color;
    ctx.fillRule = 'evenodd';
    drawTowerShape(ctx, this.x, this.y, r, this.shape);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// Energy Faction - Single target high damage
class LaserTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'laser';
    this.faction = 'energy';
    this.damage = 25;
    this.cooldown = 1.2;
    this.range = 150;
    this.cost = 80;
    this.color = '#00f0ff';
    this.shape = 'triangle';
  }
}

class PlasmaTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'plasma';
    this.faction = 'energy';
    this.damage = 35;
    this.cooldown = 1.8;
    this.range = 120;
    this.cost = 100;
    this.color = '#00a2ff';
    this.shape = 'diamond';
    this.size = 18;
  }
}

class RailgunTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'railgun';
    this.faction = 'energy';
    this.damage = 50;
    this.cooldown = 3.0;
    this.range = 200;
    this.cost = 150;
    this.color = '#0066ff';
    this.shape = 'hexagon';
    this.size = 13;
  }
}

// Explosive Faction - Area of effect damage
class CannonTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'cannon';
    this.faction = 'explosive';
    this.damage = 20;
    this.cooldown = 2.0;
    this.range = 100;
    this.cost = 90;
    this.color = '#ff6600';
    this.explosionRadius = 40;
    this.shape = 'square';
    this.size = 16;
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
}

class MissileTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'missile';
    this.faction = 'explosive';
    this.damage = 18;
    this.cooldown = 1.5;
    this.range = 130;
    this.cost = 75;
    this.color = '#ff3300';
    this.explosionRadius = 35;
    this.shape = 'pentagon';
    this.size = 14;
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
}

class BombTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'bomb';
    this.faction = 'explosive';
    this.damage = 22;
    this.cooldown = 2.5;
    this.range = 90;
    this.cost = 110;
    this.color = '#cc0000';
    this.explosionRadius = 50;
    this.shape = 'circle';
    this.size = 18;
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
}

// Electromagnetic Faction - Control and debuff
class EMPTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'emp';
    this.faction = 'electromagnetic';
    this.damage = 5;
    this.cooldown = 0.5;
    this.range = 140;
    this.cost = 70;
    this.color = '#9c27b0';
    this.slowAmount = 0.5; // 50% slow
    this.slowDuration = 2.0; // seconds
    this.shape = 'ring';
    this.size = 14;
    this.canReveal = true;
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

}

class PulseTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'pulse';
    this.faction = 'electromagnetic';
    this.damage = 0; // No direct damage
    this.cooldown = 3.0;
    this.range = 180;
    this.cost = 90;
    this.color = '#673ab7';
    this.pulseRadius = 100;
    this.stunDuration = 1.5; // seconds
    this.shape = 'double';
    this.size = 16;
    this.canReveal = true;
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

}

class DisruptorTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'disruptor';
    this.faction = 'electromagnetic';
    this.damage = 8;
    this.cooldown = 1.0;
    this.range = 160;
    this.cost = 85;
    this.color = '#3f51b5';
    this.chainTargets = 3; // Number of enemies to chain to
    this.chainDamage = 0.6; // 60% damage per chain
    this.shape = 'bolt';
    this.size = 15;
    this.canReveal = true;
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

}

// Support Faction - Buffs and utility
class RepairTower extends Tower {
  constructor(game, x, y) {
    super(game, x, y);
    this.type = 'repair';
    this.faction = 'support';
    this.damage = 0; // No direct damage
    this.cooldown = 2.0;
    this.range = 120;
    this.cost = 60;
    this.color = '#4CAF50';
    this.repairAmount = 5; // Health repaired per second
    this.repairDuration = 3.0; // seconds
    this.shape = 'cross';
    this.size = 14;
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
    this.shape = 'star';
    this.size = 16;
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

}

// Tower type registry for selection UI
const TOWER_TYPES = {
  laser: { name: 'Laser', class: LaserTower, cost: 80, range: 150, color: '#00f0ff', shape: 'triangle', faction: 'Energy' },
  plasma: { name: 'Plasma', class: PlasmaTower, cost: 100, range: 120, color: '#00a2ff', shape: 'diamond', faction: 'Energy' },
  railgun: { name: 'Railgun', class: RailgunTower, cost: 150, range: 200, color: '#0066ff', shape: 'hexagon', faction: 'Energy' },
  cannon: { name: 'Cannon', class: CannonTower, cost: 90, range: 100, color: '#ff6600', shape: 'square', faction: 'Explosive' },
  missile: { name: 'Missile', class: MissileTower, cost: 75, range: 130, color: '#ff3300', shape: 'pentagon', faction: 'Explosive' },
  bomb: { name: 'Bomb', class: BombTower, cost: 110, range: 90, color: '#cc0000', shape: 'circle', faction: 'Explosive' },
  emp: { name: 'EMP', class: EMPTower, cost: 70, range: 140, color: '#9c27b0', shape: 'ring', faction: 'EM' },
  pulse: { name: 'Pulse', class: PulseTower, cost: 90, range: 180, color: '#673ab7', shape: 'double', faction: 'EM' },
  disruptor: { name: 'Disruptor', class: DisruptorTower, cost: 85, range: 160, color: '#3f51b5', shape: 'bolt', faction: 'EM' },
  repair: { name: 'Repair', class: RepairTower, cost: 60, range: 120, color: '#4CAF50', shape: 'cross', faction: 'Support' }
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