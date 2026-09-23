// content/balance.js - Central balance / economy tuning file
// All tunable numbers live here so balance can be adjusted in one place.
// Loaded BEFORE entities/tower.js and entities/enemy.js (see index.html).
const BALANCE = {
  // --- Player starting state (per level) ---
  startingResources: 150,
  startingHealth: 10,

  // --- Tech tree starting bonuses (support branch) ---
  techBonusResources: 50, // support_3: +resources per level
  techBonusHealth: 3,      // support_2: +health per level

  // --- Wave pacing ---
  spawnInterval: 0.8, // seconds between enemy spawns within a wave
  waveInterval: 5,    // seconds between waves (auto countdown)

  // --- Towers: cost + combat stats ---
  towers: {
    laser:     { cost: 50,  damage: 25, cooldown: 1.2, range: 150 },
    plasma:    { cost: 75,  damage: 35, cooldown: 1.8, range: 120 },
    railgun:   { cost: 120, damage: 50, cooldown: 3.0, range: 200 },
    cannon:    { cost: 60,  damage: 20, cooldown: 2.0, range: 100, explosionRadius: 40 },
    missile:   { cost: 55,  damage: 18, cooldown: 1.5, range: 130, explosionRadius: 35 },
    bomb:      { cost: 90,  damage: 22, cooldown: 2.5, range: 90,  explosionRadius: 50 },
    emp:       { cost: 45,  damage: 5,  cooldown: 0.5, range: 140, slowAmount: 0.5, slowDuration: 2.0 },
    pulse:     { cost: 70,  damage: 0,  cooldown: 3.0, range: 180, pulseRadius: 100, stunDuration: 1.5 },
    disruptor: { cost: 65,  damage: 8,  cooldown: 1.0, range: 160, chainTargets: 3, chainDamage: 0.6 },
    repair:    { cost: 50,  damage: 0,  cooldown: 2.0, range: 0,   repairAmount: 5 }
  },

  // --- Enemies: stats + kill rewards ---
  enemies: {
    basic:    { speed: 60,  hp: 25,  reward: 10,  size: 12, damageToBase: 1 },
    fast:     { speed: 110, hp: 14,  reward: 9,   size: 9,  damageToBase: 1 },
    armored:  { speed: 40,  hp: 40,  shield: 30, reward: 16, size: 14, damageToBase: 1 },
    healer:   { speed: 50,  hp: 30,  reward: 14,  size: 11, damageToBase: 1, healRate: 4, healRadius: 90 },
    stealth:  { speed: 70,  hp: 22,  reward: 14,  size: 10, damageToBase: 1 },
    splitter: { speed: 55,  hp: 45,  reward: 18,  size: 15, damageToBase: 1, splitCount: 3, splitType: 'basic' },
    boss:     { speed: 25,  hp: 800, reward: 200, size: 26, damageToBase: 5,
                summonInterval: 8, summonTimer: 4, summonType: 'basic', summonCount: 2 }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BALANCE;
}
