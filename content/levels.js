// content/levels.js - Level definitions
const levels = {
  level1: {
    name: "第 1 关",
    description: "Basic level to test core mechanics",
    path: [
      { x: 50, y: 120 },
      { x: 650, y: 120 },
      { x: 650, y: 300 },
      { x: 150, y: 300 },
      { x: 150, y: 480 },
      { x: 750, y: 480 }
    ],
    waves: [
      // Wave 1: gentle intro
      [
        { type: 'basic' },
        { type: 'basic' },
        { type: 'basic' },
        { type: 'basic' }
      ],
      // Wave 2: more basics
      [
        { type: 'basic' },
        { type: 'basic' },
        { type: 'basic' },
        { type: 'basic' },
        { type: 'basic' },
        { type: 'basic' }
      ],
      // Wave 3: fast enemies appear
      [
        { type: 'fast' },
        { type: 'basic' },
        { type: 'fast' },
        { type: 'basic' },
        { type: 'fast' },
        { type: 'basic' }
      ],
      // Wave 4: armored tanks
      [
        { type: 'armored' },
        { type: 'basic' },
        { type: 'basic' },
        { type: 'armored' },
        { type: 'basic' },
        { type: 'basic' }
      ],
      // Wave 5: mixed pressure
      [
        { type: 'fast' },
        { type: 'armored' },
        { type: 'fast' },
        { type: 'basic' },
        { type: 'armored' },
        { type: 'fast' },
        { type: 'basic' }
      ]
    ]
  },

  level2: {
    name: "第 2 关",
    description: "Special enemy types: fast, armored, healer, stealth, splitter",
    path: [
      { x: 50, y: 80 },
      { x: 750, y: 80 },
      { x: 750, y: 220 },
      { x: 50, y: 220 },
      { x: 50, y: 380 },
      { x: 750, y: 380 },
      { x: 750, y: 520 },
      { x: 400, y: 520 }
    ],
    waves: [
      // Wave 1: fast enemies
      [
        { type: 'fast' },
        { type: 'fast' },
        { type: 'fast' },
        { type: 'fast' }
      ],
      // Wave 2: armored
      [
        { type: 'armored' },
        { type: 'armored' },
        { type: 'basic' },
        { type: 'basic' }
      ],
      // Wave 3: healers with basic escorts
      [
        { type: 'healer' },
        { type: 'basic' },
        { type: 'basic' },
        { type: 'basic' },
        { type: 'healer' }
      ],
      // Wave 4: stealth (needs EM towers to reveal)
      [
        { type: 'stealth' },
        { type: 'stealth' },
        { type: 'stealth' },
        { type: 'basic' },
        { type: 'basic' }
      ],
      // Wave 5: splitters
      [
        { type: 'splitter' },
        { type: 'splitter' },
        { type: 'fast' },
        { type: 'fast' }
      ],
      // Wave 6: mixed
      [
        { type: 'armored' },
        { type: 'fast' },
        { type: 'fast' },
        { type: 'stealth' },
        { type: 'splitter' },
        { type: 'healer' }
      ]
    ]
  },

  level3: {
    name: "第 3 关",
    description: "Boss fight: the Core Process",
    path: [
      { x: 50, y: 300 },
      { x: 250, y: 300 },
      { x: 250, y: 100 },
      { x: 550, y: 100 },
      { x: 550, y: 500 },
      { x: 750, y: 500 }
    ],
    waves: [
      // Warm-up waves to build up defenses
      [
        { type: 'basic' },
        { type: 'basic' },
        { type: 'fast' },
        { type: 'fast' }
      ],
      [
        { type: 'armored' },
        { type: 'armored' },
        { type: 'healer' },
        { type: 'basic' },
        { type: 'basic' }
      ],
      // The boss
      [
        { type: 'boss' }
      ]
    ]
  }
};

// Export levels object
if (typeof module !== 'undefined' && module.exports) {
  module.exports = levels;
}