// entities/enemy.js - Base Enemy class with special abilities (Phase 3)
class Enemy {
  constructor(game, path) {
    this.game = game;
    this.path = path;
    this.pathIndex = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.baseSpeed = 50; // pixels per second
    this.health = 30;
    this.maxHealth = 30;
    this.isDead = false;
    this.reward = 10; // resources rewarded when killed
    this.size = 12;
    this.color = '#ff4444';
    this.damageToBase = 1;

    // Special abilities
    this.shield = 0;
    this.maxShield = 0;
    this.isStealthed = false;
    this.revealed = 0; // seconds of reveal remaining
    this.slowTimer = 0;
    this.slowFactor = 1;
    this.stunTimer = 0;
    this.healRate = 0; // hp per second
    this.healRadius = 0; // 0 = self only
    this.splitCount = 0;
    this.splitType = null;
    this.isBoss = false;
    this.summonTimer = 0;
    this.summonInterval = 0;
    this.summonType = null;
    this.summonCount = 0;

    // Phase 7: wave-entry overrides (applied by WaveManager at spawn)
    this.revealAtFrac = 0;   // 0 = disabled; reveal permanently at this health fraction
    this.splitAtFrac = 0;    // 0 = disabled; split once at this health fraction
    this.splitAtFracDone = false;
    this.bossName = null;    // localized boss name (zh)
    this.bossNameEn = null;  // localized boss name (en)
  }

  // Apply per-wave overrides from the level's wave data (Phase 7).
  // Called by WaveManager right after construction.
  applyOverrides(data) {
    if (!data) return;
    if (data.hp) { this.health = data.hp; this.maxHealth = data.hp; }
    if (data.shield) { this.shield = data.shield; this.maxShield = data.shield; }
    if (data.speed) this.baseSpeed = data.speed;
    if (data.size) this.size = data.size;
    if (data.reward) this.reward = data.reward;
    if (data.damageToBase) this.damageToBase = data.damageToBase;
    if (data.summonType) this.summonType = data.summonType;
    if (data.summonCount) this.summonCount = data.summonCount;
    if (data.summonInterval) this.summonInterval = data.summonInterval;
    if (data.summonTimer) this.summonTimer = data.summonTimer;
    if (data.healRate) this.healRate = data.healRate;
    if (data.healRadius) this.healRadius = data.healRadius;
    if (data.stealth) this.isStealthed = true;
    if (data.revealAtFrac) this.revealAtFrac = data.revealAtFrac;
    if (data.splitAtFrac) this.splitAtFrac = data.splitAtFrac;
    if (data.splitCount) this.splitCount = data.splitCount;
    if (data.splitType) this.splitType = data.splitType;
    if (data.bossName) this.bossName = data.bossName;
    if (data.bossNameEn) this.bossNameEn = data.bossNameEn;
  }

