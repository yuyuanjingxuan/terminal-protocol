// content/levels.js - Level definitions
const levels = {
  level1: {
    name: "Level 1",
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
      [
        { type: 'basic' },
        { type: 'basic' },
        { type: 'basic' }
      ],
      [
        { type: 'basic' },
        { type: 'basic' }
      ]
    ]
  }
};

// Export levels object
if (typeof module !== 'undefined' && module.exports) {
  module.exports = levels;
}