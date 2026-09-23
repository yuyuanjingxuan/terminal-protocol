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

    if (this.isValidTowerPosition(towerX, towerY)) {
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

  isValidTowerPosition(x, y) {
    // Check bounds
    if (x < 20 || x > this.game.canvas.width - 20 || y < 20 || y > this.game.canvas.height - 20) {
      return false;
    }

    // Check not on path
    const path = this.game.currentLevel?.path;
    if (path) {
      for (let i = 0; i < path.length - 1; i++) {
        if (this.distanceToSegment(x, y, path[i], path[i + 1]) < 35) {
          return false;
        }
      }
    }

    // Check not overlapping existing towers
    for (const tower of this.game.towers) {
      const dist = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
      if (dist < 30) return false;
    }

    return true;
  }

  distanceToSegment(px, py, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt(Math.pow(px - a.x, 2) + Math.pow(py - a.y, 2));
    let t = ((px - a.x) * dx + (py - a.y) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const closestX = a.x + t * dx;
    const closestY = a.y + t * dy;
    return Math.sqrt(Math.pow(px - closestX, 2) + Math.pow(py - closestY, 2));
  }
}