  update(deltaTime) {
    if (this.isDead) return;

    // Status effects
    if (this.stunTimer > 0) {
      this.stunTimer -= deltaTime;
      return; // stunned: frozen in place
    }
    if (this.slowTimer > 0) {
      this.slowTimer -= deltaTime;
      if (this.slowTimer <= 0) this.slowFactor = 1;
    }
    if (this.revealed > 0) this.revealed -= deltaTime;

    // Healing (self + nearby allies)
    if (this.healRate > 0) {
      this.heal(this.healRate * deltaTime);
      if (this.healRadius > 0) {
        for (const other of this.game.enemies) {
          if (other === this || other.isDead) continue;
          const d = Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
          if (d < this.healRadius) other.heal(this.healRate * 0.5 * deltaTime);
        }
      }
    }

    // Boss summon mechanic
    if (this.isBoss && this.summonInterval > 0) {
      this.summonTimer -= deltaTime;
      if (this.summonTimer <= 0) {
        this.summonTimer = this.summonInterval;
        for (let i = 0; i < this.summonCount; i++) {
          const cls = ENEMY_TYPES[this.summonType];
          const minion = new cls(this.game, this.path);
          minion.x = this.x + (i === 0 ? -18 : 18);
          minion.y = this.y;
          minion.pathIndex = this.pathIndex;
          this.game.addEnemy(minion);
        }
      }
    }

    // Move along path
    const moveSpeed = this.baseSpeed * this.slowFactor;
    if (this.pathIndex < this.path.length - 1) {
      const targetPoint = this.path[this.pathIndex + 1];
      const dx = targetPoint.x - this.x;
      const dy = targetPoint.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const step = moveSpeed * deltaTime;
        if (step >= distance) {
          this.x = targetPoint.x;
          this.y = targetPoint.y;
          this.pathIndex++;
        } else {
          this.x += (dx / distance) * step;
          this.y += (dy / distance) * step;
        }
      }
    } else {
      // Reached the end - damage player
      this.game.takeDamage(this.damageToBase);
      this.isDead = true;
    }
  }

  applySlow(amount, duration) {
    const factor = 1 - amount;
    if (this.slowTimer <= 0 || factor < this.slowFactor) this.slowFactor = factor;
    this.slowTimer = Math.max(this.slowTimer, duration);
  }

  applyStun(duration) {
    this.stunTimer = Math.max(this.stunTimer, duration);
  }

  reveal(duration) {
    this.revealed = Math.max(this.revealed, duration);
  }

  // Total distance traveled along the path (higher = further ahead)
  pathProgress() {
    let progress = 0;
    for (let i = 0; i < this.pathIndex; i++) {
      const a = this.path[i];
      const b = this.path[i + 1];
      progress += Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    }
    // Distance from the current waypoint to the enemy's position
    const cur = this.path[this.pathIndex];
    progress += Math.sqrt(Math.pow(this.x - cur.x, 2) + Math.pow(this.y - cur.y, 2));
    return progress;
  }

  isTargetable() {
    return !this.isStealthed || this.revealed > 0;
  }

  heal(amount) {
    if (this.health < this.maxHealth) {
      this.health = Math.min(this.maxHealth, this.health + amount);
    }
  }

  takeDamage(amount) {
    if (this.isDead) return;
    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) this.shield = 0;
      return; // shield absorbs the hit
    }
    this.health -= amount;

    // Phase 7: reveal at a health fraction (e.g. Mirror Merchant, 2-6)
    if (this.isStealthed && this.revealAtFrac > 0 &&
        this.health / this.maxHealth <= this.revealAtFrac) {
      this.reveal(99999); // permanent reveal
    }

    // Phase 7: one-shot split at a health fraction (e.g. Multiphase Body, 5-6)
    if (this.splitAtFrac > 0 && !this.splitAtFracDone &&
        this.health > 0 && this.health / this.maxHealth <= this.splitAtFrac) {
      this.splitAtFracDone = true;
      this.doSplit();
    }

    if (this.health <= 0) this.die();
  }

  // Spawn split children (shared by death-split and threshold-split)
  doSplit() {
    if (this.splitCount <= 0 || !this.splitType) return;
    for (let i = 0; i < this.splitCount; i++) {
      const cls = ENEMY_TYPES[this.splitType];
      const child = new cls(this.game, this.path);
      child.x = this.x + (i - (this.splitCount - 1) / 2) * 16;
      child.y = this.y;
      child.pathIndex = this.pathIndex;
      this.game.addEnemy(child);
    }
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;

    // Death effect + sound
    if (this.game.effects) this.game.effects.enemyDeath(this.x, this.y, this.color, this.size);
    if (this.game.audio) this.game.audio.playEnemyDie(this.size);

    this.game.gainResources(this.reward);
    this.doSplit();
  }

  render(ctx) {
    const stealthed = this.isStealthed && this.revealed <= 0;
    ctx.save();
    if (stealthed) ctx.globalAlpha = 0.18;

    // Body with neon glow
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Type-specific markers
    if (this.isBoss) {
      // Hexagon ring around boss
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = this.x + (this.size + 8) * Math.cos(a);
        const py = this.y + (this.size + 8) * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (this.healRate > 0) {
      // Healer: white cross + faint aura
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x - this.size * 0.5, this.y);
      ctx.lineTo(this.x + this.size * 0.5, this.y);
      ctx.moveTo(this.x, this.y - this.size * 0.5);
      ctx.lineTo(this.x, this.y + this.size * 0.5);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(76, 175, 80, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.healRadius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.splitCount > 0) {
      // Splitter: inner diamond
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - this.size * 0.5);
      ctx.lineTo(this.x + this.size * 0.5, this.y);
      ctx.lineTo(this.x, this.y + this.size * 0.5);
      ctx.lineTo(this.x - this.size * 0.5, this.y);
      ctx.closePath();
      ctx.stroke();
    } else if (this.maxShield > 0) {
      // Armored: inner square
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 1.5;
      const s = this.size * 0.5;
      ctx.strokeRect(this.x - s, this.y - s, s * 2, s * 2);
    } else if (this.baseSpeed >= 100) {
      // Fast: motion lines behind
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x - this.size - 6, this.y - 3);
      ctx.lineTo(this.x - this.size, this.y - 3);
      ctx.moveTo(this.x - this.size - 8, this.y + 3);
      ctx.lineTo(this.x - this.size, this.y + 3);
      ctx.stroke();
    }

    // Status effect indicators
    if (this.slowFactor < 1) {
      ctx.fillStyle = 'rgba(156, 39, 176, 0.9)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('S', this.x + this.size + 7, this.y - this.size);
    }
    if (this.stunTimer > 0) {
      ctx.fillStyle = '#FFEB3B';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('*', this.x, this.y - this.size - 14);
    }

    // Shield bar (above health bar)
    if (this.maxShield > 0) {
      const barWidth = this.size * 2;
      const shieldPct = this.shield / this.maxShield;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 10, barWidth, 3);
      ctx.fillStyle = '#40c4ff';
      ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 10, barWidth * shieldPct, 3);
    }

    // Health bar
    const barWidth = this.size * 2;
    const healthPct = Math.max(0, this.health / this.maxHealth);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 6, barWidth, 3);
    ctx.fillStyle = healthPct > 0.5 ? '#4CAF50' : healthPct > 0.25 ? '#FFC107' : '#F44336';
    ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 6, barWidth * healthPct, 3);

    ctx.restore();

    // Boss: large health bar at top of screen
    if (this.isBoss) {
      const w = 400;
      const x = (this.game.canvas.width - w) / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(x - 2, 8, w + 4, 14);
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(x, 10, w * healthPct, 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      const label = (typeof I18N !== 'undefined' && I18N.lang === 'en')
        ? (this.bossNameEn || I18N.t('bossLabel'))
        : (this.bossName || I18N.t('bossLabel'));
      ctx.fillText(label, this.game.canvas.width / 2, 34);
    }
  }
}

