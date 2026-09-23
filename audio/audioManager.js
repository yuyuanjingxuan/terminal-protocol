// audio/audioManager.js - Web Audio synthesized SFX + BGM (Phase 6)
// All sounds are generated with oscillators/noise — no audio files.
class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.enabled = true;      // master SFX toggle
    this.musicEnabled = true; // BGM toggle
    this.noiseBuffer = null;
    this.lastAttackSound = 0; // throttle attack sounds
    this.musicTimer = null;
    this.musicStep = 0;
    this.musicNextTime = 0;
    this.musicChapter = 0;
  }

  // Lazily create the AudioContext (must happen after a user gesture)
  ensureContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return true;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.18;
    this.musicGain.connect(this.ctx.destination);
    // Pre-build a 1-second white noise buffer
    const len = this.ctx.sampleRate;
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return true;
  }

  // Call on any user gesture (click/keydown) to unlock audio
  unlock() {
    this.ensureContext();
  }

  setEnabled(on) {
    this.enabled = on;
  }

  setMusicEnabled(on) {
    this.musicEnabled = on;
    if (!on) this.stopMusic();
  }

  // ---------- low-level helpers ----------

  // Play a single oscillator tone
  tone(freq, dur, opts = {}) {
    if (!this.ctx) return;
    const {
      type = 'sine',
      vol = 0.2,
      delay = 0,
      slideTo = null,
      dest = null
    } = opts;
    // Music tones (routed to musicGain) respect the music toggle; SFX respect the SFX toggle
    const isMusic = dest === this.musicGain;
    if (isMusic ? !this.musicEnabled : !this.enabled) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + dur);
    }
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(dest || this.masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // Play a filtered noise burst
  noise(dur, opts = {}) {
    if (!this.ctx || !this.enabled) return;
    const {
      vol = 0.3,
      delay = 0,
      filterFreq = 1000,
      filterType = 'lowpass',
      slideTo = null
    } = opts;
    const t0 = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, t0);
    if (slideTo !== null) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    }
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  // ---------- SFX ----------

  playTowerBuilt() {
    if (!this.ensureContext()) return;
    this.tone(440, 0.08, { type: 'square', vol: 0.15 });
    this.tone(880, 0.12, { type: 'square', vol: 0.15, delay: 0.07 });
  }

  playError() {
    if (!this.ensureContext()) return;
    this.tone(160, 0.15, { type: 'sawtooth', vol: 0.12, slideTo: 90 });
  }

  // Faction-specific attack sounds (throttled to avoid overload)
  playAttack(faction) {
    if (!this.ensureContext()) return;
    const now = performance.now();
    if (now - this.lastAttackSound < 60) return; // max ~16/s
    this.lastAttackSound = now;

    switch (faction) {
      case 'energy': // laser zap
        this.tone(1400, 0.12, { type: 'sawtooth', vol: 0.08, slideTo: 300 });
        break;
      case 'explosive': // cannon thump
        this.tone(120, 0.18, { type: 'sine', vol: 0.2, slideTo: 50 });
        this.noise(0.1, { vol: 0.08, filterFreq: 800 });
        break;
      case 'electromagnetic': // EM zap
        this.tone(700, 0.1, { type: 'triangle', vol: 0.08, slideTo: 1200 });
        break;
      case 'support': // soft chime
        this.tone(660, 0.15, { type: 'sine', vol: 0.06 });
        break;
      default:
        this.tone(900, 0.1, { type: 'square', vol: 0.06, slideTo: 500 });
    }
  }

  playEnemyDie(size) {
    if (!this.ensureContext()) return;
    const big = size >= 14;
    this.tone(big ? 300 : 500, big ? 0.3 : 0.18, { type: 'square', vol: big ? 0.15 : 0.1, slideTo: 60 });
    this.noise(big ? 0.35 : 0.15, { vol: big ? 0.2 : 0.1, filterFreq: big ? 600 : 1500, slideTo: 100 });
  }

  playExplosion() {
    if (!this.ensureContext()) return;
    this.noise(0.4, { vol: 0.3, filterFreq: 900, slideTo: 60 });
    this.tone(80, 0.35, { type: 'sine', vol: 0.25, slideTo: 30 });
  }

  playPulse() {
    if (!this.ensureContext()) return;
    this.tone(200, 0.4, { type: 'sine', vol: 0.15, slideTo: 900 });
  }

  playWaveStart() {
    if (!this.ensureContext()) return;
    this.tone(330, 0.1, { type: 'square', vol: 0.12 });
    this.tone(440, 0.1, { type: 'square', vol: 0.12, delay: 0.1 });
    this.tone(660, 0.18, { type: 'square', vol: 0.14, delay: 0.2 });
  }

  // Boss alarm: two descending klaxon blasts
  playBossWarning() {
    if (!this.ensureContext()) return;
    this.tone(520, 0.35, { type: 'sawtooth', vol: 0.18, slideTo: 180 });
    this.tone(520, 0.35, { type: 'sawtooth', vol: 0.18, slideTo: 180, delay: 0.5 });
    this.tone(110, 0.8, { type: 'sine', vol: 0.15, delay: 0.1 });
  }

  playWin() {
    if (!this.ensureContext()) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) => this.tone(f, 0.3, { type: 'triangle', vol: 0.18, delay: i * 0.15 }));
    this.tone(1046.5, 0.6, { type: 'sine', vol: 0.12, delay: 0.6 });
  }

  playLose() {
    if (!this.ensureContext()) return;
    const notes = [392, 349.23, 311.13, 261.63]; // G4 F4 E4 C4
    notes.forEach((f, i) => this.tone(f, 0.35, { type: 'sawtooth', vol: 0.12, delay: i * 0.2 }));
    this.tone(130.81, 0.8, { type: 'sine', vol: 0.15, delay: 0.8 });
  }

  playTechUnlock() {
    if (!this.ensureContext()) return;
    const notes = [880, 1108.73, 1318.51]; // A5 C#6 E6
    notes.forEach((f, i) => this.tone(f, 0.2, { type: 'sine', vol: 0.12, delay: i * 0.08 }));
  }

  // ---------- BGM (simple synth loop, per chapter) ----------

  // Chapter patterns: [bass note, arp notes] in Hz; 0 = rest
  static BGM_PATTERNS = [
    { // Chapter 1: calm minor (A minor)
      tempo: 100,
      bass: [110, 0, 110, 0, 130.81, 0, 110, 0, 98, 0, 98, 0, 130.81, 0, 146.83, 0],
      arp:  [440, 523.25, 659.25, 523.25, 440, 523.25, 659.25, 783.99,
             392, 493.88, 587.33, 493.88, 392, 493.88, 587.33, 659.25]
    },
    { // Chapter 2: tense (D minor, faster)
      tempo: 120,
      bass: [73.42, 73.42, 0, 73.42, 0, 73.42, 82.41, 0, 73.42, 73.42, 0, 73.42, 0, 65.41, 65.41, 0],
      arp:  [293.66, 349.23, 440, 349.23, 293.66, 349.23, 440, 523.25,
             293.66, 349.23, 440, 349.23, 261.63, 311.13, 392, 311.13]
    },
    { // Chapter 3: intense (E minor, fastest)
      tempo: 140,
      bass: [82.41, 0, 82.41, 82.41, 0, 82.41, 0, 97.99, 82.41, 0, 82.41, 82.41, 0, 77.78, 0, 97.99],
      arp:  [329.63, 392, 493.88, 392, 329.63, 392, 493.88, 587.33,
             329.63, 392, 493.88, 392, 311.13, 369.99, 466.16, 369.99]
    },
    { // Chapter 4: somber (C minor, slow, heavy)
      tempo: 90,
      bass: [65.41, 0, 0, 65.41, 0, 0, 65.41, 0, 58.27, 0, 0, 58.27, 0, 0, 61.74, 0],
      arp:  [261.63, 0, 311.13, 0, 392, 0, 311.13, 0, 233.08, 0, 277.18, 0, 349.23, 0, 277.18, 0]
    },
    { // Chapter 5: aggressive (B minor, driving)
      tempo: 150,
      bass: [61.74, 61.74, 0, 61.74, 61.74, 0, 61.74, 0, 55, 55, 0, 55, 55, 0, 61.74, 0],
      arp:  [246.94, 293.66, 369.99, 293.66, 246.94, 293.66, 369.99, 440,
             220, 261.63, 329.63, 261.63, 246.94, 293.66, 369.99, 293.66]
    },
    { // Chapter 6: dark climax (A minor, urgent, dissonant)
      tempo: 160,
      bass: [55, 55, 58.27, 55, 55, 58.27, 61.74, 0, 55, 55, 58.27, 55, 55, 58.27, 65.41, 0],
      arp:  [220, 261.63, 311.13, 349.23, 220, 261.63, 311.13, 392,
             233.08, 277.18, 329.63, 369.99, 220, 261.63, 311.13, 440]
    }
  ];

  startMusic(chapter) {
    if (!this.ensureContext()) return;
    if (!this.musicEnabled) return;
    this.stopMusic();
    this.musicChapter = Math.max(0, Math.min(AudioManager.BGM_PATTERNS.length - 1, chapter | 0));
    this.musicStep = 0;
    this.musicNextTime = this.ctx.currentTime + 0.1;
    // Lookahead scheduler
    this.musicTimer = setInterval(() => this.scheduleMusic(), 100);
  }

  scheduleMusic() {
    if (!this.ctx || !this.musicEnabled) return;
    const pattern = AudioManager.BGM_PATTERNS[this.musicChapter];
    const stepDur = 60 / pattern.tempo / 4; // 16th notes
    while (this.musicNextTime < this.ctx.currentTime + 0.3) {
      const step = this.musicStep % 16;
      const t = this.musicNextTime - this.ctx.currentTime;
      const bass = pattern.bass[step];
      const arp = pattern.arp[step];
      if (bass) this.tone(bass, stepDur * 1.8, { type: 'triangle', vol: 0.5, delay: t, dest: this.musicGain });
      if (arp) this.tone(arp, stepDur * 0.9, { type: 'square', vol: 0.12, delay: t, dest: this.musicGain });
      this.musicNextTime += stepDur;
      this.musicStep++;
    }
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}
