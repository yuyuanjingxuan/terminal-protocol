// systems/upgradeSystem.js - Tower upgrade system
class UpgradeSystem {
  constructor(game) {
    this.game = game;
    this.upgrades = {
      // Energy faction upgrades
      'laser': [
        { cost: 40, damage: 5, cooldown: -0.1, range: 10 },
        { cost: 80, damage: 10, cooldown: -0.2, range: 20 },
        { cost: 120, damage: 15, cooldown: -0.3, range: 30 }
      ],
      'plasma': [
        { cost: 50, damage: 8, cooldown: -0.2, range: 15 },
        { cost: 100, damage: 15, cooldown: -0.3, range: 25 },
        { cost: 150, damage: 22, cooldown: -0.4, range: 35 }
      ],
      'railgun': [
        { cost: 75, damage: 10, cooldown: -0.3, range: 25 },
        { cost: 150, damage: 20, cooldown: -0.5, range: 35 },
        { cost: 225, damage: 30, cooldown: -0.7, range: 45 }
      ],
      
      // Explosive faction upgrades
      'cannon': [
        { cost: 45, damage: 4, cooldown: -0.2, explosionRadius: 5 },
        { cost: 90, damage: 8, cooldown: -0.3, explosionRadius: 10 },
        { cost: 135, damage: 12, cooldown: -0.4, explosionRadius: 15 }
      ],
      'missile': [
        { cost: 38, damage: 4, cooldown: -0.1, explosionRadius: 5 },
        { cost: 76, damage: 8, cooldown: -0.2, explosionRadius: 8 },
        { cost: 114, damage: 12, cooldown: -0.3, explosionRadius: 12 }
      ],
      'bomb': [
        { cost: 55, damage: 5, cooldown: -0.3, explosionRadius: 8 },
        { cost: 110, damage: 10, cooldown: -0.4, explosionRadius: 12 },
        { cost: 165, damage: 15, cooldown: -0.5, explosionRadius: 18 }
      ],
      
      // Electromagnetic faction upgrades
      'emp': [
        { cost: 35, damage: 1, slowAmount: 0.1, slowDuration: 0.5 },
        { cost: 70, damage: 2, slowAmount: 0.2, slowDuration: 1.0 },
        { cost: 105, damage: 3, slowAmount: 0.3, slowDuration: 1.5 }
      ],
      'pulse': [
        { cost: 45, stunDuration: 0.3, pulseRadius: 15 },
        { cost: 90, stunDuration: 0.6, pulseRadius: 25 },
        { cost: 135, stunDuration: 1.0, pulseRadius: 35 }
      ],
      'disruptor': [
        { cost: 43, chainDamage: 0.1, chainTargets: 1 },
        { cost: 86, chainDamage: 0.15, chainTargets: 2 },
        { cost: 129, chainDamage: 0.2, chainTargets: 3 }
      ],
      
      // Support faction upgrades
      'repair': [
        { cost: 30, repairAmount: 2, repairDuration: 1.0 },
        { cost: 60, repairAmount: 4, repairDuration: 2.0 },
        { cost: 90, repairAmount: 6, repairDuration: 3.0 }
      ],
      'boost': [
        { cost: 38, boostAmount: 0.1, boostDuration: 2.0 },
        { cost: 76, boostAmount: 0.2, boostDuration: 3.0 },
        { cost: 114, boostAmount: 0.3, boostDuration: 4.0 }
      ],
      'resource': [
        { cost: 60, resourceAmount: 10, cooldown: -1.0 },
        { cost: 120, resourceAmount: 20, cooldown: -2.0 },
        { cost: 180, resourceAmount: 30, cooldown: -3.0 }
      ]
    };
  }

  upgradeTower(tower, upgradeLevel) {
    const towerType = this.getTowerType(tower);
    
    if (!towerType || !this.upgrades[towerType] || !this.upgrades[towerType][upgradeLevel]) {
      return false;
    }

    const upgrade = this.upgrades[towerType][upgradeLevel];
    
    // Check if player can afford the upgrade
    if (!this.game.spendResources(upgrade.cost)) {
      return false;
    }

    // Apply upgrade
    if (upgrade.damage) tower.damage += upgrade.damage;
    if (upgrade.cooldown) tower.cooldown += upgrade.cooldown;
    if (upgrade.range) tower.range += upgrade.range;
    if (upgrade.explosionRadius) tower.explosionRadius += upgrade.explosionRadius;
    if (upgrade.slowAmount) tower.slowAmount += upgrade.slowAmount;
    if (upgrade.slowDuration) tower.slowDuration += upgrade.slowDuration;
    if (upgrade.stunDuration) tower.stunDuration += upgrade.stunDuration;
    if (upgrade.pulseRadius) tower.pulseRadius += upgrade.pulseRadius;
    if (upgrade.chainDamage) tower.chainDamage += upgrade.chainDamage;
    if (upgrade.chainTargets) tower.chainTargets += upgrade.chainTargets;
    if (upgrade.repairAmount) tower.repairAmount += upgrade.repairAmount;
    if (upgrade.repairDuration) tower.repairDuration += upgrade.repairDuration;
    if (upgrade.boostAmount) tower.boostAmount += upgrade.boostAmount;
    if (upgrade.boostDuration) tower.boostDuration += upgrade.boostDuration;
    if (upgrade.resourceAmount) tower.resourceAmount += upgrade.resourceAmount;

    return true;
  }

  getTowerType(tower) {
    if (tower instanceof LaserTower) return 'laser';
    if (tower instanceof PlasmaTower) return 'plasma';
    if (tower instanceof RailgunTower) return 'railgun';
    if (tower instanceof CannonTower) return 'cannon';
    if (tower instanceof MissileTower) return 'missile';
    if (tower instanceof BombTower) return 'bomb';
    if (tower instanceof EMPTower) return 'emp';
    if (tower instanceof PulseTower) return 'pulse';
    if (tower instanceof DisruptorTower) return 'disruptor';
    if (tower instanceof RepairTower) return 'repair';
    if (tower instanceof BoostTower) return 'boost';
    if (tower instanceof ResourceTower) return 'resource';
    
    return null;
  }

  getUpgradeInfo(towerType, upgradeLevel) {
    if (!this.upgrades[towerType] || !this.upgrades[towerType][upgradeLevel]) {
      return null;
    }
    
    return this.upgrades[towerType][upgradeLevel];
  }

  getMaxUpgradeLevel(towerType) {
    if (!this.upgrades[towerType]) {
      return 0;
    }
    
    return this.upgrades[towerType].length;
  }
}