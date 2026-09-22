// core/input.js - Input handling
class InputHandler {
  constructor(game) {
    this.game = game;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseDown = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Mouse events
    this.game.canvas.addEventListener('mousemove', (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.game.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.handleMouseDown(e);
    });

    this.game.canvas.addEventListener('mouseup', (e) => {
      this.isMouseDown = false;
    });

    this.game.canvas.addEventListener('mouseleave', () => {
      this.isMouseDown = false;
    });
  }

  handleMouseDown(e) {
    // Check if clicking on a tower placement spot
    const gridSize = 40;
    const towerX = Math.floor(this.mouseX / gridSize) * gridSize + gridSize / 2;
    const towerY = Math.floor(this.mouseY / gridSize) * gridSize + gridSize / 2;

    // Check if this position is valid for tower placement
    if (this.isValidTowerPosition(towerX, towerY)) {
      // Create a basic tower for now
      const tower = new BasicTower(this.game, towerX, towerY);
      if (this.game.spendResources(tower.cost)) {
        this.game.addTower(tower);
      }
    }
  }

  isValidTowerPosition(x, y) {
    // Simple validation - not on the path for now
    // In a real implementation, this would check against the level's path
    return true;
  }
}