const fs = require('fs');
const body = `本版本新增难度系统与无尽模式，并上线在线游玩。正式版 1.0.0 将在全部开发阶段完成后发布。

This release adds a difficulty system and endless mode, plus online play. The official 1.0.0 will come after all development phases are complete.

## 亮点 / Highlights

- 难度系统：简单 / 普通 / 困难三档，影响敌人血量、速度与击杀资源产出（不改变关卡结构）
- 无尽模式：通关全部 36 关后解锁，在最终关卡地图上无限生成越来越强的波次，每 10 波出现 Boss，记录最佳波次
- 在线游玩：GitHub Pages 自动部署单文件构建，打开即玩
- 存档新增难度与无尽最佳波次，旧存档完全兼容
- README 更新：角色与敌人悬念介绍、关卡名章节表、在线游玩徽章

- Difficulty system: Easy / Normal / Hard, scaling enemy HP, speed, and kill rewards (level structure unchanged)
- Endless mode: unlocked after clearing all 36 levels — infinitely scaling waves on the final level's map, a boss every 10th wave, best-wave record
- Play online: single-file build auto-deployed to GitHub Pages
- Save now stores difficulty + endless best wave; old saves fully compatible
- README: character & enemy teasers, level-name chapter table, Play Online badge

## 玩法 / How to play

下载下方的 \`terminal-protocol.html\` 在浏览器中打开即可游玩，或在线游玩：
https://yuyuanjingxuan.github.io/terminal-protocol/

Download \`terminal-protocol.html\` from the assets below and open it in a browser, or play online:
https://yuyuanjingxuan.github.io/terminal-protocol/
`;
fs.writeFileSync('.tmp_release_body.json', JSON.stringify({
  tag_name: 'v0.2.0',
  target_commitish: 'main',
  name: 'v0.2.0 - Difficulty & Endless Mode',
  body: body,
  draft: false,
  prerelease: false
}), 'utf8');
console.log('written', fs.statSync('.tmp_release_body.json').size, 'bytes');
