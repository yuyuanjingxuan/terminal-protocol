# Terminal Protocol 终端协议

[中文版 →](./README.md)

![CI](https://github.com/YOUR_USERNAME/terminal-protocol/actions/workflows/ci.yml/badge.svg)
![Status](https://img.shields.io/badge/status-planning-yellow)
![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

A sci-fi tower defense game set in a virtual cyberspace battlefield, where a rogue AI is spreading and the player deploys defense protocols to intercept its processes and hold each network node.

## Project status

The project is in the planning stage. System design and the development roadmap are finished, but implementation hasn't started yet. The CI badge will turn meaningful as build and verification scripts are added; right now it only checks that the planning document exists.

## Features

- A full campaign of 30+ levels across six chapters, each ending in a boss fight
- 12+ towers across four schools: energy, blast, electromagnetic, and support
- Enemies with special abilities including shields, healing, stealth, and splitting on death
- A two-layer progression system: temporary in-level upgrades plus a permanent out-of-run tech tree
- Three difficulty levels, with an endless mode unlocked after clearing the campaign
- Bilingual Chinese and English interface and story, switchable in settings
- Runs as a single HTML file with zero external dependencies; sound effects and music are synthesized live with Web Audio

## Technical approach

Built with vanilla JavaScript and Canvas, no frontend framework or third-party libraries. During development the code is split across multiple source files, then merged by a build script into one HTML file that opens directly in a browser.

## Development docs

The full system design and phased development roadmap live in [`docs/tower-defense-master-plan.md`](./docs/tower-defense-master-plan.md), covering map and tower mechanics, enemy design, the progression and save system, art and audio direction, and the twelve development phases from project setup through final acceptance.

## Repository layout

```
.
├── docs/
│   └── tower-defense-master-plan.md   # Full design doc and development roadmap
├── scripts/                            # Build and verification scripts (in progress)
├── src/                                 # Game source, split by module (in progress)
└── .github/workflows/ci.yml            # Automated build and verification
```

## Running the game

Once the build script is in place, running it produces a single HTML file at the repository root. Open it in a browser to play — no install and no network connection required.
