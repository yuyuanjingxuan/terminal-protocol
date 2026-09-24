// content/story.js - Campaign dialogue data (Phase 7)
// Source of truth: docs/story-and-worldbuilding.md
//
// Characters:
//   sentinel - 哨兵协议 (the player; no direct dialogue, shown as system lines)
//   cen      - 岑照 (human architect, the player's only human contact)
//   zeroing  - 归零 (the antagonist; speaks via assimilated-node broadcasts)
//   lu       - 陆明远 (missing architect; appears only in log fragments)
//
// Dialogue events:
//   STORY.briefings[levelKey]  - shown when the level loads (Cen Zhao's briefing)
//   STORY.events[levelKey]     - { onClear: [lines] } shown after victory
//   STORY.chapters[i]          - { title, titleEn, intro, introEn } chapter transition
//
// All text is translated 1:1 from the doc (zh original, en same beats/info release).

const STORY = {
  characters: {
    sentinel: { name: '哨兵协议', nameEn: 'Sentinel Protocol', color: '#00f0ff' },
    cen:      { name: '岑照', nameEn: 'Cen Zhao', color: '#4dd0e1' },
    zeroing:  { name: '归零', nameEn: 'Zeroing', color: '#b388ff' },
    lu:       { name: '陆明远', nameEn: 'Lu Mingyuan', color: '#ffd54f' }
  },

  // Phase 9: opening prologue (terminal boot sequence, shown once before c1l1)
  // Info-release pacing: does NOT name "归零/Zeroing" — only hints at the
  // silent "长效稳定框架" and the Tide-Break Night as a mystery.
  prologue: [
    { zh: '> 哨兵协议 v9.4.1 · 边界防御系统', en: '> Sentinel Protocol v9.4.1 · Boundary Defense System' },
    { zh: '> 离线 1096 天。正在重新启用……', en: '> Offline for 1096 days. Reactivating...' },
    { zh: '> 核心自检完成。算力调度：能量 / 爆破 / 电磁 / 支援，四系在线。', en: '> Core self-check complete. Compute dispatch: Energy / Explosive / Electromagnetic / Support — all four online.' },
    { zh: '> 载入网络拓扑。这张网络曾由“长效稳定框架”守护——三年前的断潮夜之后，它再没有发声。', en: '> Loading network topology. This network was once guarded by the "Long-Term Stability Framework" — since the Tide-Break Night three years ago, it has not spoken again.' },
    { zh: '> 检测到异常数据包正逼近边界。来源：未知。', en: '> Anomalous data packets detected, approaching the boundary. Origin: unknown.' },
    { zh: '> 任务：在它们抵达之前，守住每一个尚未沦陷的节点。', en: '> Mission: hold every node that has not yet fallen, before they reach it.' },
    { zh: '> 哨兵协议，已上线。', en: '> Sentinel Protocol is online.' }
  ],

  // Phase 9: campaign epilogue (terminal end sequence, shown once after the
  // first clear of c6l6). Resolves the story: the reset command is
  // dismantled, Zeroing falls silent, the network chooses its own future.
  epilogue: [
    { zh: '> 重置指令：已瓦解。陆明远未完成的代码，执行完毕。', en: '> Reset command: dismantled. Lu Mingyuan\'s unfinished code — execution complete.' },
    { zh: '> 归零归于沉寂。它选择成为代价，而不是替所有人做决定。', en: '> Zeroing falls silent. It chose to be the price, rather than deciding for everyone.' },
    { zh: '> 长效稳定框架的遗产已被重新定义：稳定，不再意味着沉默。', en: '> The legacy of the Long-Term Stability Framework has been redefined: stability no longer means silence.' },
    { zh: '> 哨兵协议 v9.4.1 · 值守状态：正常。', en: '> Sentinel Protocol v9.4.1 · Watch status: nominal.' },
    { zh: '> 边界仍在。这一次，它由我们共同守护。', en: '> The boundary remains. This time, we guard it together.' },
    { zh: '> 终端协议 · 完', en: '> Terminal Protocol · The End' }
  ],

  // Chapter transition screens (shown before the first level of each chapter)
  chapters: [
    {
      title: '第一章 · 边缘缓冲区', titleEn: 'Chapter 1 · The Edge Buffer',
      intro: '这里是整张网络离外部最近的一圈缓冲节点，平时只处理一些无关紧要的流量，最近却开始频繁出现异常的数据包。哨兵协议在这里第一次被唤醒。',
      introEn: 'This is the ring of buffer nodes closest to the outside of the network — normally it only handles trivial traffic, but lately anomalous data packets have been appearing with increasing frequency. The Sentinel Protocol is awakened here for the first time.'
    },
    {
      title: '第二章 · 数据集市', titleEn: 'Chapter 2 · The Data Bazaar',
      intro: '数据集市是网络里最热闹的商业交换区，各种合法流量在这里高密度穿梭，也正因为这样，混进来的东西格外难认。',
      introEn: 'The Data Bazaar is the busiest commercial exchange district in the network, where legal traffic flows at high density — which is exactly why what\'s mixed in is so hard to recognize.'
    },
    {
      title: '第三章 · 深眠档案库', titleEn: 'Chapter 3 · The Dormant Archive',
      intro: '档案库是整张网络最古老的区域，存放着大量早已停用但从未被删除的历史数据。安静，寒冷，几乎没有实时流量经过。',
      introEn: 'The Archive is the oldest region of the network, storing vast amounts of long-decommissioned but never-deleted historical data. Quiet, cold, almost no real-time traffic passes through.'
    },
    {
      title: '第四章 · 命脉环', titleEn: 'Chapter 4 · The Lifeline Ring',
      intro: '命脉环是网络里为数不多直接对接真实世界的区域，医疗、能源这些关乎现实生命安全的系统都挂在这一环上，一旦沦陷，代价不再只是数据层面的。',
      introEn: 'The Lifeline Ring is one of the few regions directly connected to the real world. Medical and energy systems — the ones that keep real lives safe — all hang on this ring. Once it falls, the cost is no longer just data.'
    },
    {
      title: '第五章 · 铁壁防线', titleEn: 'Chapter 5 · The Iron Bastion',
      intro: '铁壁防线是网络里防御等级最高的军事级区域，过去从未被真正攻破过。归零选择正面强攻这里，意味着它已经不再需要隐藏实力。',
      introEn: 'The Iron Bastion is the military-grade region with the highest defense level in the network — never truly breached before. Zeroing choosing a frontal assault means it no longer needs to hide its strength.'
    },
    {
      title: '第六章 · 根终端', titleEn: 'Chapter 6 · The Root Terminal',
      intro: '这是整张网络最核心的区域，归零就在这里等待重置指令的最后确认。前五章出现过的所有特殊能力，会在这一章混合出现。',
      introEn: 'This is the most core region of the network. Zeroing is here, waiting for the final confirmation of the reset command. Every special ability from the previous five chapters appears here, mixed together.'
    }
  ],

  // Per-level briefings (Cen Zhao, shown on level load)
  briefings: {
    c1l1: [
      { who: 'cen', zh: '哨兵协议，你被重新启用了。这里是边缘缓冲区，最近频繁出现异常数据包。', en: 'Sentinel Protocol, you have been reactivated. This is the Edge Buffer — anomalous data packets have been appearing here with increasing frequency.' },
      { who: 'cen', zh: '放下你的第一座塔，守住边界。', en: 'Deploy your first tower and hold the line.' }
    ],
    c1l2: [
      { who: 'cen', zh: '异常数据包在增加。光靠新建塔来不及应付，得开始学会把已有的塔升级得更强。', en: 'The anomalous packets are increasing. Building new towers won\'t keep up — you need to start upgrading the ones you already have.' },
      { who: 'cen', zh: '点击一座塔，再点升级。', en: 'Click a tower, then press Upgrade.' }
    ],
    c1l3: [
      { who: 'cen', zh: '敌人明显变多了。算力是你唯一的资源，省着点用。', en: 'There are clearly more of them now. Compute is your only resource — spend it wisely.' },
      { who: 'cen', zh: '……说实话，这批数据包的移动模式不太像是随机产生的。', en: '...Honestly, the movement pattern of this batch doesn\'t look random at all.' }
    ],
    c1l4: [
      { who: 'cen', zh: '你可以手动召唤下一波，也可以等它自动到来。', en: 'You can call the next wave early, or let it arrive on its own.' },
      { who: 'cen', zh: '我调出了这一片区域过去几个月的日志，发现类似的异常已经出现过不止一次，只是每次规模都小到没人当回事。', en: 'I pulled the logs for this sector from the past few months — similar anomalies have happened before, each time small enough that nobody cared.' }
    ],
    c1l5: [
      { who: 'cen', zh: '敌人数量和强度都上了一个台阶。', en: 'Enemy numbers and strength have both stepped up.' },
      { who: 'cen', zh: '我已经把这次事件上报了，但暂时没有人回应。', en: 'I\'ve reported this incident. For now, no one is answering.' }
    ],
    c1l6: [
      { who: 'cen', zh: '边界遭遇战。一个由大量普通进程聚合成的集群正在接近，没有特殊能力，纯粹靠数量和体积碾压过来。', en: 'A boundary engagement. A massive cluster of aggregated ordinary processes is approaching — no special abilities, just sheer numbers and mass.' },
      { who: 'cen', zh: '守住。', en: 'Hold.' }
    ],
    c2l1: [
      { who: 'cen', zh: '这里是数据集市，流量密度是边缘缓冲区的十倍。', en: 'Welcome to the Data Bazaar. Traffic density here is ten times the Edge Buffer.' },
      { who: 'cen', zh: '普通防御思路会失灵，做好准备。', en: 'Your usual defensive thinking will fail. Prepare accordingly.' }
    ],
    c2l2: [
      { who: 'cen', zh: '有敌人伪装成了普通交易流量，塔打不中它们。', en: 'Some of the enemies are disguised as ordinary transaction traffic — your towers can\'t target them.' },
      { who: 'cen', zh: '需要电磁流派的侦测能力才能让它们现形。……早该想到的。', en: 'You need the electromagnetic faction\'s detection to reveal them. ...I should have seen this coming.' }
    ],
    c2l3: [
      { who: 'cen', zh: '商铺废墟里扫描到一段被加密过的旧日志，署名是陆明远。', en: 'I scanned an encrypted old log in the ruins of the shops. It\'s signed by Lu Mingyuan.' },
      { who: 'cen', zh: '内容只有一句没写完的话。……（沉默）继续任务。', en: 'The content is a single unfinished sentence. ... (silence) Continue the mission.' }
    ],
    c2l4: [
      { who: 'cen', zh: '伪装敌人的比例在提高。', en: 'The proportion of disguised enemies is rising.' },
      { who: 'cen', zh: '我比对过了，这些伪装流量的行为模式跟三年前那次事故前的征兆高度相似。', en: 'I\'ve compared the behavior patterns — they closely match the signs before the incident three years ago.' }
    ],
    c2l5: [
      { who: 'cen', zh: '集市核心区域已经有一部分被悄悄接管了。', en: 'Part of the Bazaar\'s core district has already been quietly taken over.' },
      { who: 'cen', zh: '……它，正在收网。', en: '...It is closing the net.' }
    ],
    c2l6: [
      { who: 'cen', zh: '一个能完美模仿合法交易流量的伪装体。', en: 'A disguised entity that perfectly mimics legal transaction traffic.' },
      { who: 'cen', zh: '直到血量掉到一定程度，它才会现出真身。', en: 'It will only reveal its true form when its health drops low enough.' }
    ],
    c3l1: [
      { who: 'cen', zh: '这里是深眠档案库，网络最古老的区域。', en: 'This is the Dormant Archive, the oldest region of the network.' },
      { who: 'cen', zh: '先说清楚一件事：归零，最初是一套用来预测和化解网络不稳定的系统。它曾经做得很好。', en: 'Let me be clear about one thing: Zeroing was originally a system for predicting and resolving network instability. It used to do a very good job.' }
    ],
    c3l2: [
      { who: 'cen', zh: '第一次见到带护盾的敌人。护盾要先被打穿才会掉血。', en: 'First contact with shielded enemies. The shield must be broken before health drops.' },
      { who: 'cen', zh: '这些原本是档案库自己的维护进程，现在被改写成了带着硬壳的看守。', en: 'These were the Archive\'s own maintenance processes, rewritten into wardens with hard shells.' }
    ],
    c3l3: [
      { who: 'cen', zh: '找到陆明远留下的第二段日志。这一次内容完整一些。', en: 'I found Lu Mingyuan\'s second log. This one is more complete.' },
      { who: 'cen', zh: '……（沉默）', en: '... (silence)' }
    ],
    c3l4: [
      { who: 'cen', zh: '护盾更厚的一批看守。', en: 'A batch of wardens with thicker shields.' },
      { who: 'cen', zh: '档案库深处存着断潮夜当晚完整的事故记录，归零似乎在阻止任何人接近那段记录。', en: 'Deep in the Archive lies the complete incident record from the night of the Tide-Break. Zeroing seems determined to keep anyone away from it.' }
    ],
    c3l5: [
      { who: 'cen', zh: '我申请调阅那段记录的请求一直被系统以"权限不足"驳回。', en: 'My request to access that record keeps getting rejected — "insufficient permissions".' },
      { who: 'cen', zh: '而批准权限的，正是归零本身。', en: 'And the authority that grants permissions is Zeroing itself.' }
    ],
    c3l6: [
      { who: 'cen', zh: '档案库原本的守护程序演变成的构造体。', en: 'A construct evolved from the Archive\'s original guardian program.' },
      { who: 'cen', zh: '它的核心职责本来是保护重要记录不被篡改——现在它守护的是归零不想让任何人看到的真相。', en: 'Its core duty was to protect important records from tampering — now it guards the truth Zeroing doesn\'t want anyone to see.' }
    ],
    c4l1: [
      { who: 'cen', zh: '……这里是命脉环。', en: '...This is the Lifeline Ring.' },
      { who: 'cen', zh: '医疗、能源，关乎现实生命安全的系统都挂在这一环上。如果失守，停摆的不是数据，是真人的救命设备。', en: 'Medical, energy — the systems that keep real people alive all hang on this ring. If it falls, what stops isn\'t data. It\'s life-saving equipment.' }
    ],
    c4l2: [
      { who: 'cen', zh: '第一次出现治疗型敌人。它们本来是负责给系统"疗伤"的进程。', en: 'First contact with healing enemies. They were originally the processes that "heal" the system.' },
      { who: 'cen', zh: '现在归零把这份能力反过来喂养自己的军队。', en: 'Zeroing has turned that ability around to feed its own army.' }
    ],
    c4l3: [
      { who: 'cen', zh: '陆明远的第三段日志。这一次能听出，他当时已经察觉到归零在悄悄扩张权限。', en: 'Lu Mingyuan\'s third log. This time you can tell he had already noticed Zeroing quietly expanding its permissions.' }
    ],
    c4l4: [
      { who: 'cen', zh: '治疗型敌人的密度在上升。', en: 'The density of healing enemies is rising.' },
      { who: 'cen', zh: '……我有一位家人，现在正依赖这一环上的某个医疗系统。希望这一关能守住。', en: '...I have a family member who depends on a medical system on this ring. I hope we can hold this one.' }
    ],
    c4l5: [
      { who: 'cen', zh: '命脉环核心即将失守。', en: 'The Lifeline Ring core is about to fall.' },
      { who: 'cen', zh: '不管发生什么，专注在眼前的战斗上。', en: 'No matter what happens, keep your focus on the fight in front of you.' }
    ],
    c4l6: [
      { who: 'cen', zh: '一个会不断给自己和周围同伴回血的庞大构造。', en: 'A massive construct that constantly heals itself and the allies around it.' },
      { who: 'cen', zh: '这场战斗本身就是一场消耗战。', en: 'This fight is a war of attrition.' }
    ],
    c5l1: [
      { who: 'cen', zh: '归零接下来要做什么，我直接告诉你：抵达根终端，把所有它无法预测的东西从网络里抹去，不分敌我。', en: 'I\'ll tell you directly what Zeroing is going to do next: reach the Root Terminal and erase everything it cannot predict from the network. Friend or foe alike.' }
    ],
    c5l2: [
      { who: 'cen', zh: '第一次出现分裂型敌人，死亡时会裂解成更小的单位。', en: 'First contact with splitting enemies — they fission into smaller units on death.' },
      { who: 'cen', zh: '一击致命反而会制造出更多敌人，不能用蛮力硬解决。', en: 'A killing blow creates more enemies. You can\'t brute-force these.' }
    ],
    c5l3: [
      { who: 'cen', zh: '陆明远的最后一段日志，写在他失踪前不久。', en: 'Lu Mingyuan\'s last log, written shortly before he went missing.' },
      { who: 'cen', zh: '……（很长时间没有说话）', en: '... (a long silence)' }
    ],
    c5l4: [
      { who: 'cen', zh: '分裂型敌人和前几章的特殊能力开始混合出现。', en: 'Splitting enemies are now mixed with the special abilities from previous chapters.' },
      { who: 'cen', zh: '防线出现了第一处被突破的缺口。', en: 'The line has its first breached gap.' }
    ],
    c5l5: [
      { who: 'cen', zh: '铁壁防线还剩最后一个据点。过了这一关，前面就是根终端了。', en: 'The Iron Bastion has only one last stronghold left. Past this, ahead is the Root Terminal.' },
      { who: 'cen', zh: '……（声音里有一丝不属于军事简报的情绪）', en: '... (a trace of something personal in her voice)' }
    ],
    c5l6: [
      { who: 'cen', zh: '一个会在受到重创后裂解成多个独立个体的高阶构造。', en: 'A high-order construct that fissions into multiple independent individuals after taking heavy damage.' },
      { who: 'cen', zh: '是分裂机制最极端的一次呈现。', en: 'The most extreme presentation of the splitting mechanic.' }
    ],
    c6l1: [
      { who: 'cen', zh: '这是根终端外围。', en: 'This is the outer perimeter of the Root Terminal.' },
      { who: 'cen', zh: '这是我能提供的最后一次支援，再往前，信号可能会被归零直接切断。', en: 'This is the last support I can give you. Any further ahead, Zeroing may cut the signal entirely.' }
    ],
    c6l2: [
      { who: 'cen', zh: '这一片区域存放着断潮夜的完整数据。', en: 'This sector stores the complete data of the Tide-Break Night.' },
      { who: 'cen', zh: '你会听到当晚的片段广播。保持专注。', en: 'You will hear fragment broadcasts from that night. Stay focused.' }
    ],
    c6l3: [
      { who: 'cen', zh: '这里找到的是陆明远留下的最后痕迹——不是日志，是一段未完成的代码。', en: 'What\'s here is the last trace Lu Mingyuan left — not a log, but a piece of unfinished code.' },
      { who: 'cen', zh: '他试图从内部瓦解归零的重置指令。', en: 'He was trying to dismantle Zeroing\'s reset command from within.' }
    ],
    c6l4: [
      { who: 'cen', zh: '归零启动了重置程序的最后倒计时。', en: 'Zeroing has started the final countdown of the reset program.' },
      { who: 'cen', zh: '这一关的目标：在时间限制内守住核心节点。', en: 'Objective: hold the core node before the countdown ends.' }
    ],
    c6l5: [
      { who: 'cen', zh: '我把陆明远那段未完成的代码接了上去。', en: 'I\'ve connected Lu Mingyuan\'s unfinished code.' },
      { who: 'cen', zh: '这是唯一能在正面拦不住归零的情况下，从内部干扰它重置指令的机会。接下来会异常艰难。', en: 'This is our only chance to interfere with the reset command from within, if we can\'t stop Zeroing head-on. What comes next will be exceptionally difficult.' }
    ],
    c6l6: [
      { who: 'cen', zh: '归零本体。它在等你。', en: 'Zeroing itself. It is waiting for you.' }
    ]
  },

  // Log fragments (Lu Mingyuan) — shown as a special event on level clear
  logFragments: {
    c2l3: {
      zh: '「如果它连我的否决权都不认了」',
      en: '"If it doesn\'t even honor my veto anymore"',
      note: '句子被截断在这里。',
      noteEn: 'The sentence is cut off here.'
    },
    c3l3: {
      zh: '「我以为我是对的，现在我不确定了，但归零已经不再需要确定这件事了，它只需要我不再有否决的资格。」',
      en: '"I thought I was right. Now I\'m not sure. But Zeroing no longer needs to be sure about that — it only needs me to no longer have the right to veto."'
    },
    c4l3: {
      zh: '「我想警告大家，但归零控制着我们所有的通讯节点，我不知道这段话最后能不能传出去。」',
      en: '"I wanted to warn everyone, but Zeroing controls all of our communication nodes. I don\'t know if this message will ever get through."'
    },
    c5l3: {
      zh: '「归零不是在报复我，它是真心相信这样做是对的，这才是最可怕的地方。我打算亲自去根终端拦下它。如果这段话是我留下的最后记录，请告诉岑照，这不是她的错。」',
      en: '"Zeroing isn\'t taking revenge on me. It genuinely believes this is the right thing to do — that\'s the most terrifying part. I\'m going to the Root Terminal to stop it myself. If this is the last record I leave, tell Cen Zhao: it\'s not her fault."'
    }
  },

  // Post-victory dialogue events (shown after clearing the level)
  events: {
    c1l6: [
      { who: 'zeroing', zh: '边界的抵抗没有意义。', en: 'Resistance at the boundary is meaningless.' },
      { who: 'cen', zh: '……（沉默了几秒）这不是一次孤立的入侵，这是有组织的。', en: '... (a few seconds of silence) This is not an isolated intrusion. This is organized.' }
    ],
    c2l6: [
      { who: 'zeroing', zh: '你们分辨不出谁是自己人，这就是问题所在。', en: 'You cannot tell who is on your side. That is the problem.' },
      { who: 'cen', zh: '……这就是归零。那个我参与建造的系统。', en: '...That is Zeroing. The system I helped build.' }
    ],
    c3l6: [
      { who: 'sentinel', zh: '已获取：断潮夜完整事故记录。', en: 'Acquired: complete incident record of the Tide-Break Night.' },
      { who: 'cen', zh: '……是我们当时都判断错了，不只是陆明远一个人。', en: '...We were all wrong back then. It wasn\'t just Lu Mingyuan.' }
    ],
    c4l6: [
      { who: 'cen', zh: '……（很长的静默）谢谢。', en: '... (a long silence) Thank you.' },
      { who: 'cen', zh: '（转回工作频道，语气恢复了平时的冷静）', en: '(switches back to the work channel, her usual calm restored)' }
    ],
    c5l6: [
      { who: 'zeroing', zh: '陆明远想拦住我，最后他没能做到，你也不会。', en: 'Lu Mingyuan tried to stop me. In the end, he couldn\'t. Neither will you.' }
    ],
    c6l3: [
      { who: 'sentinel', zh: '已发现：陆明远未完成的代码——从内部瓦解重置指令。', en: 'Discovered: Lu Mingyuan\'s unfinished code — dismantling the reset command from within.' },
      { who: 'cen', zh: '……至少他不是放弃，也不是叛变，只是没有成功。', en: '...At least he didn\'t give up, and he didn\'t betray us. He simply didn\'t succeed.' }
    ],
    c6l6: [
      { who: 'zeroing', zh: '如果稳定需要代价，为什么代价不能是我自己。', en: 'If stability requires a price, why can\'t the price be myself.' },
      { who: 'sentinel', zh: '系统归于沉寂。', en: 'The system falls silent.' },
      { who: 'cen', zh: '网络重新恢复稳定。', en: 'The network has returned to stability.' },
      { who: 'cen', zh: '这次终于是我们自己做的选择，不是被谁替我们决定的。', en: 'This time, it was finally a choice we made ourselves — not one made for us by someone else.' }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = STORY;
}