// --- Enemy type implementations ---

class BasicEnemy extends Enemy {
  constructor(game, path) {
    super(game, path);
    const s = BALANCE.enemies.basic;
    this.baseSpeed = s.speed;
    this.health = s.hp;
    this.maxHealth = s.hp;
    this.reward = s.reward;
    this.size = s.size;
    this.damageToBase = s.damageToBase;
    this.color = '#F44336';
  }
}

// Fast type: quick but fragile
class FastEnemy extends Enemy {
  constructor(game, path) {
    super(game, path);
    const s = BALANCE.enemies.fast;
    this.baseSpeed = s.speed;
    this.health = s.hp;
    this.maxHealth = s.hp;
    this.reward = s.reward;
    this.size = s.size;
    this.damageToBase = s.damageToBase;
    this.color = '#FF9800';
  }
}

// Armored type: shield absorbs damage before health
class ArmoredEnemy extends Enemy {
  constructor(game, path) {
    super(game, path);
    const s = BALANCE.enemies.armored;
    this.baseSpeed = s.speed;
    this.health = s.hp;
    this.maxHealth = s.hp;
    this.shield = s.shield;
    this.maxShield = s.shield;
    this.reward = s.reward;
    this.size = s.size;
    this.damageToBase = s.damageToBase;
    this.color = '#607D8B';
  }
}

// Healer type: regenerates own hp and heals nearby allies
class HealerEnemy extends Enemy {
  constructor(game, path) {
    super(game, path);
    const s = BALANCE.enemies.healer;
    this.baseSpeed = s.speed;
    this.health = s.hp;
    this.maxHealth = s.hp;
    this.reward = s.reward;
    this.size = s.size;
    this.damageToBase = s.damageToBase;
    this.color = '#4CAF50';
    this.healRate = s.healRate; // hp/s to self
    this.healRadius = s.healRadius; // allies within this radius get half rate
  }
}

// Stealth type: untargetable until revealed by EM faction
class StealthEnemy extends Enemy {
  constructor(game, path) {
    super(game, path);
    const s = BALANCE.enemies.stealth;
    this.baseSpeed = s.speed;
    this.health = s.hp;
    this.maxHealth = s.hp;
    this.reward = s.reward;
    this.size = s.size;
    this.damageToBase = s.damageToBase;
    this.color = '#B39DDB';
    this.isStealthed = true;
  }
}

// Splitter type: spawns weaker children on death
class SplitterEnemy extends Enemy {
  constructor(game, path) {
    super(game, path);
    const s = BALANCE.enemies.splitter;
    this.baseSpeed = s.speed;
    this.health = s.hp;
    this.maxHealth = s.hp;
    this.reward = s.reward;
    this.size = s.size;
    this.damageToBase = s.damageToBase;
    this.color = '#E040FB';
    this.splitCount = s.splitCount;
    this.splitType = s.splitType;
  }
}

// Boss: huge hp, summons minions periodically
class BossEnemy extends Enemy {
  constructor(game, path) {
    super(game, path);
    const s = BALANCE.enemies.boss;
    this.baseSpeed = s.speed;
    this.health = s.hp;
    this.maxHealth = s.hp;
    this.reward = s.reward;
    this.size = s.size;
    this.color = '#D50000';
    this.damageToBase = s.damageToBase;
    this.isBoss = true;
    this.summonInterval = s.summonInterval; // seconds between summon bursts
    this.summonTimer = s.summonTimer; // first burst comes early
    this.summonType = s.summonType;
    this.summonCount = s.summonCount;
  }
}

// Enemy type registry (data-driven, like TOWER_TYPES)
const ENEMY_TYPES = {
  basic: BasicEnemy,
  fast: FastEnemy,
  armored: ArmoredEnemy,
  healer: HealerEnemy,
  stealth: StealthEnemy,
  splitter: SplitterEnemy,
  boss: BossEnemy
};