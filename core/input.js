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
      if (this.game.audio) this.game.audio.unlock(); // unlock audio on user gesture
      this.handleMouseDown(e);
    });

    this.game.canvas.addEventListener('mouseup', (e) => {
      this.isMouseDown = false;
    });

    this.game.canvas.addEventListener('mouseleave', () => {
      this.isMouseDown = false;
      this.game.mouseOnCanvas = false;
    });

    // Right-click: sell the tower under the cursor (50% refund),
    // otherwise cancel tower selection
    this.game.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const rect = this.game.canvas.getBoundingClientRect();
      const scaleX = this.game.canvas.width / rect.width;
      const scaleY = this.game.canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      const gridSize = 40;
      const gx = Math.floor(mx / gridSize) * gridSize + gridSize / 2;
      const gy = Math.floor(my / gridSize) * gridSize + gridSize / 2;
      const tower = this.game.towers.find(t => Math.hypot(t.x - gx, t.y - gy) < 20);
      if (tower) {
        const refund = Math.floor(tower.cost * 0.5);
        this.game.towers = this.game.towers.filter(t => t !== tower);
        this.game.gainResources(refund);
        if (this.game.effects) this.game.effects.burst(tower.x, tower.y, tower.color, 12);
        if (this.game.audio) this.game.audio.playTowerBuilt();
        this.showToast(I18N.t('soldMsg', { name: I18N.towerName(tower.type), n: refund }));
        return;
      }
      this.game.selectedTowerType = null;
      this.updateTowerButtons();
    });

    // Keyboard tower selection
    document.addEventListener('keydown', (e) => {
      if (this.game.audio) this.game.audio.unlock(); // unlock audio on user gesture
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
      // Keep the displayed cost in sync with BALANCE (single source of truth)
      const costEl = btn.querySelector('.cost');
      const s = BALANCE.towers[btn.dataset.type];
      if (costEl && s) costEl.textContent = s.cost;
    });
  }

  // Brief on-screen message (e.g. sell refund)
  showToast(text) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  handleMouseDown(e) {
    const gridSize = 40;
    const towerX = Math.floor(this.mouseX / gridSize) * gridSize + gridSize / 2;
    const towerY = Math.floor(this.mouseY / gridSize) * gridSize + gridSize / 2;

    if (this.game.isValidTowerPosition(towerX, towerY)) {
      const tower = this.createSelectedTower(towerX, towerY);
      if (tower && this.game.spendResources(tower.cost)) {
        this.game.addTower(tower);
        // Build effect + sound (Phase 6)
        if (this.game.effects) this.game.effects.towerBuilt(towerX, towerY, tower.color);
        if (this.game.audio) this.game.audio.playTowerBuilt();
      } else if (tower && this.game.audio) {
        this.game.audio.playError(); // not enough resources
      }
    } else if (this.game.selectedTowerType && this.game.audio) {
      this.game.audio.playError(); // invalid position
    }
  }

  createSelectedTower(x, y) {
    const type = this.game.selectedTowerType;
    const info = TOWER_TYPES[type];
    if (!info) return null;
    const tower = new info.class(this.game, x, y);
    // Apply permanent tech tree modifiers (Phase 5)
    this.game.techTree.applyToTower(tower);
    return tower;
  }
}