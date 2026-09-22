// main.js - Main entry point
class TerminalProtocol {
  constructor() {
    this.game = null;
    this.inputHandler = null;
    this.audioManager = null;
    this.renderer = null;
  }

  init() {
    // Initialize game
    this.game = new Game();
    this.game.init('gameCanvas');

    // Initialize input handler
    this.inputHandler = new InputHandler(this.game);

    // Initialize audio manager
    this.audioManager = new AudioManager();

    // Initialize renderer
    this.renderer = new Renderer(this.game);

    // Load level
    this.loadLevel('level1');

    // Start game loop
    console.log('Terminal Protocol initialized');
  }

  loadLevel(levelName) {
    // Load level data
    const levelData = levels[levelName];
    if (!levelData) {
      console.error(`Level ${levelName} not found`);
      return;
    }

    // Set current level
    this.game.currentLevel = {
      name: levelData.name,
      path: levelData.path
    };

    // Setup wave manager
    const waveManager = this.game.waveManager;
    waveManager.reset();

    // Add waves
    levelData.waves.forEach(wave => {
      const waveEnemies = wave.map(enemyData => ({
        path: levelData.path
      }));
      waveManager.addWave(waveEnemies);
    });

    // Start first wave
    waveManager.startNextWave();
  }
}

// Initialize game when page loads
window.addEventListener('load', () => {
  const game = new TerminalProtocol();
  game.init();
});