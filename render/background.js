// render/background.js - Per-chapter themed animated backgrounds (Phase 10)
// Programmatic Canvas drawing, zero external assets. Low-contrast by design so
// towers/enemies/path stay readable. Each chapter gets a distinct visual theme.
//
// Usage: renderBackground(ctx, chapterIdx, time, width, height)
//   chapterIdx: 0-5 (from currentLevel.chapter)
//   time:       accumulated seconds (game.time) for animation

// Deterministic pseudo-random from a seed (stable per position, no Math.random
// jitter between frames).
function bgRand(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Chapter theme palettes (bg base, accent, secondary accent)
const BG_THEMES = [
  { bg: '#0a0a1a', accent: '#00f0ff', accent2: '#00ff88', name: 'edge' },      // Ch1 Edge Buffer
  { bg: '#120a1e', accent: '#ff9d00', accent2: '#ffd54f', name: 'bazaar' },    // Ch2 Data Bazaar
  { bg: '#0a1220', accent: '#4fc3f7', accent2: '#81d4fa', name: 'archive' },   // Ch3 Dormant Archive
  { bg: '#0a1a14', accent: '#00e676', accent2: '#69f0ae', name: 'lifeline' },  // Ch4 Lifeline Ring
  { bg: '#1a120a', accent: '#ff7043', accent2: '#ffb74d', name: 'bastion' },   // Ch5 Iron Bastion
  { bg: '#160a1e', accent: '#e040fb', accent2: '#ff4081', name: 'root' }       // Ch6 Root Terminal
];

function renderBackground(ctx, chapterIdx, time, w, h) {
  const theme = BG_THEMES[chapterIdx] || BG_THEMES[0];

  // Base fill
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle vertical gradient to add depth (dark at edges, slightly lighter center)
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
  grad.addColorStop(0, 'rgba(255,255,255,0.03)');
  grad.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  switch (theme.name) {
    case 'edge':    drawEdge(ctx, theme, time, w, h); break;
    case 'bazaar':  drawBazaar(ctx, theme, time, w, h); break;
    case 'archive': drawArchive(ctx, theme, time, w, h); break;
    case 'lifeline':drawLifeline(ctx, theme, time, w, h); break;
    case 'bastion': drawBastion(ctx, theme, time, w, h); break;
    case 'root':    drawRoot(ctx, theme, time, w, h); break;
  }
}

// ---- Ch1: Edge Buffer - sparse grid + floating data points + horizon glow ----
function drawEdge(ctx, theme, time, w, h) {
  // Faint grid
  ctx.strokeStyle = 'rgba(0,240,255,0.05)';
  ctx.lineWidth = 1;
  const step = 40;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let y = 0; y <= h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();

  // Horizon glow near bottom
  const hg = ctx.createLinearGradient(0, h * 0.7, 0, h);
  hg.addColorStop(0, 'rgba(0,240,255,0)');
  hg.addColorStop(1, 'rgba(0,240,255,0.06)');
  ctx.fillStyle = hg;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);

  // Sparse floating data points (slow drift)
  for (let i = 0; i < 26; i++) {
    const sx = bgRand(i * 3 + 1);
    const sy = bgRand(i * 3 + 2);
    const sp = bgRand(i * 3 + 3);
    const x = (sx * w + time * (6 + sp * 10)) % w;
    const y = sy * h;
    const alpha = 0.08 + sp * 0.12;
    ctx.fillStyle = sp > 0.7 ? theme.accent2 : theme.accent;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
}

// ---- Ch2: Data Bazaar - dense neon light blobs + flowing data streams ----
function drawBazaar(ctx, theme, time, w, h) {
  // Flowing horizontal data streams
  for (let i = 0; i < 8; i++) {
    const y = bgRand(i * 7 + 5) * h;
    const speed = 40 + bgRand(i * 7 + 6) * 60;
    const len = 60 + bgRand(i * 7 + 7) * 120;
    const off = (time * speed) % (w + len);
    const x = off - len;
    const alpha = 0.05 + bgRand(i * 7 + 8) * 0.08;
    const g = ctx.createLinearGradient(x, y, x + len, y);
    g.addColorStop(0, 'rgba(255,157,0,0)');
    g.addColorStop(0.5, theme.accent);
    g.addColorStop(1, 'rgba(255,157,0,0)');
    ctx.fillStyle = g;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, y, len, 1.5);
  }
  ctx.globalAlpha = 1;

  // Neon "billboard" light blobs (soft radial glows)
  for (let i = 0; i < 14; i++) {
    const sx = bgRand(i * 11 + 9);
    const sy = bgRand(i * 11 + 10);
    const r = 20 + bgRand(i * 11 + 11) * 40;
    const x = sx * w;
    const y = sy * h;
    const pulse = 0.5 + 0.5 * Math.sin(time * (0.5 + bgRand(i * 11 + 12)) + i);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, theme.accent);
    g.addColorStop(1, 'rgba(255,157,0,0)');
    ctx.fillStyle = g;
    ctx.globalAlpha = 0.05 + pulse * 0.05;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  ctx.globalAlpha = 1;
}

