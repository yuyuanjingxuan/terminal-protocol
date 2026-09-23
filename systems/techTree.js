// systems/techTree.js - Permanent meta-progression tech tree (Phase 5)
// Tech points are earned by completing levels. Unlocked nodes persist via SaveSystem.
class TechTree {
  constructor(game) {
    this.game = game;
    this.points = 0;
    this.unlocked = {}; // nodeId -> true

    // Node definitions. Cost is in tech points.
    this.nodes = {
      // Energy branch (laser / plasma / railgun)
      'energy_1': {
        name: 'Overcharged Cells',
        description: 'Energy towers deal +15% damage',
        cost: 1,
        faction: 'energy',
        tier: 1,
        requires: null
      },
      'energy_2': {
        name: 'Extended Range',
        description: 'Energy towers gain +20% range',
        cost: 2,
        faction: 'energy',
        tier: 2,
        requires: 'energy_1'
      },
      'energy_3': {
        name: 'Rapid Cycles',
        description: 'Energy towers fire 20% faster',
        cost: 3,
        faction: 'energy',
        tier: 3,
        requires: 'energy_2'
      },

      // Explosive branch (cannon / missile / bomb)
      'explosive_1': {
        name: 'High Explosives',
        description: 'Explosive towers gain +20% blast radius',
        cost: 1,
        faction: 'explosive',
        tier: 1,
        requires: null
      },
      'explosive_2': {
        name: 'Shrapnel Rounds',
        description: 'Explosive towers deal +15% damage',
        cost: 2,
        faction: 'explosive',
        tier: 2,
        requires: 'explosive_1'
      },
      'explosive_3': {
        name: 'Rapid Reload',
        description: 'Explosive towers fire 20% faster',
        cost: 3,
        faction: 'explosive',
        tier: 3,
        requires: 'explosive_2'
      },

      // Electromagnetic branch (emp / pulse / disruptor)
      'electromagnetic_1': {
        name: 'Enhanced EMP',
        description: 'EMP slow & stun effects last 25% longer',
        cost: 1,
        faction: 'electromagnetic',
        tier: 1,
        requires: null
      },
      'electromagnetic_2': {
        name: 'Wider Pulse',
        description: 'EM towers gain +15% range',
        cost: 2,
        faction: 'electromagnetic',
        tier: 2,
        requires: 'electromagnetic_1'
      },
      'electromagnetic_3': {
        name: 'Chain Reaction',
        description: 'Disruptor chains to 1 additional target',
        cost: 3,
        faction: 'electromagnetic',
        tier: 3,
        requires: 'electromagnetic_2'
      },

      // Support branch (repair + base)
      'support_1': {
        name: 'Efficient Repair',
        description: 'Repair towers heal 50% more',
        cost: 1,
        faction: 'support',
        tier: 1,
        requires: null
      },
      'support_2': {
        name: 'Reinforced Core',
        description: 'Start each level with +3 health',
        cost: 2,
        faction: 'support',
        tier: 2,
        requires: 'support_1'
      },
      'support_3': {
        name: 'Resource Optimization',
        description: 'Start each level with +50 resources',
        cost: 3,
        faction: 'support',
        tier: 3,
        requires: 'support_2'
      },

      // Global branch
      'global_1': {
        name: 'Advanced Training',
        description: 'All towers cost 10% less',
        cost: 2,
        faction: 'global',
        tier: 1,
        requires: null
      },
      'global_2': {
        name: 'Overclocked Systems',
        description: 'All towers fire 10% faster',
        cost: 3,
        faction: 'global',
        tier: 2,
        requires: 'global_1'
      }
    };

    this.factions = [
      { id: 'energy', name: 'Energy', color: '#00f0ff' },
      { id: 'explosive', name: 'Explosive', color: '#ff6600' },
      { id: 'electromagnetic', name: 'Electromagnetic', color: '#9c27b0' },
      { id: 'support', name: 'Support', color: '#4CAF50' },
      { id: 'global', name: 'Global', color: '#ffd700' }
    ];
  }

  isUnlocked(nodeId) {
    return !!this.unlocked[nodeId];
  }

  canUnlock(nodeId) {
    const node = this.nodes[nodeId];
    if (!node || this.unlocked[nodeId]) return false;
    if (node.requires && !this.unlocked[node.requires]) return false;
    return this.points >= node.cost;
  }

  unlockNode(nodeId) {
    if (!this.canUnlock(nodeId)) return false;
    this.points -= this.nodes[nodeId].cost;
    this.unlocked[nodeId] = true;
    return true;
  }

  addPoints(n) {
    this.points += n;
  }

  // --- Modifiers applied to newly built towers ---

  getTowerModifiers(tower) {
    const m = {
      damage: 1, range: 1, cooldown: 1,
      explosionRadius: 1, slowDuration: 1, stunDuration: 1,
      chainTargets: 0, repairAmount: 1
    };
    const f = tower.faction;

    if (f === 'energy') {
      if (this.unlocked['energy_1']) m.damage *= 1.15;
      if (this.unlocked['energy_2']) m.range *= 1.2;
      if (this.unlocked['energy_3']) m.cooldown *= 0.8;
    } else if (f === 'explosive') {
      if (this.unlocked['explosive_1']) m.explosionRadius *= 1.2;
      if (this.unlocked['explosive_2']) m.damage *= 1.15;
      if (this.unlocked['explosive_3']) m.cooldown *= 0.8;
    } else if (f === 'electromagnetic') {
      if (this.unlocked['electromagnetic_1']) { m.slowDuration *= 1.25; m.stunDuration *= 1.25; }
      if (this.unlocked['electromagnetic_2']) m.range *= 1.15;
      if (this.unlocked['electromagnetic_3'] && tower.type === 'disruptor') m.chainTargets += 1;
    } else if (f === 'support') {
      if (this.unlocked['support_1'] && tower.type === 'repair') m.repairAmount *= 1.5;
    }

    // Global: overclocked systems (all towers fire 10% faster)
    if (this.unlocked['global_2']) m.cooldown *= 0.9;

    return m;
  }

  applyToTower(tower) {
    const m = this.getTowerModifiers(tower);
    tower.damage *= m.damage;
    tower.range *= m.range;
    tower.cooldown *= m.cooldown;
    if (tower.explosionRadius) tower.explosionRadius *= m.explosionRadius;
    if (tower.slowDuration) tower.slowDuration *= m.slowDuration;
    if (tower.stunDuration) tower.stunDuration *= m.stunDuration;
    if (tower.chainTargets) tower.chainTargets += m.chainTargets;
    if (tower.repairAmount) tower.repairAmount *= m.repairAmount;
    // Global: advanced training (all towers cost 10% less)
    if (this.unlocked['global_1']) tower.cost = Math.round(tower.cost * 0.9);
  }

  // --- Global modifiers for level setup ---

  getStartingResources() {
    return 150 + (this.unlocked['support_3'] ? 50 : 0);
  }

  getStartingHealth() {
    return 10 + (this.unlocked['support_2'] ? 3 : 0);
  }

  // --- Persistence ---

  serialize() {
    return {
      points: this.points,
      unlocked: Object.keys(this.unlocked)
    };
  }

  deserialize(data) {
    if (!data) return;
    this.points = data.points || 0;
    this.unlocked = {};
    (data.unlocked || []).forEach(id => {
      if (this.nodes[id]) this.unlocked[id] = true;
    });
  }

  reset() {
    this.points = 0;
    this.unlocked = {};
  }
}
