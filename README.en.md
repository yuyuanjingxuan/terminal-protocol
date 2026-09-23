# Terminal Protocol 终端协议

[中文版 →](./README.md)

[![CI](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml/badge.svg)](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml)
[![Status](https://img.shields.io/badge/status-in%20development-blue)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![Language](https://img.shields.io/badge/language-Vanilla%20JS%20%2B%20Canvas-blue)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![License](https://img.shields.io/badge/license-Custom%20Non--Commercial-lightgrey)](./LICENSE)

A sci-fi tower defense game: a rogue AI is invading virtual cyberspace, and the player deploys defense protocols to intercept its processes and hold the terminal.

## Features

- 10 tower types across four schools: energy, explosive, electromagnetic, and support (Laser, Plasma, Railgun, Cannon, Missile, Bomb, EMP, Stun Pulse, Disruptor, Repair)
- 7 enemy types: basic, fast, armored, healer, stealth, splitter, and the boss "Core Process" that summons minions
- A permanent out-of-run tech tree: 5 factions, 14 nodes, progression that carries across levels
- Save system: progress is saved automatically, with export/import save codes
- Bilingual Chinese/English UI, switchable from the main menu
- All sound effects and music synthesized live with Web Audio — no external assets
- Runs as a single HTML file, zero dependencies, fully offline

## Running the game

```bash
node scripts/build.js
```

The build script inlines every JS source file referenced by `index.html` and produces `terminal-protocol.html` at the repository root. Open it in a browser to play — no install and no network connection required.

## Controls

| Action | Key / Button |
| --- | --- |
| Select tower | Number keys `1`–`0` or the tower buttons at the bottom |
| Place tower | Left-click a grid cell |
| Deselect | Right-click / `Esc` |
| Start wave / call next wave early | "Ready / Next Wave" button |
| Game speed | `1x` / `2x` / `3x` |
| Sound / music toggle | 🔊 / 🎵 buttons |
| Language switch | "English / 中文" button on the main menu, or the `EN / 中` button in game |

## Repository layout

```
.
├── index.html                  # Page template (build entry point)
├── main.js                     # Entry: menu, tech panel, saves, language switch
├── content/
│   ├── balance.js              # Balance config (towers / enemies / economy)
│   ├── i18n.js                 # Chinese & English UI strings
│   └── levels.js               # Level & wave data
├── core/                       # Game loop, input
├── entities/                   # Towers, enemies, projectiles
├── systems/                    # Wave manager, tech tree, save system
├── render/                     # Rendering & particle effects
├── audio/                      # Web Audio synthesized SFX / music
├── scripts/build.js            # Build script
└── .github/workflows/ci.yml    # CI: build & verify the output
```

## License & Attribution

This project is released under a **custom non-commercial license** (see [LICENSE](./LICENSE)):

- Free to play, study, and modify for personal use;
- **All commercial use is prohibited** (selling, bundling into commercial products, for-profit streaming, etc.) without the copyright holder's written permission;
- Non-commercial redistribution/derivatives must retain attribution: **Terminal Protocol © yuyuanjingxuan**.