// ---- Ch3: Dormant Archive - vertical shelf lines + falling dust ----
function drawArchive(ctx, theme, time, w, h) {
  // Vertical archive-shelf lines
  ctx.strokeStyle = 'rgba(79,195,247,0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 34) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  ctx.stroke();

  // Horizontal shelf dividers (faint)
  ctx.strokeStyle = 'rgba(79,195,247,0.04)';
  ctx.beginPath();
  for (let y = 0; y <= h; y += 80) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();

  // Slowly falling dust particles
  for (let i = 0; i < 40; i++) {
    const sx = bgRand(i * 13 + 20);
    const sy = bgRand(i * 13 + 21);
    const sp = bgRand(i * 13 + 22);
    const x = sx * w;
    const y = (sy * h + time * (4 + sp * 8)) % h;
    ctx.fillStyle = theme.accent2;
    ctx.globalAlpha = 0.05 + sp * 0.1;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
}

// ---- Ch4: Lifeline Ring - ring orbits + pulsing energy + green life dots ----
function drawLifeline(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;

  // Concentric ring orbits
  for (let i = 0; i < 4; i++) {
    const r = 60 + i * 70;
    ctx.strokeStyle = 'rgba(0,230,118,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Orbiting dot on each ring
    const a = time * (0.3 + i * 0.15) + i * 1.7;
    const ox = cx + Math.cos(a) * r;
    const oy = cy + Math.sin(a) * r;
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Pulsing life dots scattered
  for (let i = 0; i < 20; i++) {
    const sx = bgRand(i * 17 + 30);
    const sy = bgRand(i * 17 + 31);
    const pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + i * 2.1);
    ctx.fillStyle = theme.accent2;
    ctx.globalAlpha = 0.04 + pulse * 0.08;
    ctx.beginPath();
    ctx.arc(sx * w, sy * h, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ---- Ch5: Iron Bastion - hard geometric blocks + warning stripes ----
function drawBastion(ctx, theme, time, w, h) {
  // Hard geometric blocks (static, low contrast)
  for (let i = 0; i < 10; i++) {
    const sx = bgRand(i * 19 + 40);
    const sy = bgRand(i * 19 + 41);
    const bw = 40 + bgRand(i * 19 + 42) * 90;
    const bh = 20 + bgRand(i * 19 + 43) * 50;
    ctx.fillStyle = 'rgba(255,112,67,0.04)';
    ctx.fillRect(sx * w, sy * h, bw, bh);
    ctx.strokeStyle = 'rgba(255,112,67,0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx * w, sy * h, bw, bh);
  }

  // Warning stripes along the bottom edge (slow scroll)
  const stripeH = 6;
  const stripeW = 24;
  const off = (time * 12) % (stripeW * 2);
  ctx.fillStyle = 'rgba(255,112,67,0.05)';
  for (let x = -stripeW * 2 + off; x < w + stripeW; x += stripeW * 2) {
    ctx.fillRect(x, h - stripeH, stripeW, stripeH);
  }
}

// ---- Ch6: Root Terminal - rotating concentric circles + circuit texture ----
function drawRoot(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;

  // Rotating concentric rings
  for (let i = 0; i < 6; i++) {
    const r = 50 + i * 55;
    const rot = time * (0.1 + i * 0.05) + i * 0.6;
    ctx.strokeStyle = 'rgba(224,64,251,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, rot, rot + Math.PI * 1.4);
    ctx.stroke();
  }

  // Circuit-like scattered nodes + connecting lines
  for (let i = 0; i < 16; i++) {
    const sx = bgRand(i * 23 + 50);
    const sy = bgRand(i * 23 + 51);
    const x = sx * w, y = sy * h;
    ctx.fillStyle = theme.accent2;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(x, y, 2, 2);
    // short connector
    const dx = (bgRand(i * 23 + 52) - 0.5) * 40;
    const dy = (bgRand(i * 23 + 53) - 0.5) * 40;
    ctx.strokeStyle = 'rgba(224,64,251,0.05)';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Core glow at center
  const pulse = 0.5 + 0.5 * Math.sin(time * 0.8);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
  g.addColorStop(0, theme.accent);
  g.addColorStop(1, 'rgba(224,64,251,0)');
  ctx.fillStyle = g;
  ctx.globalAlpha = 0.05 + pulse * 0.04;
  ctx.fillRect(cx - 90, cy - 90, 180, 180);
  ctx.globalAlpha = 1;
}
