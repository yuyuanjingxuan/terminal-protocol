// systems/techTree.js - Technology tree system
class TechTree {
  constructor(game) {
    this.game = game;
    this.nodes = {
      // Energy faction tech tree
      'energy_1': {
        name: 'Advanced Targeting',
        description: 'Energy towers gain +10% damage',
        cost: 50,
        unlocked: false,
        faction: 'energy',
        effect: (tower) => {
          if (tower instanceof LaserTower || tower instanceof PlasmaTower || tower instanceof RailgunTower) {
            tower.damage *= 1.1;
          }
        }
      },
      'energy_2': {
        name: 'Overcharge Capacitors',
        description: 'Energy towers gain +15% attack speed',
        cost: 100,
        unlocked: false,
        faction: 'energy',
        effect: (tower) => {
          if (tower instanceof LaserTower || tower instanceof PlasmaTower || tower instanceof RailgunTower) {
            tower.cooldown *= 0.85;
          }
        }
      },
      'energy_3': {
        name: 'Extended Range',
        description: 'Energy towers gain +20% range',
        cost: 150,
        unlocked: false,
        faction: 'energy',
        effect: (tower) => {
          if (tower instanceof LaserTower || tower instanceof PlasmaTower || tower instanceof RailgunTower) {
            tower.range *= 1.2;
          }
        }
      },
      
      // Explosive faction tech tree
      'explosive_1': {
        name: 'High Explosives',
        description: 'Explosive towers gain +15% explosion radius',
        cost: 50,
        unlocked: false,
        faction: 'explosive',
        effect: (tower) => {
          if (tower instanceof CannonTower || tower instanceof MissileTower || tower instanceof BombTower) {
            tower.explosionRadius *= 1.15;
          }
        }
      },
      'explosive_2': {
        name: 'Shrapnel Rounds',
        description: 'Explosive towers gain +10% damage',
        cost: 100,
        unlocked: false,
        faction: 'explosive',
        effect: (tower) => {
          if (tower instanceof CannonTower || tower instanceof MissileTower || tower instanceof BombTower) {
            tower.damage *= 1.1;
          }
        }
      },
      'explosive_3': {
        name: 'Rapid Reload',
        description: 'Explosive towers gain +20% attack speed',
        cost: 150,
        unlocked: false,
        faction: 'explosive',
        effect: (tower) => {
          if (tower instanceof CannonTower || tower instanceof MissileTower || tower instanceof BombTower) {
            tower.cooldown *= 0.8;
          }
        }
      },
      
      // Electromagnetic faction tech tree
      'electromagnetic_1': {
        name: 'Enhanced EMP',
        description: 'EMP effects last 20% longer',
        cost: 50,
        unlocked: false,
        faction: 'electromagnetic',
        effect: (tower) => {
          if (tower instanceof EMPTower || tower instanceof PulseTower || tower instanceof DisruptorTower) {
            if (tower.slowDuration) tower.slowDuration *= 1.2;
            if (tower.stunDuration) tower.stunDuration *= 1.2;
          }
        }
      },
      'electromagnetic_2': {
        name: 'Wider Pulse',
        description: 'Pulse and chain effects reach 15% further',
        cost: 100,
        unlocked: false,
        faction: 'electromagnetic',
        effect: (tower) => {
          if (tower instanceof EMPTower || tower instanceof PulseTower || tower instanceof DisruptorTower) {
            if (tower.pulseRadius) tower.pulseRadius *= 1.15;
            if (tower.range) tower.range *= 1.15;
          }
        }
      },
      'electromagnetic_3': {
        name: 'Chain Reaction',
        description: 'Chain lightning can jump to 1 additional target',
        cost: 150,
        unlocked: false,
        faction: 'electromagnetic',
        effect: (tower) => {
          if (tower instanceof DisruptorTower) {
            tower.chainTargets += 1;
          }
        }
      },
      
      // Support faction tech tree
      'support_1': {
        name: 'Efficient Repair',
        description: 'Repair towers heal 20% more health',
        cost: 50,
        unlocked: false,
        faction: 'support',
        effect: (tower) => {
          if (tower instanceof RepairTower) {
            tower.repairAmount *= 1.2;
          }
        }
      },
      'support_2': {
        name: 'Resource Optimization',
        description: 'Resource towers generate 25% more resources',
        cost: 100,
        unlocked: false,
        faction: 'support',
        effect: (tower) => {
          if (tower instanceof ResourceTower) {
            tower.resourceAmount *= 1.25;
          }
        }
      },
      'support_3': {
        name: 'Boost Amplification',
        description: 'Boost effects are 30% stronger',
        cost: 150,
        unlocked: false,
        faction: 'support',
        effect: (tower) => {
          if (tower instanceof BoostTower) {
            tower.boostAmount *= 1.3;
          }
        }
      },
      
      // Global upgrades
      'global_1': {
        name: 'Advanced Training',
        description: 'All towers cost 10% less to build',
        cost: 200,
        unlocked: false,
        faction: 'global',
        effect: (tower) => {
          // This would be applied when building towers
        }
      },
      'global_2': {
        name: 'Reinforced Structures',
        description: 'All towers gain +10% health (when implemented)',
        cost: 200,
        unlocked: false,
        faction: 'global',
        effect: (tower) => {
          // This would be applied when building towers
        }
      }
    };

    this.dependencies = {
      'energy_2': ['energy_1'],
      'energy_3': ['energy_2'],
      'explosive_2': ['explosive_1'],
      'explosive_3': ['explosive_2'],
      'electromagnetic_2': ['electromagnetic_1'],
      'electromagnetic_3': ['electromagnetic_2'],
      'support_2': ['support_1'],
      'support_3': ['support_2']
    };
  }

  unlockNode(nodeId) {
    const node = this.nodes[nodeId];
    
    if (!node) return false;
    
    // Check if node is already unlocked
    if (node.unlocked) return true;
    
    // Check dependencies
    if (this.dependencies[nodeId]) {
      for (const depId of this.dependencies[nodeId]) {
        if (!this.nodes[depId] || !this.nodes[depId].unlocked) {
          console.log(`Dependency ${depId} not unlocked`);
          return false;
        }
      }
    }
    
    // Check if player can afford it
    if (!this.game.spendResources(node.cost)) {
      return false;
    }
    
    // Unlock the node
    node.unlocked = true;
    
    // Apply effect to existing towers
    this.game.towers.forEach(tower => {
      node.effect(tower);
    });
    
    return true;
  }

  isNodeUnlocked(nodeId) {
    const node = this.nodes[nodeId];
    return node ? node.unlocked : false;
  }

  canUnlockNode(nodeId) {
    const node = this.nodes[nodeId];
    
    if (!node || node.unlocked) return false;
    
    // Check dependencies
    if (this.dependencies[nodeId]) {
      for (const depId of this.dependencies[nodeId]) {
        if (!this.nodes[depId] || !this.nodes[depId].unlocked) {
          return false;
        }
      }
    }
    
    // Check if player can afford it
    return this.game.resources >= node.cost;
  }

  getNodeInfo(nodeId) {
    return this.nodes[nodeId];
  }

  getAllNodes() {
    return this.nodes;
  }

  getNodesByFaction(faction) {
    return Object.fromEntries(
      Object.entries(this.nodes).filter(([id, node]) => node.faction === faction)
    );
  }

  reset() {
    Object.values(this.nodes).forEach(node => {
      node.unlocked = false;
    });
  }
}