// systems/saveSystem.js - localStorage persistence + export/import (Phase 5)
class SaveSystem {
  constructor() {
    this.key = 'terminalProtocolSave_v1';
  }

  // Build a save object from the game's meta state
  buildSave(game) {
    return {
      version: 1,
      savedAt: Date.now(),
      tech: game.techTree.serialize(),
      completedLevels: game.completedLevels.slice(),
      unlockedLevels: game.unlockedLevels.slice()
    };
  }

  save(game) {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.buildSave(game)));
      return true;
    } catch (e) {
      console.warn('Save failed:', e);
      return false;
    }
  }

  load(game) {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return false;
      return this.applySave(JSON.parse(raw), game);
    } catch (e) {
      console.warn('Load failed:', e);
      return false;
    }
  }

  applySave(data, game) {
    if (!data || data.version !== 1) return false;
    if (data.tech) game.techTree.deserialize(data.tech);
    if (Array.isArray(data.completedLevels)) game.completedLevels = data.completedLevels.slice();
    if (Array.isArray(data.unlockedLevels)) game.unlockedLevels = data.unlockedLevels.slice();
    return true;
  }

  clear() {
    try {
      localStorage.removeItem(this.key);
    } catch (e) { /* ignore */ }
  }

  // --- Export / Import (shareable text) ---

  exportSave(game) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(this.buildSave(game)))));
  }

  importSave(text, game) {
    try {
      const json = decodeURIComponent(escape(atob(text.trim())));
      return this.applySave(JSON.parse(json), game);
    } catch (e) {
      console.warn('Import failed:', e);
      return false;
    }
  }
}
