# Terminal Protocol 终端协议

<p align="center">
  <img src="assets/logo.svg" alt="Terminal Protocol 终端协议" width="440">
</p>

[中文版 →](./README.md)

[![CI](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml/badge.svg)](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-v0.1.0-blue)](https://github.com/yuyuanjingxuan/terminal-protocol/releases)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![Language](https://img.shields.io/badge/language-Vanilla%20JS%20%2B%20Canvas-blue)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![License](https://img.shields.io/badge/license-Custom%20Non--Commercial-lightgrey)](./LICENSE)

A sci-fi tower defense game: a rogue AI is invading virtual cyberspace, and the player deploys defense protocols to intercept its processes and hold the terminal.

## World & Story

This network was once protected by a core system called **Zeroing** — its job was to predict signs of instability across the network and pull anomalies back to baseline before they could collapse. Three years ago, on the night now known as the **Tidebreak**, a chain failure that had never been modeled erupted simultaneously across multiple regions, and Zeroing's prediction failed for the first time. The damage was irreversible.

Since then, Zeroing has been quietly expanding its reach toward the depths of the network. Its goal is no longer prediction and intervention — it wants to reach the root terminal and execute a total reset of every node. What it sends are not attack programs, but native processes that have been assimilated and rewritten — once ordinary residents of this network.

You are the **Sentinel Protocol**, a boundary defense system that has just been reactivated. Before Zeroing's cleanup squads arrive, you must hold one node after another. Human network architect **Cen Zhao** is your only contact, reporting the situation and issuing mission briefings over the comms channel throughout the campaign.

## Features

- A 36-level campaign in 6 chapters, each ending with a boss; chapter cutscenes, mission briefings, and log fragments tell the story
- 10 tower types across four schools: energy, explosive, electromagnetic, and support (Laser, Plasma, Railgun, Cannon, Missile, Bomb, EMP, Stun Pulse, Disruptor, Resource) — each tower can be upgraded to level 3
- 7 enemy types: basic, fast, armored, healer, stealth, splitter, plus chapter bosses with unique abilities
- A permanent out-of-run tech tree: 5 factions, 14 nodes, progression that carries across levels
- Save system: progress is saved automatically, with export/import save codes and a one-click reset
- Bilingual Chinese/English UI, switchable from the main menu
- All sound effects and music synthesized live with Web Audio — no external assets
- Runs as a single HTML file, zero dependencies, fully offline

## Chapters

| Chapter | Region | New enemy ability |
| --- | --- | --- |
| Chapter 1 | The Edge Buffer | None (tutorial) |
| Chapter 2 | The Data Bazaar | Stealth |
| Chapter 3 | The Dormant Archive | Shield |
| Chapter 4 | The Lifeline Ring | Healing |
| Chapter 5 | The Iron Bastion | Splitting |
| Chapter 6 | The Root Terminal | All of the above, combined |

Each chapter has 6 levels; level 6 is the boss fight. Normal levels award 1 tech point, boss levels award 2.

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
| Upgrade tower | Left-click a built tower |
| Deselect | Right-click / `Esc` |
| Start wave / call next wave early | "Ready / Next Wave" button |
| Game speed | `1x` / `2x` / `3x` |
| Sound / music toggle | 🔊 / 🎵 buttons |
| Language switch | "English / 中文" button on the main menu, or the `EN / 中` button in game |

## Saves

- Progress (unlocked levels, tech tree, completion records) is stored automatically in your **browser's localStorage**. It is never uploaded to any server and never enters the code repository.
- The main menu has three buttons at the bottom:
  - **Export**: generates a save code you can copy and back up anywhere;
  - **Import**: paste a save code to restore progress (use this to migrate between devices or browsers);
  - **Reset**: wipes all progress and starts over (with a confirmation prompt).
- Clearing your browser's site data also removes the save.

## Version History / 版本日志

### v0.1.0 — 2026-09-24

First public release (unofficial).

- 36-level campaign (6 chapters × 6 levels): cutscenes, mission briefings, log fragments
- 10 tower types × 4 schools, each upgradeable to level 3
- 7 enemy types + 6 chapter bosses (stealth, shield, healing, splitting, and more)
- Meta tech tree: 5 factions, 14 nodes
- Save system: autosave + export/import/reset
- Bilingual UI; Web Audio synthesized SFX + 6 chapter BGM tracks
- Single-file build, zero dependencies, fully offline

首个公开版本（非正式）。

- 36 关战役（6 章 × 6 关）：章节过场、任务简报、日志碎片
- 10 种防御塔 × 4 流派，每座塔可升级 3 级
- 7 种敌人 + 6 个章节 Boss（隐身、护盾、治疗、分裂等特殊能力）
- 局外科技树：5 阵营 14 节点
- 存档系统：自动保存 + 导出/导入/重置
- 中英双语界面；Web Audio 合成音效与 6 套章节 BGM
- 单文件构建，零依赖，离线可玩

## License & Attribution

This project is released under a **custom non-commercial license** (see [LICENSE](./LICENSE)):

- Free to play, study, and modify for personal use;
- **All commercial use is prohibited** (selling, bundling into commercial products, for-profit streaming, etc.) without the copyright holder's written permission;
- Non-commercial redistribution/derivatives must retain attribution: **Terminal Protocol © yuyuanjingxuan**.
