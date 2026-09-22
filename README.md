# 终端协议 Terminal Protocol

[English version →](./README.en.md)

![CI](https://github.com/YOUR_USERNAME/terminal-protocol/actions/workflows/ci.yml/badge.svg)
![Status](https://img.shields.io/badge/status-planning-yellow)
![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

一款科幻题材的塔防游戏，背景设定在失控人工智能入侵的虚拟网络空间里。玩家部署防御协议拦截敌方进程，守住网络节点。

## 项目状态

目前处于规划阶段，系统设计和开发路线图已经完成，具体代码尚未开始编写。CI 徽章会随着后续构建脚本和验证脚本的加入逐步变绿，现在它检查的只是规划文档是否存在。

## 玩法特色

- 三十关以上的完整战役，划分六个章节，每章末尾是一场 Boss 战
- 十二种以上的防御塔，分能量、爆破、电磁、支援四个流派
- 敌人带有护盾、治疗、隐身、分裂等特殊能力
- 局内临时升级加局外永久科技树的双层成长系统
- 简单、普通、困难三档难度，通关后解锁无尽模式
- 中英文双语界面和剧情，可在设置里切换
- 单个 HTML 文件运行，不依赖任何外部库，音效和音乐都用 Web Audio 实时合成

## 技术方案

用原生 JavaScript 和 Canvas 实现，不引入任何前端框架或者第三方库。开发时代码拆分成多个源文件，写好之后用构建脚本合并成一个可以直接在浏览器里打开的 HTML 文件。

## 开发文档

完整的系统设计和分阶段开发路线图在 [`docs/tower-defense-master-plan.md`](./docs/tower-defense-master-plan.md) 里，包括地图和塔的机制、敌人设计、成长和存档系统、美术和音频方向、以及从项目搭建到最终验收的十二个开发阶段。

## 目录结构

```
.
├── docs/
│   └── tower-defense-master-plan.md   # 完整设计文档和开发路线图
├── scripts/                            # 构建和验证脚本（开发中）
├── src/                                 # 游戏源码，按模块拆分（开发中）
└── .github/workflows/ci.yml            # 自动构建和验证
```

## 如何运行

项目完成构建脚本后，运行脚本会在仓库根目录生成一个单独的 HTML 文件，直接用浏览器打开就能玩，不需要安装任何东西，也不需要联网。
