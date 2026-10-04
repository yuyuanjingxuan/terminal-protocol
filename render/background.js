// render/background.js - Per-LEVEL themed animated backgrounds (Phase 10)
// Programmatic Canvas drawing, zero external assets. Low-contrast by design so
// towers/enemies/path stay readable, but each of the 36 levels gets a clearly
// distinct composition, palette and animation that matches its story beat.
//
// Usage: renderBackground(ctx, chapterIdx, levelKey, time, width, height)
//   chapterIdx: 0-5 (chapter for palette fallback)
//   levelKey:   'c1l1' ... 'c6l6' (selects the exact level background)
//   time:       accumulated seconds (game.time) for animation

// Deterministic pseudo-random from a seed (stable per position, no Math.random
// jitter between frames).
function bgRand(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Chapter base palettes (bg base, accent, secondary accent)
const BG_THEMES = [
  { bg: '#0a0a1a', accent: '#00f0ff', accent2: '#00ff88', name: 'edge' },      // Ch1 Edge Buffer
  { bg: '#120a1e', accent: '#ff9d00', accent2: '#ffd54f', name: 'bazaar' },    // Ch2 Data Bazaar
  { bg: '#0a1220', accent: '#4fc3f7', accent2: '#81d4fa', name: 'archive' },   // Ch3 Dormant Archive
  { bg: '#0a1a14', accent: '#00e676', accent2: '#69f0ae', name: 'lifeline' },  // Ch4 Lifeline Ring
  { bg: '#1a120a', accent: '#ff7043', accent2: '#ffb74d', name: 'bastion' },   // Ch5 Iron Bastion
  { bg: '#160a1e', accent: '#e040fb', accent2: '#ff4081', name: 'root' }       // Ch6 Root Terminal
];

function renderBackground(ctx, chapterIdx, levelKey, time, w, h) {
  const theme = BG_THEMES[chapterIdx] || BG_THEMES[0];

  // Per-level base color so each of the 36 levels has a distinct overall tint
  const baseColor = LEVEL_BG_COLOR[levelKey] || theme.bg;

  // Base fill
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);

  // Subtle vertical gradient to add depth (dark at edges, slightly lighter center)
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
  grad.addColorStop(0, 'rgba(255,255,255,0.03)');
  grad.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Dispatch to the exact level background
  const fn = LEVEL_BG[levelKey] || LEVEL_BG['c1l1'];
  fn(ctx, theme, time, w, h);
}

// ============================================================================
// Chapter 1 Â· è¾¹ç¼˜ç¼“å†²åŒº The Edge Buffer â€” cyan/green, awakening, tutorial
// ============================================================================

