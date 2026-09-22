// audio/audioManager.js - Audio management system
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.init();
  }

  init() {
    // Create audio context
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Initialize sounds
    this.initSounds();
  }

  initSounds() {
    // Placeholder for sound initialization
    // In a real implementation, this would set up various sound effects
  }

  playSound(name) {
    if (this.sounds[name]) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name];
      source.connect(this.audioContext.destination);
      source.start(0);
    }
  }

  playTowerBuilt() {
    // Simple beep sound for tower built
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playEnemyDie() {
    // Simple sound for enemy death
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 300;
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }
}