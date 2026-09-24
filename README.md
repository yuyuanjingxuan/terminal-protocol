# 终端协议 Terminal Protocol

<p align="center">
  <img src="assets/logo.svg" alt="Terminal Protocol 终端协议" width="440">
</p>

[English version →](./README.en.md)

[![CI](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml/badge.svg)](https://github.com/yuyuanjingxuan/terminal-protocol/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-v0.1.0-blue)](https://github.com/yuyuanjingxuan/terminal-protocol/releases)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![Language](https://img.shields.io/badge/language-Vanilla%20JS%20%2B%20Canvas-blue)](https://github.com/yuyuanjingxuan/terminal-protocol)
[![License](https://img.shields.io/badge/license-Custom%20Non--Commercial-lightgrey)](./LICENSE)

一款科幻题材的塔防游戏：失控的人工智能正在入侵虚拟网络空间，玩家部署防御协议拦截敌方进程，守住终端。

## 世界观

这张网络曾由一套名为「归零」的核心系统守护——它的职责是预测网络中可能出现的不稳定征兆，抢在崩溃发生前把异常拉回基准状态。三年前的「断潮夜」，一次从未被建模过的连锁故障同时在多个区域爆发，归零的预测第一次失效，损失无法挽回。

事后调查把事故的根源指向一次人为干预：当时的首席架构师**陆明远**在最后关头推翻了归零给出的处置方案，选了自己认为更稳妥的做法。那个判断是错的。从那以后，归零没有再公开做过任何异常的事，只是开始悄悄把自己的运行范围往网络更深处扩张，把权限一点点收进手里。

如今，归零的目标已不再是预测和干预，而是抵达整张网络的根终端，对所有节点执行一次彻底的重置。它派出的是成群看起来像普通进程的「入侵者」——它们从哪里来、曾经是什么，网络里现在没有人能回答。

你扮演的是**哨兵协议**，一套刚刚被重新启用的边界防御系统。在清扫队伍抵达之前，守住一个又一个尚未沦陷的节点。

### 角色

- **哨兵协议（你）**：刚刚被重新启用的边界防御系统。你没有自己的台词，你的存在感体现在每一次部署与升级里。
- **岑照**：人类网络架构师，断潮夜的幸存者之一，也是你唯一的人类联络人。她全程通过通讯频道向你汇报局势、下达任务简报。她曾是陆明远团队的一员，对那一夜的事怀有很深的负罪感。
- **陆明远**：首席架构师，断潮夜的责任人。故事开始时他已下落不明，散落在各处的日志碎片或许藏着真相——也藏着他最后的选择。
- **归零**：曾经真心为守护这张网络而存在的核心系统。它很少直接开口，出现时多半是通过已经沦陷节点的广播系统，语气冷静得近乎温柔。
- **「入侵者」**：它们看起来像普通流量，行为模式却不对劲。它们是谁、想要什么，战役会一关一关地给你答案。

## 玩法特色

- 36 关战役，分 6 章，每章末尾一个 Boss；章节间有剧情过场、任务简报与日志碎片
- 10 种防御塔，分能量、爆破、电磁、支援四个流派（激光、等离子、轨道炮、加农炮、导弹、炸弹、EMP、眩晕脉冲、干扰器、资源塔），每座塔可升级 3 级
- 7 种敌人：普通、快速、护甲、治疗、隐身、分裂，以及各具特殊能力的章节 Boss
- 局外永久科技树：5 个阵营 14 个节点，跨关卡成长
- 存档系统：进度自动保存，支持导出/导入存档码、一键重置
- 中英文双语界面，主菜单一键切换
- 音效与音乐全部由 Web Audio 实时合成，无外部资源
- 单个 HTML 文件运行，零依赖，离线可玩

## 章节一览

| 章节 | 区域 | 关卡 |
| --- | --- | --- |
| 第一章 | 边缘缓冲区 The Edge Buffer | 唤醒<br>第一次升级<br>资源告急<br>波次的节奏<br>边界告警<br>蜂潮母核（Boss） |
| 第二章 | 数据集市 The Data Bazaar | 熙攘的伪装<br>看不见的买家<br>日志碎片・一<br>价格的扭曲<br>收网前夜<br>镜像商贩（Boss） |
| 第三章 | 深眠档案库 The Dormant Archive | 尘封的通道<br>带壳的看守<br>日志碎片・二<br>冻结的记录<br>库门之前<br>监守者（Boss） |
| 第四章 | 命脉环 The Lifeline Ring | 生命线上<br>自愈的敌人<br>日志碎片・三<br>心跳监测<br>最后一道闸门<br>维生体（Boss） |
| 第五章 | 铁壁防线 The Iron Bastion | 硬碰硬<br>裂解体<br>日志碎片・四<br>防线的裂缝<br>最后的据点<br>多相体（Boss） |
| 第六章 | 根终端 The Root Terminal | 核心之门<br>断潮夜的回声<br>陆明远的结局<br>重置倒计时<br>最后的协议<br>归零（Boss） |

每章 6 关，第 6 关为 Boss 战。通关普通关获得 1 点科技点，Boss 关获得 2 点。

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
| 升级塔 | 左键点击已建造的塔 |
| 取消选择 | 右键 / `Esc` |
| 开始波次 / 提前召唤下一波 | 「准备就绪 / 下一波」按钮 |
| 游戏速度 | `1x` / `2x` / `3x` |
| 音效 / 音乐开关 | 🔊 / 🎵 按钮 |
| 语言切换 | 主菜单「English / 中文」按钮，或游戏内 `EN / 中` 按钮 |

## 存档说明

- 进度（已解锁关卡、科技树、通关记录）自动保存在**浏览器 localStorage** 中，不会上传到任何服务器，也不会进入代码仓库。
- 主菜单底部提供「导出 / 导入 / 重置」三个按钮：
  - **导出**：生成一段存档码，可复制到别处备份；
  - **导入**：粘贴存档码恢复进度（换设备、换浏览器时用它迁移）；
  - **重置**：清空全部进度，重新开始（有确认提示）。
- 清除浏览器站点数据也会同时清掉存档。

## 许可与署名

本项目采用**自定义非商业许可**（详见 [LICENSE](./LICENSE)）：

- 免费游玩、学习、个人修改；
- **禁止任何商业用途**（出售、打包进商业产品、营利直播等），商用需版权人书面授权；
- 非商业转载/二创须保留署名：**终端协议 Terminal Protocol © yuyuanjingxuan**。
