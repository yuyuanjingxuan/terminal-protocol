// render/effects.js - Neon particle effects and screen shake (Phase 6)
class ParticleSystem {
  constructor(game) {
    this.game = game;
    this.particles = [];
    this.shakeTime = 0;
    this.shakeDuration = 0;
    this.shakeMagnitude = 0;
  }

  // Spawn a burst of particles at a position
  burst(x, y, color, count, opts = {}) {
    const {
      speed = 120,
      life = 0.5,
      size = 3,
      spread = Math.PI * 2,
      angle = 0,
      gravity = 0,
      fade = true
    } = opts;

    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * spread;
      const sp = speed * (0.4 + Math.random() * 0.8);
      this.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: life * (0.6 + Math.random() * 0.8),
        maxLife: life,
        size: size * (0.6 + Math.random() * 0.8),
        color,
        gravity,
        fade
      });
    }
  }

  // Muzzle flash: short bright ring + sparks from a tower
  muzzleFlash(x, y, color) {
    this.burst(x, y, color, 6, { speed: 90, life: 0.18, size: 2.5, spread: Math.PI * 2 });
    this.particles.push({
      x, y, vx: 0, vy: 0,
      life: 0.12, maxLife: 0.12,
      size: 10, color, gravity: 0, fade: true, ring: true
    });
  }

  // Enemy death: colored explosion burst
  enemyDeath(x, y, color, size) {
    const count = Math.min(24, 8 + Math.floor(size));
    this.burst(x, y, color, count, { speed: 140, life: 0.55, size: 3 });
    this.burst(x, y, '#ffffff', 4, { speed: 60, life: 0.3, size: 2 });
    this.particles.push({
      x, y, vx: 0, vy: 0,
      life: 0.25, maxLife: 0.25,
      size: size * 1.5, color, gravity: 0, fade: true, ring: true
    });
  }

  // Explosion (cannon/missile/bomb): orange fireball + smoke
  explosion(x, y, radius) {
    const r = radius || 40;
    this.burst(x, y, '#ff6600', 18, { speed: 160, life: 0.5, size: 4 });
    this.burst(x, y, '#ffcc00', 10, { speed: 100, life: 0.35, size: 3 });
    this.burst(x, y, '#884400', 8, { speed: 50, life: 0.8, size: 5, gravity: -20 });
    this.particles.push({
      x, y, vx: 0, vy: 0,
      life: 0.3, maxLife: 0.3,
      size: r * 0.8, color: '#ff8800', gravity: 0, fade: true, ring: true
    });
    this.shake(0.25, 6);
  }

  // EMP / pulse: expanding purple ring
  pulseRing(x, y, radius, color) {
    this.particles.push({
      x, y, vx: 0, vy: 0,
      life: 0.4, maxLife: 0.4,
      size: radius, color: color || '#9c27b0', gravity: 0, fade: true, ring: true, grow: true
    });
    this.burst(x, y, color || '#9c27b0', 12, { speed: 80, life: 0.4, size: 2.5 });
  }

  // Repair beam: green rising motes
  repairEffect(x, y) {
    this.burst(x, y, '#4CAF50', 5, { speed: 40, life: 0.6, size: 2.5, angle: -Math.PI / 2, spread: 1.2 });
  }

  // Tower built: cyan/green sparkle
  towerBuilt(x, y, color) {
    this.burst(x, y, color, 14, { speed: 100, life: 0.5, size: 3 });
    this.particles.push({
      x, y, vx: 0, vy: 0,
      life: 0.3, maxLife: 0.3,
      size: 24, color, gravity: 0, fade: true, ring: true, grow: true
    });
  }

  // Tech unlock: gold sparkle
  techUnlock(x, y) {
    this.burst(x, y, '#ffd700', 20, { speed: 120, life: 0.7, size: 3 });
  }

  // Wave start: flash along the path start
  waveStart(x, y) {
    this.burst(x, y, '#00f0ff', 16, { speed: 130, life: 0.6, size: 3 });
    this.particles.push({
      x, y, vx: 0, vy: 0,
      life: 0.4, maxLife: 0.4,
      size: 30, color: '#00f0ff', gravity: 0, fade: true, ring: true, grow: true
    });
  }

  // Screen shake
  shake(duration, magnitude) {
    this.shakeTime = duration;
    this.shakeDuration = duration;
    this.shakeMagnitude = magnitude;
  }

  update(deltaTime) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= deltaTime;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vy += (p.gravity || 0) * deltaTime;
      // Slight drag
      p.vx *= 0.96;
      p.vy *= 0.96;
    }

    // Update shake
    if (this.shakeTime > 0) {
      this.shakeTime -= deltaTime;
      if (this.shakeTime < 0) this.shakeTime = 0;
    }
  }

  // Returns current shake offset (call before rendering world)
  getShakeOffset() {
    if (this.shakeTime <= 0) return { x: 0, y: 0 };
    const t = this.shakeTime / this.shakeDuration;
    const m = this.shakeMagnitude * t;
    return {
      x: (Math.random() - 0.5) * 2 * m,
      y: (Math.random() - 0.5) * 2 * m
    };
  }

  render(ctx) {
    for (const p of this.particles) {
      const alpha = p.fade ? Math.max(0, p.life / p.maxLife) : 1;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      if (p.ring) {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  clear() {
    this.particles = [];
    this.shakeTime = 0;
  }
}
