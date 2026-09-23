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

    // Tower selection buttons (click again to deselect)
    document.querySelectorAll('.tower-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.game.selectedTowerType = (this.game.selectedTowerType === type) ? null : type;
        this.inputHandler.updateTowerButtons();
      });
    });

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

    // Add waves (path is resolved at spawn time)
    levelData.waves.forEach(wave => {
      const waveEnemies = wave.map(enemyData => ({
        type: enemyData.type,
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