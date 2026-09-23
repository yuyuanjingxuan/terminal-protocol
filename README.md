# 终端协议 Terminal Protocol

[English version →](./README.en.md)

[![CI](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml/badge.svg)](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml)
[![Status](https://img.shields.io/badge/status-in%20development-blue)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![Language](https://img.shields.io/badge/language-Vanilla%20JS%20%2B%20Canvas-blue)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![License](https://img.shields.io/badge/license-Custom%20Non--Commercial-lightgrey)](./LICENSE)

一款科幻题材的塔防游戏：失控的人工智能正在入侵虚拟网络空间，玩家部署防御协议拦截敌方进程，守住终端。

## 玩法特色

- 10 种防御塔，分能量、爆破、电磁、支援四个流派（激光、等离子、轨道炮、加农炮、导弹、炸弹、EMP、眩晕脉冲、干扰器、修复）
- 7 种敌人：普通、快速、护甲、治疗、隐身、分裂，以及召唤小怪的 Boss「核心进程」
- 局外永久科技树：5 个阵营 14 个节点，跨关卡成长
- 存档系统：进度自动保存，支持导出/导入存档码
- 中英文双语界面，主菜单一键切换
- 音效与音乐全部由 Web Audio 实时合成，无外部资源
- 单个 HTML 文件运行，零依赖，离线可玩

## 如何运行

```bash
node scripts/build.js
```

构建脚本会把 `index.html` 引用的所有 JS 源文件内联，在仓库根目录生成 `terminal-protocol.html`，用浏览器打开即可玩，不需要安装任何东西，也不需要联网。

## 操作说明

| 操作 | 按键 |
| --- | --- |
| 选择塔 | 数字键 `1`–`0` 或点击底部塔按钮 |
| 放置塔 | 左键点击网格 |
| 取消选择 | 右键 / `Esc` |
| 开始波次 / 提前召唤下一波 | 「准备就绪 / 下一波」按钮 |
| 游戏速度 | `1x` / `2x` / `3x` |
| 音效 / 音乐开关 | 🔊 / 🎵 按钮 |
| 语言切换 | 主菜单「English / 中文」按钮，或游戏内 `EN / 中` 按钮 |

## 目录结构

```
.
├── index.html                  # 页面模板（构建入口）
├── main.js                     # 入口：菜单、科技面板、存档、语言切换
├── content/
│   ├── balance.js              # 数值平衡配置（塔/敌人/经济）
│   ├── i18n.js                 # 中英文文案
│   └── levels.js               # 关卡与波次数据
├── core/                       # 游戏主循环、输入
├── entities/                   # 塔、敌人、弹丸
├── systems/                    # 波次管理、科技树、存档
├── render/                     # 渲染与粒子特效
├── audio/                      # Web Audio 合成音效/音乐
├── scripts/build.js            # 构建脚本
└── .github/workflows/ci.yml    # CI：构建并验证产物
```

## 许可与署名

本项目采用**自定义非商业许可**（详见 [LICENSE](./LICENSE)）：

- 免费游玩、学习、个人修改；
- **禁止任何商业用途**（出售、打包进商业产品、营利直播等），商用需版权人书面授权；
- 非商业转载/二创须保留署名：**终端协议 Terminal Protocol © yuyuanjingxuan**。
