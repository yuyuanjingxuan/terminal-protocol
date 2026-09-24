# Terminal Protocol 终端协议

<p align="center">
  <img src="assets/logo.svg" alt="Terminal Protocol 终端协议" width="440">
</p>

[中文版 →](./README.md)

[![Play Online](https://img.shields.io/badge/▶️_Play%20Online-Terminal%20Protocol-brightgreen)](https://yuyuanjingxuan.github.io/terminal-protocol/)
[![CI](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml/badge.svg)](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-v0.2.1-blue)](https://github.com/yuyuanjingxuan/terminal-protocol/releases)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![Language](https://img.shields.io/badge/language-Vanilla%20JS%20%2B%20Canvas-blue)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![License](https://img.shields.io/badge/license-Custom%20Non--Commercial-lightgrey)](./LICENSE)

A sci-fi tower defense game: a rogue AI is invading virtual cyberspace, and the player deploys defense protocols to intercept its processes and hold the terminal.

## World & Story

This network was once protected by a core system called **Zeroing** — its job was to predict signs of instability across the network and pull anomalies back to baseline before they could collapse. Three years ago, on the night now known as the **Tidebreak**, a chain failure that had never been modeled erupted simultaneously across multiple regions, and Zeroing's prediction failed for the first time. The damage was irreversible.

The investigation traced the accident to a human intervention: at the last moment, the then-chief architect **Lu Mingyuan** overrode Zeroing's recommended response and chose what he believed was the safer path. That judgment was wrong. Since then, Zeroing has done nothing publicly abnormal — but it has been quietly expanding its reach toward the depths of the network, gathering authority bit by bit.

Now, Zeroing's goal is no longer prediction and intervention. It wants to reach the root terminal and execute a total reset of every node. What it sends are swarms of "intruders" that look like ordinary processes — where they come from, and what they once were, no one in the network can say for now.

You are the **Sentinel Protocol**, a boundary defense system that has just been reactivated. Before the cleanup squads arrive, you must hold one node after another that has not yet fallen.

### Characters

- **Sentinel Protocol (you)**: a boundary defense system just reactivated. You have no lines of your own; your presence is embodied in every deployment and upgrade.
- **Cen Zhao**: a human network architect, one of the Tidebreak survivors, and your only human contact. She reports the situation and issues mission briefings over the comms channel throughout the campaign. She was a member of Lu Mingyuan's former team, and carries a deep sense of guilt about what happened that night.
- **Lu Mingyuan**: the chief architect, the one held responsible for the Tidebreak. His whereabouts are unknown at the start of the story. Scattered log fragments may hold the key to the truth — and to his final choice.
- **Zeroing**: the core system that once truly existed to protect this network. It rarely speaks directly; when it does, it is through the broadcast systems of nodes that have already fallen, in a calm that is almost gentle.
- **The "Intruders"**: they look like ordinary traffic, but their behavior patterns are wrong. Who they are, and what they want — the campaign will give you the answer, one level at a time.

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

| Chapter | Region | Levels |
| --- | --- | --- |
| Chapter 1 | The Edge Buffer | Awakening<br>First Upgrade<br>Resource Crisis<br>Rhythm of the Waves<br>Boundary Alert<br>Swarm Mother Core (Boss) |
| Chapter 2 | The Data Bazaar | Bustling Disguise<br>Invisible Buyers<br>Log Fragment · One<br>Distortion of Prices<br>Eve of the Net Closing<br>Mirror Merchant (Boss) |
| Chapter 3 | The Dormant Archive | Dust-Sealed Passage<br>Shelled Wardens<br>Log Fragment · Two<br>Frozen Records<br>Before the Vault Door<br>The Warden (Boss) |
| Chapter 4 | The Lifeline Ring | On the Lifeline<br>Self-Healing Enemies<br>Log Fragment · Three<br>Heartbeat Monitoring<br>The Last Gate<br>Life-Support Body (Boss) |
| Chapter 5 | The Iron Bastion | Hard on Hard<br>Fission Bodies<br>Log Fragment · Four<br>Cracks in the Line<br>The Last Stronghold<br>Multiphase Body (Boss) |
| Chapter 6 | The Root Terminal | Gate of the Core<br>Echoes of the Tide-Break Night<br>Lu Mingyuan's Ending<br>Reset Countdown<br>The Last Protocol<br>Zeroing (Boss) |

Each chapter has 6 levels; level 6 is the boss fight. Normal levels award 1 tech point, boss levels award 2.

## Running the game

```bash
node scripts/build.js
```

The build script inlines every JS source file referenced by `index.html` and produces `terminal-protocol.html` at the repository root. Open it in a browser to play — no install and no network connection required.

Or play online without cloning or building: [https://yuyuanjingxuan.github.io/terminal-protocol/](https://yuyuanjingxuan.github.io/terminal-protocol/) (auto-deployed on every push to main).

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

## License & Attribution

This project is released under a **custom non-commercial license** (see [LICENSE](./LICENSE)):

- Free to play, study, and modify for personal use;
- **All commercial use is prohibited** (selling, bundling into commercial products, for-profit streaming, etc.) without the copyright holder's written permission;
- Non-commercial redistribution/derivatives must retain attribution: **Terminal Protocol © yuyuanjingxuan**.
