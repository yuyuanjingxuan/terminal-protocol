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
      unlockedLevels: game.unlockedLevels.slice(),
      difficulty: game.difficulty || 'normal',
      endlessBestWave: game.endlessBestWave || 0,
      campaignCompleted: !!game.campaignCompleted,
      seenTowerBar: !!game.seenTowerBar,
      seenTechTree: !!game.seenTechTree
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

    // Phase 7 migration: old saves used legacy keys ('level1'..'level3') that
    // no longer exist in the 36-level structure. Keep only keys that map to a
    // real level, and always guarantee the first level (c1l1) is unlocked.
    const validKeys = (typeof levels !== 'undefined') ? Object.keys(levels) : null;
    if (Array.isArray(data.completedLevels)) {
      game.completedLevels = validKeys
        ? data.completedLevels.filter(k => validKeys.includes(k))
        : data.completedLevels.slice();
    }
    if (Array.isArray(data.unlockedLevels)) {
      game.unlockedLevels = validKeys
        ? data.unlockedLevels.filter(k => validKeys.includes(k))
        : data.unlockedLevels.slice();
    }
    if (validKeys && validKeys.length && !game.unlockedLevels.includes(validKeys[0])) {
      game.unlockedLevels.unshift(validKeys[0]);
    }

    // Phase 8: restore difficulty + endless best wave
    if (data.difficulty && BALANCE.difficulty[data.difficulty]) {
      game.difficulty = data.difficulty;
    }
    if (typeof data.endlessBestWave === 'number' && data.endlessBestWave > 0) {
      game.endlessBestWave = data.endlessBestWave;
    }
    if (data.campaignCompleted) game.campaignCompleted = true;
    if (data.seenTowerBar) game.seenTowerBar = true;
    if (data.seenTechTree) game.seenTechTree = true;
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