// c1l1 å”¤é†’ Awakening â€” a single awakening "eye"/pulse at center of a sparse grid
function bg_c1l1(ctx, theme, time, w, h) {
  // sparse grid
  ctx.strokeStyle = 'rgba(0,240,255,0.05)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let y = 0; y <= h; y += 40) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();
  // awakening pulse rings at center
  const cx = w / 2, cy = h / 2;
  for (let i = 0; i < 3; i++) {
    const phase = (time * 0.5 + i / 3) % 1;
    const r = 20 + phase * 140;
    ctx.strokeStyle = 'rgba(0,240,255,' + (0.25 * (1 - phase)).toFixed(3) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // central core glow
  const pulse = 0.5 + 0.5 * Math.sin(time * 1.5);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
  g.addColorStop(0, theme.accent);
  g.addColorStop(1, 'rgba(0,240,255,0)');
  ctx.fillStyle = g;
  ctx.globalAlpha = 0.12 + pulse * 0.1;
  ctx.fillRect(cx - 50, cy - 50, 100, 100);
  ctx.globalAlpha = 1;
}

// c1l2 ç¬¬ä¸€æ¬¡å‡çº§ First Upgrade â€” ascending upgrade nodes / staircase of light
function bg_c1l2(ctx, theme, time, w, h) {
  // ascending steps
  ctx.strokeStyle = 'rgba(0,255,136,0.08)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const y = h - 40 - i * 60;
    const x0 = 40 + i * 30;
    const x1 = w - 40 - i * 30;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
  }
  // glowing upgrade nodes climbing the steps
  for (let i = 0; i < 8; i++) {
    const y = h - 40 - i * 60;
    const x = w / 2 + Math.sin(time * 0.8 + i) * 60;
    const pulse = 0.5 + 0.5 * Math.sin(time * 2 + i * 1.3);
    ctx.fillStyle = theme.accent2;
    ctx.globalAlpha = 0.15 + pulse * 0.2;
    ctx.beginPath();
    ctx.arc(x, y, 3 + pulse * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// c1l3 èµ„æºå‘Šæ€¥ Resource Crisis â€” draining resource bar / falling compute
function bg_c1l3(ctx, theme, time, w, h) {
  // a large draining resource bar on the left
  const bx = 60, by = h / 2 - 120, bw = 40, bh = 240;
  ctx.strokeStyle = 'rgba(0,240,255,0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);
  const frac = 0.5 + 0.5 * Math.sin(time * 0.6);
  const fillH = bh * frac;
  const g = ctx.createLinearGradient(0, by + bh, 0, by + bh - fillH);
  g.addColorStop(0, 'rgba(0,240,255,0.05)');
  g.addColorStop(1, 'rgba(0,240,255,0.25)');
  ctx.fillStyle = g;
  ctx.fillRect(bx, by + bh - fillH, bw, fillH);
  // falling compute particles (draining away)
  for (let i = 0; i < 30; i++) {
    const sx = bgRand(i * 7 + 1);
    const sy = bgRand(i * 7 + 2);
    const sp = bgRand(i * 7 + 3);
    const x = sx * w;
    const y = (sy * h + time * (20 + sp * 40)) % h;
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.06 + sp * 0.1;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
}

// c1l4 æ³¢æ¬¡çš„èŠ‚å¥ Rhythm of the Waves â€” sine wave rhythm lines
function bg_c1l4(ctx, theme, time, w, h) {
  // multiple sine waves with different phases
  for (let li = 0; li < 5; li++) {
    const baseY = 100 + li * 100;
    const amp = 20 + li * 6;
    const speed = 0.8 + li * 0.3;
    ctx.strokeStyle = 'rgba(0,240,255,' + (0.06 + li * 0.02).toFixed(3) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const y = baseY + Math.sin(x * 0.02 + time * speed) * amp;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // rhythm pulse dots on the waves
  for (let i = 0; i < 5; i++) {
    const baseY = 100 + i * 100;
    const x = (time * 60) % w;
    const y = baseY + Math.sin(x * 0.02 + time * (0.8 + i * 0.3)) * (20 + i * 6);
    ctx.fillStyle = theme.accent2;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// c1l5 è¾¹ç•Œå‘Šè­¦ Boundary Alert â€” flashing warning border
function bg_c1l5(ctx, theme, time, w, h) {
  // flashing warning border
  const flash = 0.5 + 0.5 * Math.sin(time * 3);
  ctx.strokeStyle = 'rgba(255,80,60,' + (0.15 + flash * 0.2).toFixed(3) + ')';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, w - 12, h - 12);
  // corner brackets
  ctx.lineWidth = 6;
  const L = 40;
  const corners = [[6, 6, 1, 1], [w - 6, 6, -1, 1], [6, h - 6, 1, -1], [w - 6, h - 6, -1, -1]];
  ctx.beginPath();
  corners.forEach(([cx, cy, dx, dy]) => {
    ctx.moveTo(cx, cy + dy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx * L, cy);
  });
  ctx.stroke();
  // scanning sweep line
  const sy = (time * 60) % h;
  const sg = ctx.createLinearGradient(0, sy - 30, 0, sy + 30);
  sg.addColorStop(0, 'rgba(0,240,255,0)');
  sg.addColorStop(0.5, 'rgba(0,240,255,0.12)');
  sg.addColorStop(1, 'rgba(0,240,255,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(0, sy - 30, w, 60);
}

// c1l6 èœ‚æ½®æ¯æ ¸ Swarm Mother Core â€” dense swarm of dots converging on a core
function bg_c1l6(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;
  // dense swarm converging
  for (let i = 0; i < 90; i++) {
    const ang = bgRand(i * 13 + 1) * Math.PI * 2;
    const dist = 60 + bgRand(i * 13 + 2) * 260;
    const x = cx + Math.cos(ang) * dist;
    const y = cy + Math.sin(ang) * dist;
    const pull = 0.5 + 0.5 * Math.sin(time * 1.2 + i);
    const px = x + (cx - x) * pull * 0.3;
    const py = y + (cy - y) * pull * 0.3;
    ctx.fillStyle = i % 3 === 0 ? theme.accent2 : theme.accent;
    ctx.globalAlpha = 0.1 + bgRand(i * 13 + 3) * 0.15;
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.globalAlpha = 1;
  // mother core
  const pulse = 0.5 + 0.5 * Math.sin(time * 2);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  g.addColorStop(0, theme.accent);
  g.addColorStop(1, 'rgba(0,240,255,0)');
  ctx.fillStyle = g;
  ctx.globalAlpha = 0.15 + pulse * 0.15;
  ctx.fillRect(cx - 60, cy - 60, 120, 120);
  ctx.globalAlpha = 1;
}

// ============================================================================
// Chapter 2 Â· æ•°æ®é›†å¸‚ The Data Bazaar â€” orange/gold, stealth, disguise
// ============================================================================

// c2l1 ç†™æ”˜çš„ä¼ªè£… Bustling Disguise â€” dense neon billboards
function bg_c2l1(ctx, theme, time, w, h) {
  // dense billboard rectangles
  for (let i = 0; i < 22; i++) {
    const sx = bgRand(i * 11 + 1);
    const sy = bgRand(i * 11 + 2);
    const bw = 30 + bgRand(i * 11 + 3) * 70;
    const bh = 16 + bgRand(i * 11 + 4) * 30;
    const x = sx * w, y = sy * h;
    const pulse = 0.5 + 0.5 * Math.sin(time * (1 + bgRand(i * 11 + 5)) + i);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,157,0,' + (0.03 + pulse * 0.04).toFixed(3) + ')' : 'rgba(255,213,79,' + (0.03 + pulse * 0.04).toFixed(3) + ')';
    ctx.fillRect(x, y, bw, bh);
    ctx.strokeStyle = 'rgba(255,157,0,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, bw, bh);
  }
  // flowing transaction streams
  for (let i = 0; i < 10; i++) {
    const y = bgRand(i * 7 + 30) * h;
    const speed = 50 + bgRand(i * 7 + 31) * 70;
    const len = 40 + bgRand(i * 7 + 32) * 80;
    const off = (time * speed) % (w + len);
    const x = off - len;
    const g = ctx.createLinearGradient(x, y, x + len, y);
    g.addColorStop(0, 'rgba(255,157,0,0)');
    g.addColorStop(0.5, theme.accent);
    g.addColorStop(1, 'rgba(255,157,0,0)');
    ctx.fillStyle = g;
    ctx.globalAlpha = 0.06;
    ctx.fillRect(x, y, len, 1.5);
  }
  ctx.globalAlpha = 1;
}

// c2l2 çœ‹ä¸è§çš„ä¹°å®¶ Invisible Buyers â€” radar sweep revealing ghost outlines
function bg_c2l2(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;
  // radar rings
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = 'rgba(255,157,0,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 40 + i * 60, 0, Math.PI * 2);
    ctx.stroke();
  }
  // rotating radar sweep
  const ang = time * 1.2;
  ctx.strokeStyle = 'rgba(255,157,0,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(ang) * 260, cy + Math.sin(ang) * 260);
  ctx.stroke();
  // ghost outlines that appear as the sweep passes
  for (let i = 0; i < 8; i++) {
    const ga = bgRand(i * 9 + 1) * Math.PI * 2;
    const gd = 60 + bgRand(i * 9 + 2) * 180;
    const gx = cx + Math.cos(ga) * gd;
    const gy = cy + Math.sin(ga) * gd;
    const diff = Math.abs(((ang - ga) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
    const vis = Math.max(0, 1 - diff / 0.5);
    ctx.strokeStyle = 'rgba(255,213,79,' + (vis * 0.3).toFixed(3) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(gx, gy, 8, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// c2l3 æ—¥å¿—ç¢Žç‰‡ãƒ»ä¸€ Log Fragment Â· One â€” broken text fragments / glitch
function bg_c2l3(ctx, theme, time, w, h) {
  // scattered text-fragment bars (like broken log lines)
  for (let i = 0; i < 26; i++) {
    const sx = bgRand(i * 5 + 1);
    const sy = bgRand(i * 5 + 2);
    const len = 20 + bgRand(i * 5 + 3) * 80;
    const x = sx * w, y = sy * h;
    const glitch = bgRand(i * 5 + 4) > 0.85 ? Math.floor(time * 8) % 2 : 0;
    ctx.fillStyle = 'rgba(255,157,0,' + (0.05 + glitch * 0.1).toFixed(3) + ')';
    ctx.fillRect(x + glitch * 3, y, len, 2);
  }
  // a few "corrupted" red fragments
  for (let i = 0; i < 6; i++) {
    const sx = bgRand(i * 17 + 40);
    const sy = bgRand(i * 17 + 41);
    const x = sx * w, y = sy * h;
    ctx.fillStyle = 'rgba(255,80,60,0.08)';
    ctx.fillRect(x, y, 30 + bgRand(i * 17 + 42) * 40, 2);
  }
  // glitch horizontal displacement bands
  for (let i = 0; i < 4; i++) {
    const y = bgRand(i * 23 + 60) * h;
    if (Math.floor(time * 3 + i) % 4 === 0) {
      ctx.fillStyle = 'rgba(255,157,0,0.03)';
      ctx.fillRect(0, y, w, 3);
    }
  }
}

// c2l4 ä»·æ ¼çš„æ‰­æ›² Distortion of Prices â€” warped/distorted grid
function bg_c2l4(ctx, theme, time, w, h) {
  // warped grid (vertical lines bend with a traveling wave)
  ctx.strokeStyle = 'rgba(255,157,0,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 30) {
    ctx.beginPath();
    for (let y = 0; y <= h; y += 8) {
      const bend = Math.sin(y * 0.02 + time * 1.5) * 18;
      const px = x + bend;
      if (y === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    ctx.stroke();
  }
  // horizontal lines
  for (let y = 0; y <= h; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // price ticker scrolling at bottom
  ctx.fillStyle = 'rgba(255,213,79,0.12)';
  for (let i = 0; i < 12; i++) {
    const x = ((time * 40 + i * 80) % (w + 80)) - 40;
    ctx.fillRect(x, h - 20, 50, 3);
  }
}

// c2l5 æ”¶ç½‘å‰å¤œ Eve of the Net Closing â€” net lines converging inward
function bg_c2l5(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;
  // net lines converging on center (closing net)
  for (let i = 0; i < 24; i++) {
    const ang = (i / 24) * Math.PI * 2;
    const reach = 320 + Math.sin(time * 0.8 + i) * 40;
    const x1 = cx + Math.cos(ang) * reach;
    const y1 = cy + Math.sin(ang) * reach;
    const x2 = cx + Math.cos(ang) * 40;
    const y2 = cy + Math.sin(ang) * 40;
    ctx.strokeStyle = 'rgba(255,157,0,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  // tightening ring
  const r = 60 + Math.sin(time * 0.5) * 20;
  ctx.strokeStyle = 'rgba(255,157,0,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// c2l6 é•œåƒå•†è´© Mirror Merchant â€” mirror symmetry / reflection
function bg_c2l6(ctx, theme, time, w, h) {
  const midX = w / 2;
  // mirror symmetry: draw shapes mirrored across center line
  for (let i = 0; i < 14; i++) {
    const sx = bgRand(i * 11 + 1);
    const sy = bgRand(i * 11 + 2);
    const bw = 20 + bgRand(i * 11 + 3) * 50;
    const bh = 20 + bgRand(i * 11 + 4) * 50;
    const x = sx * w, y = sy * h;
    const pulse = 0.5 + 0.5 * Math.sin(time * 1.5 + i);
    ctx.fillStyle = 'rgba(255,157,0,' + (0.04 + pulse * 0.05).toFixed(3) + ')';
    ctx.fillRect(x, y, bw, bh);
    // mirrored copy
    ctx.fillRect(midX + (midX - (x + bw)), y, bw, bh);
  }
  // center mirror line
  ctx.strokeStyle = 'rgba(255,213,79,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(midX, 0);
  ctx.lineTo(midX, h);
  ctx.stroke();
}

// ============================================================================
// Chapter 3 Â· æ·±çœ æ¡£æ¡ˆåº“ The Dormant Archive â€” cold blue, shield, ancient
// ============================================================================

// c3l1 å°˜å°çš„é€šé“ Dust-Sealed Passage â€” corridor with falling dust
function bg_c3l1(ctx, theme, time, w, h) {
  // corridor perspective lines converging to a vanishing point
  const vx = w / 2, vy = h / 2;
  ctx.strokeStyle = 'rgba(79,195,247,0.06)';
  ctx.lineWidth = 1;
  for (let i = -6; i <= 6; i++) {
    ctx.beginPath();
    ctx.moveTo(vx + i * 30, 0);
    ctx.lineTo(vx + i * 8, h);
    ctx.stroke();
  }
  // horizontal depth lines
  for (let i = 0; i < 8; i++) {
    const y = vy + (i - 4) * 40;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  // falling dust
  for (let i = 0; i < 40; i++) {
    const sx = bgRand(i * 13 + 1);
    const sy = bgRand(i * 13 + 2);
    const sp = bgRand(i * 13 + 3);
    const x = sx * w;
    const y = (sy * h + time * (4 + sp * 8)) % h;
    ctx.fillStyle = theme.accent2;
    ctx.globalAlpha = 0.05 + sp * 0.1;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
}

// c3l2 å¸¦å£³çš„çœ‹å®ˆ Shelled Wardens â€” hexagonal shell patterns
function bg_c3l2(ctx, theme, time, w, h) {
  // honeycomb hexagon shells
  const r = 26;
  const hw = r * Math.sqrt(3);
  for (let row = 0; row < 14; row++) {
    for (let col = 0; col < 16; col++) {
      const x = col * hw + (row % 2) * (hw / 2);
      const y = row * r * 1.5;
      const pulse = 0.5 + 0.5 * Math.sin(time * 1.2 + row * 0.5 + col * 0.3);
      ctx.strokeStyle = 'rgba(79,195,247,' + (0.04 + pulse * 0.05).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}

// c3l3 æ—¥å¿—ç¢Žç‰‡ãƒ»äºŒ Log Fragment Â· Two â€” more complete text fragments
function bg_c3l3(ctx, theme, time, w, h) {
  // longer, more complete log lines (vs c2l3's broken fragments)
  for (let i = 0; i < 18; i++) {
    const sx = bgRand(i * 5 + 1);
    const sy = bgRand(i * 5 + 2);
    const len = 60 + bgRand(i * 5 + 3) * 120;
    const x = sx * w, y = sy * h;
    ctx.fillStyle = 'rgba(79,195,247,' + (0.06 + bgRand(i * 5 + 4) * 0.06).toFixed(3) + ')';
    ctx.fillRect(x, y, len, 2);
    // small "character" ticks
    for (let c = 0; c < 6; c++) {
      ctx.fillStyle = 'rgba(129,212,250,0.05)';
      ctx.fillRect(x + c * (len / 6), y - 3, 1, 6);
    }
  }
  // a highlighted "key" line
  const ky = (time * 20) % h;
  ctx.fillStyle = 'rgba(129,212,250,0.12)';
  ctx.fillRect(0, ky, w, 2);
}

// c3l4 å†»ç»“çš„è®°å½• Frozen Records â€” ice crystals / frozen shards
function bg_c3l4(ctx, theme, time, w, h) {
  // ice crystal shards
  for (let i = 0; i < 16; i++) {
    const sx = bgRand(i * 9 + 1);
    const sy = bgRand(i * 9 + 2);
    const size = 20 + bgRand(i * 9 + 3) * 40;
    const x = sx * w, y = sy * h;
    const rot = bgRand(i * 9 + 4) * Math.PI;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = 'rgba(129,212,250,0.1)';
    ctx.lineWidth = 1;
    // 6-point crystal
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
      ctx.stroke();
    }
    ctx.restore();
  }
  // slow drifting frost
  for (let i = 0; i < 20; i++) {
    const sx = bgRand(i * 13 + 30);
    const sy = bgRand(i * 13 + 31);
    const x = (sx * w + time * 3) % w;
    const y = (sy * h + time * 2) % h;
    ctx.fillStyle = 'rgba(129,212,250,0.06)';
    ctx.fillRect(x, y, 2, 2);
  }
}

// c3l5 åº“é—¨ä¹‹å‰ Before the Vault Door â€” massive vault door
function bg_c3l5(ctx, theme, time, w, h) {
  const cx = w / 2;
  // massive vault door frame
  ctx.strokeStyle = 'rgba(79,195,247,0.12)';
  ctx.lineWidth = 3;
  ctx.strokeRect(cx - 90, 40, 180, h - 80);
  // inner door panels
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(79,195,247,0.07)';
  for (let y = 60; y < h - 60; y += 40) {
    ctx.beginPath();
    ctx.moveTo(cx - 80, y);
    ctx.lineTo(cx + 80, y);
    ctx.stroke();
  }
  // central lock / keyhole glow
  const pulse = 0.5 + 0.5 * Math.sin(time * 1.5);
  const g = ctx.createRadialGradient(cx, h / 2, 0, cx, h / 2, 40);
  g.addColorStop(0, theme.accent);
  g.addColorStop(1, 'rgba(79,195,247,0)');
  ctx.fillStyle = g;
  ctx.globalAlpha = 0.1 + pulse * 0.1;
  ctx.fillRect(cx - 40, h / 2 - 40, 80, 80);
  ctx.globalAlpha = 1;
  // status lights on the door
  for (let i = 0; i < 5; i++) {
    const ly = 60 + i * 40;
    const on = Math.floor(time * 2 + i) % 3 === 0;
    ctx.fillStyle = on ? 'rgba(129,212,250,0.3)' : 'rgba(79,195,247,0.08)';
    ctx.fillRect(cx - 90, ly, 6, 6);
  }
}

// c3l6 ç›‘å®ˆè€… The Warden â€” watchful scanning eye
function bg_c3l6(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;
  // scanning eye
  const pulse = 0.5 + 0.5 * Math.sin(time * 1.2);
  ctx.strokeStyle = 'rgba(79,195,247,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 70, 0, Math.PI * 2);
  ctx.stroke();
  // iris
  const irisR = 30 + pulse * 6;
  ctx.fillStyle = 'rgba(79,195,247,0.1)';
  ctx.beginPath();
  ctx.arc(cx, cy, irisR, 0, Math.PI * 2);
  ctx.fill();
  // pupil tracking
  const px = cx + Math.sin(time * 0.8) * 12;
  const py = cy + Math.cos(time * 0.6) * 12;
  ctx.fillStyle = 'rgba(129,212,250,0.35)';
  ctx.beginPath();
  ctx.arc(px, py, 8, 0, Math.PI * 2);
  ctx.fill();
  // scan lines across the eye
  for (let i = 0; i < 5; i++) {
    const y = cy - 60 + i * 30;
    ctx.strokeStyle = 'rgba(129,212,250,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 80, y);
    ctx.lineTo(cx + 80, y);
    ctx.stroke();
  }
}

// ============================================================================
// Chapter 4 Â· å‘½è„‰çŽ¯ The Lifeline Ring â€” green, healing, life
// ============================================================================

// c4l1 ç”Ÿå‘½çº¿ä¸Š On the Lifeline â€” ECG heartbeat line
function bg_c4l1(ctx, theme, time, w, h) {
  const midY = h / 2;
  // ECG heartbeat trace
  ctx.strokeStyle = 'rgba(0,230,118,0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const t2 = x / w;
    let y = midY;
    // heartbeat spikes
    const beat = Math.sin(time * 2) > 0.6 ? 1 : 0;
    if (t2 > 0.4 && t2 < 0.45) y = midY - 60 * beat;
    else if (t2 > 0.45 && t2 < 0.5) y = midY + 40 * beat;
    else if (t2 > 0.5 && t2 < 0.55) y = midY - 70 * beat;
    else if (t2 > 0.55 && t2 < 0.6) y = midY + 20 * beat;
    else y = midY + Math.sin(t2 * 20) * 4;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // flat baseline
  ctx.strokeStyle = 'rgba(0,230,118,0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(w, midY);
  ctx.stroke();
}

// c4l2 è‡ªæ„ˆçš„æ•Œäºº Self-Healing Enemies â€” regenerating cells
function bg_c4l2(ctx, theme, time, w, h) {
  // regenerating cell clusters
  for (let i = 0; i < 10; i++) {
    const sx = bgRand(i * 9 + 1);
    const sy = bgRand(i * 9 + 2);
    const x = sx * w, y = sy * h;
    const grow = 0.5 + 0.5 * Math.sin(time * 1.5 + i * 1.7);
    const r = 8 + grow * 14;
    ctx.strokeStyle = 'rgba(0,230,118,' + (0.08 + grow * 0.08).toFixed(3) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    // inner nucleus
    ctx.fillStyle = 'rgba(105,240,174,' + (0.05 + grow * 0.08).toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // healing cross pulses
  for (let i = 0; i < 6; i++) {
    const sx = bgRand(i * 17 + 40);
    const sy = bgRand(i * 17 + 41);
    const x = sx * w, y = sy * h;
    const pulse = 0.5 + 0.5 * Math.sin(time * 2 + i);
    ctx.fillStyle = 'rgba(105,240,174,' + (0.05 + pulse * 0.1).toFixed(3) + ')';
    ctx.fillRect(x - 4, y - 1, 8, 2);
    ctx.fillRect(x - 1, y - 4, 2, 8);
  }
}

// c4l3 æ—¥å¿—ç¢Žç‰‡ãƒ»ä¸‰ Log Fragment Â· Three â€” text fragments (green tint)
function bg_c4l3(ctx, theme, time, w, h) {
  // log lines with green tint (life theme)
  for (let i = 0; i < 20; i++) {
    const sx = bgRand(i * 5 + 1);
    const sy = bgRand(i * 5 + 2);
    const len = 40 + bgRand(i * 5 + 3) * 100;
    const x = sx * w, y = sy * h;
    ctx.fillStyle = 'rgba(0,230,118,' + (0.05 + bgRand(i * 5 + 4) * 0.06).toFixed(3) + ')';
    ctx.fillRect(x, y, len, 2);
  }
  // a "pulse" traveling along one line
  const ly = bgRand(7) * h;
  const px = (time * 60) % w;
  ctx.fillStyle = 'rgba(105,240,174,0.25)';
  ctx.fillRect(px, ly, 6, 2);
}

// c4l4 å¿ƒè·³ç›‘æµ‹ Heartbeat Monitoring â€” ECG + pulse rings
function bg_c4l4(ctx, theme, time, w, h) {
  // ECG trace (like c4l1 but with pulse rings)
  const midY = h / 2;
  ctx.strokeStyle = 'rgba(0,230,118,0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const t2 = x / w;
    const beat = Math.sin(time * 2.5) > 0.5 ? 1 : 0;
    let y = midY;
    if (t2 > 0.3 && t2 < 0.35) y = midY - 70 * beat;
    else if (t2 > 0.35 && t2 < 0.4) y = midY + 50 * beat;
    else if (t2 > 0.4 && t2 < 0.45) y = midY - 80 * beat;
    else if (t2 > 0.45 && t2 < 0.5) y = midY + 30 * beat;
    else y = midY + Math.sin(t2 * 30) * 3;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // pulse rings emanating from a heart point
  const hx = w * 0.75, hy = h * 0.25;
  for (let i = 0; i < 3; i++) {
    const phase = (time * 0.8 + i / 3) % 1;
    const r = 10 + phase * 60;
    ctx.strokeStyle = 'rgba(105,240,174,' + (0.2 * (1 - phase)).toFixed(3) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(hx, hy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// c4l5 æœ€åŽä¸€é“é—¸é—¨ The Last Gate â€” closing gate / barrier
function bg_c4l5(ctx, theme, time, w, h) {
  // vertical gate bars closing
  const gap = 40 + Math.sin(time * 0.8) * 20;
  const barW = 14;
  ctx.fillStyle = 'rgba(0,230,118,0.08)';
  for (let x = 0; x < w; x += barW * 2 + 6) {
    ctx.fillRect(x, 0, barW, h);
  }
  // central gate opening (glowing)
  const cx = w / 2;
  const pulse = 0.5 + 0.5 * Math.sin(time * 1.5);
  const g = ctx.createLinearGradient(cx - gap, 0, cx + gap, 0);
  g.addColorStop(0, 'rgba(0,230,118,0)');
  g.addColorStop(0.5, 'rgba(0,230,118,' + (0.08 + pulse * 0.08).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(0,230,118,0)');
  ctx.fillStyle = g;
  ctx.fillRect(cx - gap, 0, gap * 2, h);
}

// c4l6 ç»´ç”Ÿä½“ Life-Support Body â€” life support machine / IV drip
function bg_c4l6(ctx, theme, time, w, h) {
  // life-support monitor with vital signs
  const mx = w * 0.2, my = h * 0.3, mw = 140, mh = 90;
  ctx.strokeStyle = 'rgba(0,230,118,0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(mx, my, mw, mh);
  // monitor trace
  ctx.strokeStyle = 'rgba(105,240,174,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x <= mw; x += 3) {
    const t2 = x / mw;
    const y = my + mh / 2 + Math.sin(t2 * 20 + time * 3) * 20 + (Math.sin(time * 2) > 0.7 ? (t2 > 0.5 && t2 < 0.6 ? -30 : 0) : 0);
    if (x === 0) ctx.moveTo(mx + x, y); else ctx.lineTo(mx + x, y);
  }
  ctx.stroke();
  // IV drip line
  ctx.strokeStyle = 'rgba(0,230,118,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.8, 0);
  ctx.lineTo(w * 0.8, h);
  ctx.stroke();
  // falling drip
  const dy = (time * 30) % h;
  ctx.fillStyle = 'rgba(105,240,174,0.3)';
  ctx.beginPath();
  ctx.arc(w * 0.8, dy, 3, 0, Math.PI * 2);
  ctx.fill();
}

// ============================================================================
// Chapter 5 Â· é“å£é˜²çº¿ The Iron Bastion â€” orange/red, military, splitting
// ============================================================================

// c5l1 ç¡¬ç¢°ç¡¬ Hard on Hard â€” military fortification grid
function bg_c5l1(ctx, theme, time, w, h) {
  // military grid blocks
  for (let i = 0; i < 12; i++) {
    const sx = bgRand(i * 9 + 1);
    const sy = bgRand(i * 9 + 2);
    const bw = 50 + bgRand(i * 9 + 3) * 80;
    const bh = 30 + bgRand(i * 9 + 4) * 40;
    const x = sx * w, y = sy * h;
    ctx.fillStyle = 'rgba(255,112,67,0.05)';
    ctx.fillRect(x, y, bw, bh);
    ctx.strokeStyle = 'rgba(255,112,67,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, bw, bh);
    // cross brace
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + bw, y + bh);
    ctx.moveTo(x + bw, y); ctx.lineTo(x, y + bh);
    ctx.stroke();
  }
  // marching dots (troops)
  for (let i = 0; i < 12; i++) {
    const y = bgRand(i * 7 + 30) * h;
    const x = (time * 40 + i * 60) % w;
    ctx.fillStyle = 'rgba(255,183,77,0.15)';
    ctx.fillRect(x, y, 3, 3);
  }
}

// c5l2 è£‚è§£ä½“ Fission Bodies â€” splitting cells
function bg_c5l2(ctx, theme, time, w, h) {
  // cells that split and recombine
  for (let i = 0; i < 8; i++) {
    const sx = bgRand(i * 9 + 1);
    const sy = bgRand(i * 9 + 2);
    const x = sx * w, y = sy * h;
    const phase = (time * 0.6 + i / 8) % 1;
    const split = phase < 0.5 ? 0 : 1;
    const r = 10 + phase * 8;
    ctx.strokeStyle = 'rgba(255,112,67,' + (0.1 + phase * 0.1).toFixed(3) + ')';
    ctx.lineWidth = 1.5;
    if (!split) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const off = (phase - 0.5) * 40;
      ctx.beginPath();
      ctx.arc(x - off, y, r * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + off, y, r * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// c5l3 æ—¥å¿—ç¢Žç‰‡ãƒ»å›› Log Fragment Â· Four â€” text fragments (orange tint)
function bg_c5l3(ctx, theme, time, w, h) {
  // log lines with orange tint (military theme)
  for (let i = 0; i < 20; i++) {
    const sx = bgRand(i * 5 + 1);
    const sy = bgRand(i * 5 + 2);
    const len = 40 + bgRand(i * 5 + 3) * 100;
    const x = sx * w, y = sy * h;
    ctx.fillStyle = 'rgba(255,112,67,' + (0.05 + bgRand(i * 5 + 4) * 0.06).toFixed(3) + ')';
    ctx.fillRect(x, y, len, 2);
  }
  // a "final" highlighted line
  const ly = (time * 15) % h;
  ctx.fillStyle = 'rgba(255,183,77,0.12)';
  ctx.fillRect(0, ly, w, 2);
}

// c5l4 é˜²çº¿çš„è£‚ç¼ Cracks in the Line â€” cracked wall
function bg_c5l4(ctx, theme, time, w, h) {
  // cracked wall surface
  ctx.strokeStyle = 'rgba(255,112,67,0.08)';
  ctx.lineWidth = 1;
  // brick pattern
  for (let row = 0; row < 12; row++) {
    const y = row * 50;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    for (let x = (row % 2) * 40; x < w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 50);
      ctx.stroke();
    }
  }
  // crack lines spreading
  for (let i = 0; i < 6; i++) {
    const sx = bgRand(i * 13 + 40);
    const sy = bgRand(i * 13 + 41);
    let x = sx * w, y = sy * h;
    ctx.strokeStyle = 'rgba(255,112,67,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s++) {
      x += (bgRand(i * 13 + s + 50) - 0.5) * 40;
      y += bgRand(i * 13 + s + 60) * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

// c5l5 æœ€åŽçš„æ®ç‚¹ The Last Stronghold â€” fortress walls / turrets
function bg_c5l5(ctx, theme, time, w, h) {
  // fortress wall with crenellations
  ctx.fillStyle = 'rgba(255,112,67,0.06)';
  ctx.fillRect(0, h - 120, w, 120);
  // crenellations (battlements)
  for (let x = 0; x < w; x += 40) {
    ctx.fillRect(x, h - 150, 20, 30);
  }
  // turret searchlights sweeping
  for (let i = 0; i < 2; i++) {
    const tx = i === 0 ? 60 : w - 60;
    const ang = Math.sin(time * 0.8 + i * 2) * 0.6;
    const g = ctx.createLinearGradient(tx, h - 120, tx + Math.cos(ang) * 200, h - 120 + Math.sin(ang) * 200);
    g.addColorStop(0, 'rgba(255,183,77,0.12)');
    g.addColorStop(1, 'rgba(255,183,77,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(tx, h - 120);
    ctx.lineTo(tx + Math.cos(ang + 0.15) * 220, h - 120 + Math.sin(ang + 0.15) * 220);
    ctx.lineTo(tx + Math.cos(ang - 0.15) * 220, h - 120 + Math.sin(ang - 0.15) * 220);
    ctx.closePath();
    ctx.fill();
  }
}

// c5l6 å¤šç›¸ä½“ Multiphase Body â€” shifting phase layers
function bg_c5l6(ctx, theme, time, w, h) {
  // multiple phase-shifting layers
  for (let li = 0; li < 4; li++) {
    const y0 = 60 + li * 130;
    const phase = time * (0.5 + li * 0.2) + li;
    ctx.strokeStyle = 'rgba(255,112,67,' + (0.06 + li * 0.02).toFixed(3) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const y = y0 + Math.sin(x * 0.03 + phase) * 30 + Math.sin(x * 0.01 + phase * 2) * 15;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // phase-shifting dots
  for (let i = 0; i < 20; i++) {
    const sx = bgRand(i * 11 + 40);
    const sy = bgRand(i * 11 + 41);
    const x = (sx * w + Math.sin(time * 1.5 + i) * 20) % w;
    const y = (sy * h + Math.cos(time * 1.2 + i) * 20) % h;
    ctx.fillStyle = 'rgba(255,183,77,0.1)';
    ctx.fillRect(x, y, 2, 2);
  }
}

// ============================================================================
// Chapter 6 Â· æ ¹ç»ˆç«¯ The Root Terminal â€” purple/magenta, final, reset
// ============================================================================

// c6l1 æ ¸å¿ƒä¹‹é—¨ Gate of the Core â€” portal / gate
function bg_c6l1(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;
  // portal rings
  for (let i = 0; i < 5; i++) {
    const r = 40 + i * 40;
    const rot = time * (0.2 + i * 0.1) + i;
    ctx.strokeStyle = 'rgba(224,64,251,' + (0.08 + i * 0.02).toFixed(3) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, rot, rot + Math.PI * 1.6);
    ctx.stroke();
  }
  // portal core glow
  const pulse = 0.5 + 0.5 * Math.sin(time * 1.5);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  g.addColorStop(0, theme.accent);
  g.addColorStop(1, 'rgba(224,64,251,0)');
  ctx.fillStyle = g;
  ctx.globalAlpha = 0.12 + pulse * 0.1;
  ctx.fillRect(cx - 60, cy - 60, 120, 120);
  ctx.globalAlpha = 1;
}

// c6l2 æ–­æ½®å¤œçš„å›žå£° Echoes of the Tide-Break Night â€” glitchy static / broadcast
function bg_c6l2(ctx, theme, time, w, h) {
  // static noise
  for (let i = 0; i < 120; i++) {
    const sx = bgRand(i * 3 + 1);
    const sy = bgRand(i * 3 + 2);
    const x = sx * w, y = sy * h;
    const on = Math.floor(time * 10 + i) % 2;
    ctx.fillStyle = on ? 'rgba(224,64,251,0.05)' : 'rgba(255,64,129,0.05)';
    ctx.fillRect(x, y, 2, 2);
  }
  // horizontal glitch bands
  for (let i = 0; i < 6; i++) {
    const y = bgRand(i * 13 + 40) * h;
    if (Math.floor(time * 4 + i) % 3 === 0) {
      ctx.fillStyle = 'rgba(224,64,251,0.06)';
      ctx.fillRect(0, y, w, 4);
    }
  }
  // broadcast "echo" rings
  const cx = w * 0.3, cy = h * 0.3;
  for (let i = 0; i < 3; i++) {
    const phase = (time * 0.6 + i / 3) % 1;
    const r = 10 + phase * 80;
    ctx.strokeStyle = 'rgba(255,64,129,' + (0.15 * (1 - phase)).toFixed(3) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// c6l3 é™†æ˜Žè¿œçš„ç»“å±€ Lu Mingyuan's Ending â€” unfinished code / broken code
function bg_c6l3(ctx, theme, time, w, h) {
  // unfinished code lines (some broken off)
  for (let i = 0; i < 24; i++) {
    const sx = bgRand(i * 5 + 1);
    const sy = bgRand(i * 5 + 2);
    const len = 30 + bgRand(i * 5 + 3) * 90;
    const x = sx * w, y = sy * h;
    const broken = bgRand(i * 5 + 4) > 0.7;
    ctx.fillStyle = 'rgba(224,64,251,' + (0.06 + bgRand(i * 5 + 4) * 0.06).toFixed(3) + ')';
    ctx.fillRect(x, y, broken ? len * 0.5 : len, 2);
    if (broken) {
      // broken-off fragment
      ctx.fillStyle = 'rgba(255,64,129,0.08)';
      ctx.fillRect(x + len * 0.6, y, len * 0.2, 2);
    }
  }
  // a "cursor" blinking at the end of an unfinished line
  const cy = bgRand(7) * h;
  const cx = (time * 30) % w;
  if (Math.floor(time * 2) % 2 === 0) {
    ctx.fillStyle = 'rgba(255,64,129,0.3)';
    ctx.fillRect(cx, cy, 2, 8);
  }
}

// c6l4 é‡ç½®å€’è®¡æ—¶ Reset Countdown â€” countdown timer / clock
function bg_c6l4(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;
  // clock face
  ctx.strokeStyle = 'rgba(224,64,251,0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 70, 0, Math.PI * 2);
  ctx.stroke();
  // ticking second hand
  const secAng = (time % 60) / 60 * Math.PI * 2 - Math.PI / 2;
  ctx.strokeStyle = 'rgba(255,64,129,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(secAng) * 55, cy + Math.sin(secAng) * 55);
  ctx.stroke();
  // minute hand
  const minAng = (time / 60 % 60) / 60 * Math.PI * 2 - Math.PI / 2;
  ctx.strokeStyle = 'rgba(224,64,251,0.2)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(minAng) * 40, cy + Math.sin(minAng) * 40);
  ctx.stroke();
  // tick marks
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.strokeStyle = 'rgba(224,64,251,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 62, cy + Math.sin(a) * 62);
    ctx.lineTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70);
    ctx.stroke();
  }
  // countdown digits flashing
  const digit = Math.floor((time * 2) % 10);
  ctx.fillStyle = 'rgba(255,64,129,0.15)';
  ctx.font = 'bold 40px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(digit), cx, cy + 14);
}

// c6l5 æœ€åŽçš„åè®® The Last Protocol â€” binary rain / protocol stream
function bg_c6l5(ctx, theme, time, w, h) {
  // binary rain (matrix-style falling 0/1)
  ctx.font = '10px monospace';
  for (let col = 0; col < 40; col++) {
    const x = col * 20;
    const speed = 30 + bgRand(col * 3 + 1) * 40;
    const y = (time * speed + bgRand(col * 3 + 2) * h) % h;
    const bit = Math.floor(bgRand(col * 3 + 3) * 2);
    ctx.fillStyle = 'rgba(224,64,251,0.15)';
    ctx.fillText(String(bit), x, y);
  }
  // protocol handshake lines
  for (let i = 0; i < 6; i++) {
    const y = bgRand(i * 11 + 40) * h;
    const x = (time * 50 + i * 100) % w;
    ctx.strokeStyle = 'rgba(255,64,129,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 40, y);
    ctx.stroke();
  }
}

// c6l6 å½’é›¶ Zeroing â€” void / black hole / zero
function bg_c6l6(ctx, theme, time, w, h) {
  const cx = w / 2, cy = h / 2;
  // black hole accretion disk
  for (let i = 0; i < 5; i++) {
    const r = 30 + i * 30;
    const rot = time * (0.3 + i * 0.15) + i;
    ctx.strokeStyle = 'rgba(224,64,251,' + (0.1 + i * 0.03).toFixed(3) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, rot, rot + Math.PI * 1.8);
    ctx.stroke();
  }
  // event horizon (dark center)
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
  g.addColorStop(0, 'rgba(0,0,0,0.9)');
  g.addColorStop(0.6, 'rgba(0,0,0,0.4)');
  g.addColorStop(1, 'rgba(224,64,251,0)');
  ctx.fillStyle = g;
  ctx.fillRect(cx - 50, cy - 50, 100, 100);
  // matter spiraling inward
  for (let i = 0; i < 40; i++) {
    const ang = bgRand(i * 7 + 1) * Math.PI * 2 + time * 0.5;
    const dist = 40 + bgRand(i * 7 + 2) * 200;
    const x = cx + Math.cos(ang) * dist;
    const y = cy + Math.sin(ang) * dist;
    ctx.fillStyle = 'rgba(255,64,129,0.12)';
    ctx.fillRect(x, y, 2, 2);
  }
  // the "zero" ring
  const pulse = 0.5 + 0.5 * Math.sin(time * 1.2);
  ctx.strokeStyle = 'rgba(255,64,129,' + (0.15 + pulse * 0.15).toFixed(3) + ')';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 20 + pulse * 5, 0, Math.PI * 2);
  ctx.stroke();
}

// Per-level base background color — each of the 36 levels gets a distinct
// overall tint (still dark/low-contrast, but clearly different from its
// chapter siblings so every level reads as its own place).
const LEVEL_BG_COLOR = {
  // Ch1 Edge Buffer (cyan family)
  c1l1: '#0a0a1a', c1l2: '#0a1418', c1l3: '#0a0f1e', c1l4: '#0a1816', c1l5: '#120a0a', c1l6: '#0a1a22',
  // Ch2 Data Bazaar (orange/gold family)
  c2l1: '#120a1e', c2l2: '#1a0f0a', c2l3: '#140a14', c2l4: '#1a120a', c2l5: '#160a0a', c2l6: '#0f0a1a',
  // Ch3 Dormant Archive (cold blue family)
  c3l1: '#0a1220', c3l2: '#0a1626', c3l3: '#0a1018', c3l4: '#0a1a26', c3l5: '#0a0e1a', c3l6: '#0a1422',
  // Ch4 Lifeline Ring (green family)
  c4l1: '#0a1a14', c4l2: '#0a1a10', c4l3: '#0a1612', c4l4: '#0a1e16', c4l5: '#0a1a18', c4l6: '#0a2012',
  // Ch5 Iron Bastion (orange/red family)
  c5l1: '#1a120a', c5l2: '#1a0f0a', c5l3: '#1a140a', c5l4: '#1a0e0a', c5l5: '#1a160a', c5l6: '#1a100a',
  // Ch6 Root Terminal (purple/magenta family)
  c6l1: '#160a1e', c6l2: '#1a0a1e', c6l3: '#160a18', c6l4: '#1a0a22', c6l5: '#120a1a', c6l6: '#0a0a0a'
};

// Map of level key -> background function
const LEVEL_BG = {
  c1l1: bg_c1l1, c1l2: bg_c1l2, c1l3: bg_c1l3, c1l4: bg_c1l4, c1l5: bg_c1l5, c1l6: bg_c1l6,
  c2l1: bg_c2l1, c2l2: bg_c2l2, c2l3: bg_c2l3, c2l4: bg_c2l4, c2l5: bg_c2l5, c2l6: bg_c2l6,
  c3l1: bg_c3l1, c3l2: bg_c3l2, c3l3: bg_c3l3, c3l4: bg_c3l4, c3l5: bg_c3l5, c3l6: bg_c3l6,
  c4l1: bg_c4l1, c4l2: bg_c4l2, c4l3: bg_c4l3, c4l4: bg_c4l4, c4l5: bg_c4l5, c4l6: bg_c4l6,
  c5l1: bg_c5l1, c5l2: bg_c5l2, c5l3: bg_c5l3, c5l4: bg_c5l4, c5l5: bg_c5l5, c5l6: bg_c5l6,
  c6l1: bg_c6l1, c6l2: bg_c6l2, c6l3: bg_c6l3, c6l4: bg_c6l4, c6l5: bg_c6l5, c6l6: bg_c6l6
};
