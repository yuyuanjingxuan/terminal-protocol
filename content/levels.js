// content/levels.js - Level definitions
const levels = {
  level1: {
    name: "Level 1",
    description: "Basic level to test core mechanics",
    path: [
      { x: 50, y: 200 },
      { x: 350, y: 200 },
      { x: 350, y: 400 },
      { x: 600, y: 400 }
    ],
    waves: [
      [
        { type: 'basic', path: this.path },
        { type: 'basic', path: this.path },
        { type: 'basic', path: this.path }
      ],
      [
        { type: 'basic', path: this.path },
        { type: 'basic', path: this.path }
      ]
    ]
  }
};

// Export levels object
if (typeof module !== 'undefined' && module.exports) {
  module.exports = levels;
}