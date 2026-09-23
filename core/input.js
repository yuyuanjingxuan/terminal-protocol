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
    // Mouse events (scale-aware: canvas may be CSS-scaled to fit window)
    this.game.canvas.addEventListener('mousemove', (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const scaleX = this.game.canvas.width / rect.width;
      const scaleY = this.game.canvas.height / rect.height;
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
      this.game.mouseX = this.mouseX;
      this.game.mouseY = this.mouseY;
      this.game.mouseOnCanvas = true;
    });

    this.game.canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Left click only
      this.isMouseDown = true;
      this.handleMouseDown(e);
    });

    this.game.canvas.addEventListener('mouseup', (e) => {
      this.isMouseDown = false;
    });

    this.game.canvas.addEventListener('mouseleave', () => {
      this.isMouseDown = false;
      this.game.mouseOnCanvas = false;
    });

    // Right-click cancels tower selection
    this.game.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.game.selectedTowerType = null;
      this.updateTowerButtons();
    });

    // Keyboard tower selection
    document.addEventListener('keydown', (e) => {
      const keyMap = {
        '1': 'laser', '2': 'plasma', '3': 'railgun',
        '4': 'cannon', '5': 'missile', '6': 'bomb',
        '7': 'emp', '8': 'pulse', '9': 'disruptor', '0': 'repair'
      };
      if (keyMap[e.key]) {
        this.game.selectedTowerType = keyMap[e.key];
        this.updateTowerButtons();
      }
      // Escape deselects
      if (e.key === 'Escape') {
        this.game.selectedTowerType = null;
        this.updateTowerButtons();
      }
    });
  }

  updateTowerButtons() {
    document.querySelectorAll('.tower-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.type === this.game.selectedTowerType);
    });
  }

  handleMouseDown(e) {
    const gridSize = 40;
    const towerX = Math.floor(this.mouseX / gridSize) * gridSize + gridSize / 2;
    const towerY = Math.floor(this.mouseY / gridSize) * gridSize + gridSize / 2;

    if (this.game.isValidTowerPosition(towerX, towerY)) {
      const tower = this.createSelectedTower(towerX, towerY);
      if (tower && this.game.spendResources(tower.cost)) {
        this.game.addTower(tower);
      }
    }
  }

  createSelectedTower(x, y) {
    const type = this.game.selectedTowerType;
    const info = TOWER_TYPES[type];
    if (!info) return null;
    return new info.class(this.game, x, y);
  }
}