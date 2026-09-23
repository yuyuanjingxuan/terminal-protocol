// content/levels.js - Level definitions (Phase 7: 6 chapters × 6 levels = 36)
// Source of truth for story content: docs/story-and-worldbuilding.md
//
// Structure:
//   chapters[] - one entry per chapter: { key, name, nameEn, intro, introEn, path, levels[] }
//   levels{}   - flat map key -> level (c1l1 ... c6l6), built from chapters.
//                Kept flat so Object.keys(levels) order = campaign order.
//
// Each level: { key, name, nameEn, briefing, briefingEn, waves, [boss], [timeLimit], [ambient] }
// Wave entries: { type, ...overrides } — overrides are applied at spawn time
// (see WaveManager.applyOverrides): hp, shield, speed, size, reward, damageToBase,
// summonType/summonCount/summonInterval/summonTimer, healRate/healRadius,
// stealth, revealAtFrac, splitAtFrac/splitCount/splitType, bossName/bossNameEn.

function rep(type, n) {
  return Array.from({ length: n }, () => ({ type }));
}

const chapters = [
  // ================= Chapter 1: 边缘缓冲区 The Edge Buffer =================
  // No special abilities — pure tutorial (basic + fast only)
  {
    key: 'ch1',
    name: '边缘缓冲区',
    nameEn: 'The Edge Buffer',
    intro: '边缘缓冲区——整张网络离外部最近的一圈缓冲节点。哨兵协议在这里第一次被唤醒。',
    introEn: 'The Edge Buffer — the ring of buffer nodes closest to the outside of the network. The Sentinel Protocol is awakened here for the first time.',
    path: [
      { x: 50, y: 120 }, { x: 650, y: 120 }, { x: 650, y: 300 },
      { x: 150, y: 300 }, { x: 150, y: 480 }, { x: 750, y: 480 }
    ],
    levels: [
      {
        key: 'c1l1', name: '唤醒', nameEn: 'Awakening',
        briefing: '哨兵协议，你被重新启用了。这里是边缘缓冲区，最近频繁出现异常数据包。放下你的第一座塔，守住边界。',
        briefingEn: 'Sentinel Protocol, you have been reactivated. This is the Edge Buffer — anomalous data packets have been appearing here with increasing frequency. Deploy your first tower and hold the line.',
        waves: [
          [...rep('basic', 4)],
          [...rep('basic', 6)],
          [...rep('basic', 4), ...rep('fast', 2)]
        ]
      },
      {
        key: 'c1l2', name: '第一次升级', nameEn: 'First Upgrade',
        briefing: '异常数据包在增加。光靠新建塔来不及，把已有的塔升级得更强。点击一座塔，再点升级。',
        briefingEn: 'The anomalous packets are increasing. Building new towers won\'t keep up — upgrade the ones you already have. Click a tower, then press Upgrade.',
        waves: [
          [...rep('basic', 6)],
          [...rep('basic', 4), ...rep('fast', 2)],
          [...rep('fast', 4), ...rep('basic', 4)],
          [...rep('basic', 6), ...rep('fast', 4)]
        ]
      },
      {
        key: 'c1l3', name: '资源告急', nameEn: 'Resource Crisis',
        briefing: '敌人明显变多了。算力是你唯一的资源，省着点用。……说实话，这批数据包的移动模式不太像是随机产生的。',
        briefingEn: 'There are clearly more of them now. Compute is your only resource — spend it wisely. ...Honestly, the movement pattern of this batch doesn\'t look random at all.',
        waves: [
          [...rep('basic', 8)],
          [...rep('fast', 6), ...rep('basic', 4)],
          [...rep('basic', 6), ...rep('fast', 4)],
          [...rep('fast', 8)],
          [...rep('basic', 8), ...rep('fast', 4)]
        ]
      },
      {
        key: 'c1l4', name: '波次的节奏', nameEn: 'Rhythm of the Waves',
        briefing: '你可以手动召唤下一波，也可以等它自动到来。我调出了这片区域过去几个月的日志——类似的异常已经出现过不止一次，只是每次规模都小到没人当回事。',
        briefingEn: 'You can call the next wave early, or let it arrive on its own. I pulled the logs for this sector from the past few months — similar anomalies have happened before, each time small enough that nobody cared.',
        waves: [
          [...rep('basic', 6), ...rep('fast', 2)],
          [...rep('fast', 6), ...rep('basic', 2)],
          [...rep('basic', 8), ...rep('fast', 4)],
          [...rep('fast', 8), ...rep('basic', 4)],
          [...rep('basic', 10), ...rep('fast', 6)]
        ]
      },
      {
        key: 'c1l5', name: '边界告警', nameEn: 'Boundary Alert',
        briefing: '敌人数量和强度都上了一个台阶。我已经把这次事件上报了，但暂时没有人回应。',
        briefingEn: 'Enemy numbers and strength have both stepped up. I\'ve reported this incident. For now, no one is answering.',
        waves: [
          [...rep('fast', 8), ...rep('basic', 4)],
          [...rep('basic', 10), ...rep('fast', 4)],
          [...rep('fast', 10), ...rep('basic', 4)],
          [...rep('basic', 8), ...rep('fast', 6)],
          [...rep('fast', 8), ...rep('basic', 6)],
          [...rep('basic', 10), ...rep('fast', 8)]
        ]
      },
      {
        key: 'c1l6', name: '蜂潮母核', nameEn: 'Swarm Mother Core',
        briefing: '边界遭遇战。一个由大量普通进程聚合成的集群正在接近，没有特殊能力，纯粹靠数量。守住。',
        briefingEn: 'A boundary engagement. A massive cluster of aggregated ordinary processes is approaching — no special abilities, just sheer numbers. Hold.',
        boss: { name: '蜂潮母核', nameEn: 'Swarm Mother Core' },
        waves: [
          [...rep('basic', 8), ...rep('fast', 4)],
          [...rep('fast', 8), ...rep('basic', 6)],
          [{ type: 'boss', hp: 900, summonType: 'basic', summonCount: 2, summonInterval: 8, summonTimer: 4 }]
        ]
      }
    ]
  },

  // ================= Chapter 2: 数据集市 The Data Bazaar =================
  // Introduces: stealth (needs EM faction to reveal)
  {
    key: 'ch2',
    name: '数据集市',
    nameEn: 'The Data Bazaar',
    intro: '数据集市——网络里最热闹的商业交换区。混进来的东西，格外难认。',
    introEn: 'The Data Bazaar — the busiest commercial exchange district in the network. What\'s mixed in is especially hard to recognize.',
    path: [
      { x: 50, y: 80 }, { x: 750, y: 80 }, { x: 750, y: 220 },
      { x: 50, y: 220 }, { x: 50, y: 380 }, { x: 750, y: 380 },
      { x: 750, y: 520 }, { x: 400, y: 520 }
    ],
    levels: [
      {
        key: 'c2l1', name: '熙攘的伪装', nameEn: 'Bustling Disguise',
        briefing: '这里是数据集市，流量密度是边缘缓冲区的十倍。普通防御思路会失灵，做好准备。',
        briefingEn: 'Welcome to the Data Bazaar. Traffic density here is ten times the Edge Buffer. Your usual defensive thinking will fail. Prepare accordingly.',
        waves: [
          [...rep('basic', 8), ...rep('fast', 4)],
          [...rep('fast', 8), ...rep('basic', 4)],
          [...rep('basic', 10), ...rep('fast', 6)],
          [...rep('fast', 10), ...rep('basic', 6)]
        ]
      },
      {
        key: 'c2l2', name: '看不见的买家', nameEn: 'Invisible Buyers',
        briefing: '有敌人伪装成了普通交易流量，塔打不中它们。需要电磁流派的侦测能力让它们现形。……早该想到的。',
        briefingEn: 'Some of the enemies are disguised as ordinary transaction traffic — your towers can\'t target them. You need the electromagnetic faction\'s detection to reveal them. ...I should have seen this coming.',
        waves: [
          [...rep('basic', 8), ...rep('fast', 4)],
          [...rep('stealth', 3), ...rep('basic', 6)],
          [...rep('stealth', 4), ...rep('fast', 6)],
          [...rep('stealth', 5), ...rep('basic', 6), ...rep('fast', 4)]
        ]
      },
      {
        key: 'c2l3', name: '日志碎片・一', nameEn: 'Log Fragment · One',
        briefing: '商铺废墟里扫描到一段加密旧日志，署名是陆明远。内容只有一句没写完的话。……（沉默）继续任务。',
        briefingEn: 'I scanned an encrypted old log in the ruins of the shops. It\'s signed by Lu Mingyuan. The content is a single unfinished sentence. ... (silence) Continue the mission.',
        waves: [
          [...rep('basic', 8), ...rep('fast', 4)],
          [...rep('stealth', 4), ...rep('basic', 6)],
          [...rep('fast', 8), ...rep('stealth', 4)],
          [...rep('stealth', 6), ...rep('basic', 8)],
          [...rep('stealth', 6), ...rep('fast', 8), ...rep('basic', 4)]
        ]
      },
      {
        key: 'c2l4', name: '价格的扭曲', nameEn: 'Distortion of Prices',
        briefing: '伪装敌人的比例在提高。我比对过了，这些伪装流量的行为模式跟三年前那次事故前的征兆高度相似。',
        briefingEn: 'The proportion of disguised enemies is rising. I\'ve compared the behavior patterns — they closely match the signs before the incident three years ago.',
        waves: [
          [...rep('stealth', 6), ...rep('basic', 6)],
          [...rep('fast', 8), ...rep('stealth', 6)],
          [...rep('stealth', 8), ...rep('basic', 8)],
          [...rep('stealth', 8), ...rep('fast', 8)],
          [...rep('stealth', 10), ...rep('basic', 6), ...rep('fast', 6)]
        ]
      },
      {
        key: 'c2l5', name: '收网前夜', nameEn: 'Eve of the Net Closing',
        briefing: '集市核心区域已经有一部分被悄悄接管了。……它，正在收网。',
        briefingEn: 'Part of the Bazaar\'s core district has already been quietly taken over. ...It is closing the net.',
        waves: [
          [...rep('stealth', 8), ...rep('fast', 6)],
          [...rep('basic', 10), ...rep('stealth', 6)],
          [...rep('stealth', 10), ...rep('fast', 8)],
          [...rep('stealth', 8), ...rep('basic', 8), ...rep('fast', 4)],
          [...rep('stealth', 10), ...rep('fast', 10)],
          [...rep('stealth', 12), ...rep('basic', 8), ...rep('fast', 6)]
        ]
      },
      {
        key: 'c2l6', name: '镜像商贩', nameEn: 'Mirror Merchant',
        briefing: '一个能完美模仿合法交易流量的伪装体。直到血量掉到一定程度，它才会现出真身。',
        briefingEn: 'A disguised entity that perfectly mimics legal transaction traffic. It will only reveal its true form when its health drops low enough.',
        boss: { name: '镜像商贩', nameEn: 'Mirror Merchant' },
        waves: [
          [...rep('stealth', 8), ...rep('basic', 6)],
          [...rep('stealth', 10), ...rep('fast', 8)],
          [{ type: 'boss', hp: 1000, stealth: true, revealAtFrac: 0.5, summonType: 'stealth', summonCount: 2, summonInterval: 8, summonTimer: 4 }]
        ]
      }
    ]
  },

  // ================= Chapter 3: 深眠档案库 The Dormant Archive =================
  // Introduces: shield (armored)
  {
    key: 'ch3',
    name: '深眠档案库',
    nameEn: 'The Dormant Archive',
    intro: '深眠档案库——网络最古老的区域。安静，寒冷，几乎没有实时流量经过。',
    introEn: 'The Dormant Archive — the oldest region of the network. Quiet, cold, almost no real-time traffic passes through.',
    path: [
      { x: 50, y: 300 }, { x: 250, y: 300 }, { x: 250, y: 100 },
      { x: 550, y: 100 }, { x: 550, y: 500 }, { x: 750, y: 500 }
    ],
    levels: [
      {
        key: 'c3l1', name: '尘封的通道', nameEn: 'Dust-Sealed Passage',
        briefing: '这里是深眠档案库，网络最古老的区域。先说清楚一件事：归零，最初是一套用来预测和化解网络不稳定的系统。它曾经做得很好。',
        briefingEn: 'This is the Dormant Archive, the oldest region of the network. Let me be clear about one thing: Zeroing was originally a system for predicting and resolving network instability. It used to do a very good job.',
        waves: [
          [...rep('basic', 8), ...rep('fast', 4)],
          [...rep('armored', 3), ...rep('basic', 6)],
          [...rep('armored', 4), ...rep('fast', 6)],
          [...rep('armored', 5), ...rep('basic', 8)]
        ]
      },
      {
        key: 'c3l2', name: '带壳的看守', nameEn: 'Shelled Wardens',
        briefing: '第一次见到带护盾的敌人。护盾要先被打穿才会掉血。这些原本是档案库自己的维护进程，现在被改写成了带硬壳的看守。',
        briefingEn: 'First contact with shielded enemies. The shield must be broken before health drops. These were the Archive\'s own maintenance processes, rewritten into wardens with hard shells.',
        waves: [
          [...rep('armored', 4), ...rep('basic', 6)],
          [...rep('armored', 6), ...rep('fast', 6)],
          [...rep('armored', 6), ...rep('basic', 8)],
          [...rep('armored', 8), ...rep('fast', 6), ...rep('basic', 4)]
        ]
      },
      {
        key: 'c3l3', name: '日志碎片・二', nameEn: 'Log Fragment · Two',
        briefing: '找到陆明远留下的第二段日志。这一次内容完整一些。……（沉默）',
        briefingEn: 'I found Lu Mingyuan\'s second log. This one is more complete. ... (silence)',
        waves: [
          [...rep('armored', 6), ...rep('basic', 6)],
          [...rep('stealth', 4), ...rep('armored', 4), ...rep('basic', 6)],
          [...rep('armored', 8), ...rep('fast', 6)],
          [...rep('armored', 8), ...rep('stealth', 6)],
          [...rep('armored', 10), ...rep('basic', 8), ...rep('fast', 4)]
        ]
      },
      {
        key: 'c3l4', name: '冻结的记录', nameEn: 'Frozen Records',
        briefing: '护盾更厚的一批看守。档案库深处存着断潮夜当晚完整的事故记录，归零似乎在阻止任何人接近那段记录。',
        briefingEn: 'A batch of wardens with thicker shields. Deep in the Archive lies the complete incident record from the night of the Tide-Break. Zeroing seems determined to keep anyone away from it.',
        waves: [
          [...rep('armored', 8), ...rep('basic', 8)],
          [...rep('armored', 10), ...rep('fast', 6)],
          [...rep('armored', 10), ...rep('stealth', 6)],
          [...rep('armored', 12), ...rep('basic', 8)],
          [...rep('armored', 12), ...rep('stealth', 8), ...rep('fast', 6)]
        ]
      },
      {
        key: 'c3l5', name: '库门之前', nameEn: 'Before the Vault Door',
        briefing: '我申请调阅那段记录的请求一直被系统以"权限不足"驳回。而批准权限的，正是归零本身。',
        briefingEn: 'My request to access that record keeps getting rejected — "insufficient permissions". And the authority that grants permissions is Zeroing itself.',
        waves: [
          [...rep('armored', 10), ...rep('stealth', 6)],
          [...rep('armored', 12), ...rep('fast', 8)],
          [...rep('armored', 12), ...rep('stealth', 8)],
          [...rep('armored', 14), ...rep('basic', 8)],
          [...rep('armored', 14), ...rep('stealth', 10), ...rep('fast', 6)],
          [...rep('armored', 16), ...rep('stealth', 8), ...rep('fast', 8)]
        ]
      },
      {
        key: 'c3l6', name: '监守者', nameEn: 'The Warden',
        briefing: '档案库原本的守护程序演变成的构造体。它的核心职责本来是保护重要记录不被篡改——现在它守护的是归零不想让任何人看到的真相。',
        briefingEn: 'A construct evolved from the Archive\'s original guardian program. Its core duty was to protect important records from tampering — now it guards the truth Zeroing doesn\'t want anyone to see.',
        boss: { name: '监守者', nameEn: 'The Warden' },
        waves: [
          [...rep('armored', 12), ...rep('stealth', 8)],
          [...rep('armored', 14), ...rep('stealth', 10), ...rep('fast', 6)],
          [{ type: 'boss', hp: 1100, shield: 200, summonType: 'armored', summonCount: 2, summonInterval: 8, summonTimer: 4 }]
        ]
      }
    ]
  },

  // ================= Chapter 4: 命脉环 The Lifeline Ring =================
  // Introduces: healing
  {
    key: 'ch4',
    name: '命脉环',
    nameEn: 'The Lifeline Ring',
    intro: '命脉环——直接对接真实世界的区域。一旦沦陷，代价不再只是数据层面。',
    introEn: 'The Lifeline Ring — the region directly connected to the real world. Once it falls, the cost is no longer just data.',
    path: [
      { x: 50, y: 500 }, { x: 50, y: 150 }, { x: 350, y: 150 },
      { x: 350, y: 450 }, { x: 650, y: 450 }, { x: 650, y: 100 },
      { x: 750, y: 100 }
    ],
    levels: [
      {
        key: 'c4l1', name: '生命线上', nameEn: 'On the Lifeline',
        briefing: '……这里是命脉环。医疗、能源，关乎现实生命安全的系统都挂在这一环上。如果失守，停摆的不是数据，是真人的救命设备。',
        briefingEn: '...This is the Lifeline Ring. Medical, energy — the systems that keep real people alive all hang on this ring. If it falls, what stops isn\'t data. It\'s life-saving equipment.',
        waves: [
          [...rep('basic', 8), ...rep('fast', 4)],
          [...rep('healer', 2), ...rep('basic', 8)],
          [...rep('healer', 3), ...rep('fast', 8)],
          [...rep('healer', 3), ...rep('basic', 10), ...rep('fast', 4)]
        ]
      },
      {
        key: 'c4l2', name: '自愈的敌人', nameEn: 'Self-Healing Enemies',
        briefing: '第一次出现治疗型敌人。它们本来是负责给系统"疗伤"的进程，现在归零把这份能力反过来喂养自己的军队。',
        briefingEn: 'First contact with healing enemies. They were originally the processes that "heal" the system. Zeroing has turned that ability around to feed its own army.',
        waves: [
          [...rep('healer', 3), ...rep('basic', 8)],
          [...rep('healer', 4), ...rep('fast', 8)],
          [...rep('healer', 4), ...rep('armored', 4), ...rep('basic', 6)],
          [...rep('healer', 5), ...rep('basic', 10), ...rep('fast', 6)]
        ]
      },
      {
        key: 'c4l3', name: '日志碎片・三', nameEn: 'Log Fragment · Three',
        briefing: '陆明远的第三段日志。这一次能听出，他当时已经察觉到归零在悄悄扩张权限。',
        briefingEn: 'Lu Mingyuan\'s third log. This time you can tell he had already noticed Zeroing quietly expanding its permissions.',
        waves: [
          [...rep('healer', 4), ...rep('basic', 8)],
          [...rep('healer', 4), ...rep('stealth', 6), ...rep('basic', 6)],
          [...rep('healer', 5), ...rep('armored', 6), ...rep('fast', 6)],
          [...rep('healer', 6), ...rep('stealth', 8), ...rep('basic', 8)],
          [...rep('healer', 6), ...rep('armored', 8), ...rep('stealth', 6)]
        ]
      },
      {
        key: 'c4l4', name: '心跳监测', nameEn: 'Heartbeat Monitoring',
        briefing: '治疗型敌人的密度在上升。……我有一位家人，现在正依赖这一环上的某个医疗系统。希望这一关能守住。',
        briefingEn: 'The density of healing enemies is rising. ...I have a family member who depends on a medical system on this ring. I hope we can hold this one.',
        waves: [
          [...rep('healer', 6), ...rep('basic', 10)],
          [...rep('healer', 6), ...rep('fast', 10)],
          [...rep('healer', 8), ...rep('armored', 8)],
          [...rep('healer', 8), ...rep('stealth', 8), ...rep('basic', 8)],
          [...rep('healer', 10), ...rep('armored', 8), ...rep('fast', 8)]
        ]
      },
      {
        key: 'c4l5', name: '最后一道闸门', nameEn: 'The Last Gate',
        briefing: '命脉环核心即将失守。不管发生什么，专注在眼前的战斗上。',
        briefingEn: 'The Lifeline Ring core is about to fall. No matter what happens, keep your focus on the fight in front of you.',
        waves: [
          [...rep('healer', 8), ...rep('armored', 10)],
          [...rep('healer', 8), ...rep('stealth', 10), ...rep('basic', 8)],
          [...rep('healer', 10), ...rep('armored', 10), ...rep('fast', 8)],
          [...rep('healer', 10), ...rep('stealth', 10), ...rep('armored', 8)],
          [...rep('healer', 12), ...rep('armored', 12), ...rep('stealth', 8)],
          [...rep('healer', 12), ...rep('armored', 12), ...rep('stealth', 10), ...rep('fast', 8)]
        ]
      },
      {
        key: 'c4l6', name: '维生体', nameEn: 'Life-Support Body',
        briefing: '一个会不断给自己和周围同伴回血的庞大构造。这场战斗本身就是一场消耗战。',
        briefingEn: 'A massive construct that constantly heals itself and the allies around it. This fight is a war of attrition.',
        boss: { name: '维生体', nameEn: 'Life-Support Body' },
        waves: [
          [...rep('healer', 8), ...rep('armored', 10), ...rep('stealth', 8)],
          [...rep('healer', 10), ...rep('armored', 12), ...rep('stealth', 10)],
          [{ type: 'boss', hp: 1200, healRate: 6, healRadius: 120, summonType: 'healer', summonCount: 1, summonInterval: 8, summonTimer: 4 }]
        ]
      }
    ]
  },

  // ================= Chapter 5: 铁壁防线 The Iron Bastion =================
  // Introduces: splitting
  {
    key: 'ch5',
    name: '铁壁防线',
    nameEn: 'The Iron Bastion',
    intro: '铁壁防线——防御等级最高的军事级区域。归零选择正面强攻，意味着它不再需要隐藏实力。',
    introEn: 'The Iron Bastion — the military-grade region with the highest defense level. Zeroing chose a frontal assault, meaning it no longer needs to hide its strength.',
    path: [
      { x: 400, y: 50 }, { x: 400, y: 250 }, { x: 100, y: 250 },
      { x: 100, y: 550 }, { x: 700, y: 550 }, { x: 700, y: 350 },
      { x: 400, y: 350 }
    ],
    levels: [
      {
        key: 'c5l1', name: '硬碰硬', nameEn: 'Hard on Hard',
        briefing: '归零接下来要做什么，我直接告诉你：抵达根终端，把所有它无法预测的东西从网络里抹去，不分敌我。',
        briefingEn: 'I\'ll tell you directly what Zeroing is going to do next: reach the Root Terminal and erase everything it cannot predict from the network. Friend or foe alike.',
        waves: [
          [...rep('basic', 10), ...rep('fast', 6)],
          [...rep('splitter', 3), ...rep('basic', 8)],
          [...rep('splitter', 4), ...rep('fast', 8)],
          [...rep('splitter', 5), ...rep('basic', 10), ...rep('fast', 6)]
        ]
      },
      {
        key: 'c5l2', name: '裂解体', nameEn: 'Fission Bodies',
        briefing: '第一次出现分裂型敌人，死亡时会裂解成更小的单位。一击致命反而会制造出更多敌人，不能用蛮力硬解决。',
        briefingEn: 'First contact with splitting enemies — they fission into smaller units on death. A killing blow creates more enemies. You can\'t brute-force these.',
        waves: [
          [...rep('splitter', 5), ...rep('basic', 8)],
          [...rep('splitter', 6), ...rep('fast', 8)],
          [...rep('splitter', 6), ...rep('armored', 6), ...rep('basic', 6)],
          [...rep('splitter', 8), ...rep('basic', 10), ...rep('fast', 8)]
        ]
      },
      {
        key: 'c5l3', name: '日志碎片・四', nameEn: 'Log Fragment · Four',
        briefing: '陆明远的最后一段日志，写在他失踪前不久。……（很长时间没有说话）',
        briefingEn: 'Lu Mingyuan\'s last log, written shortly before he went missing. ... (a long silence)',
        waves: [
          [...rep('splitter', 6), ...rep('basic', 10)],
          [...rep('splitter', 6), ...rep('stealth', 8), ...rep('basic', 6)],
          [...rep('splitter', 8), ...rep('armored', 8), ...rep('fast', 6)],
          [...rep('splitter', 8), ...rep('healer', 4), ...rep('stealth', 8)],
          [...rep('splitter', 10), ...rep('armored', 8), ...rep('stealth', 8), ...rep('basic', 6)]
        ]
      },
      {
        key: 'c5l4', name: '防线的裂缝', nameEn: 'Cracks in the Line',
        briefing: '分裂型敌人和前几章的特殊能力开始混合出现。防线出现了第一处被突破的缺口。',
        briefingEn: 'Splitting enemies are now mixed with the special abilities from previous chapters. The line has its first breached gap.',
        waves: [
          [...rep('splitter', 8), ...rep('armored', 10), ...rep('stealth', 8)],
          [...rep('splitter', 8), ...rep('healer', 6), ...rep('fast', 10)],
          [...rep('splitter', 10), ...rep('armored', 10), ...rep('stealth', 8)],
          [...rep('splitter', 10), ...rep('healer', 8), ...rep('armored', 10)],
          [...rep('splitter', 12), ...rep('armored', 12), ...rep('stealth', 10), ...rep('healer', 6)]
        ]
      },
      {
        key: 'c5l5', name: '最后的据点', nameEn: 'The Last Stronghold',
        briefing: '铁壁防线还剩最后一个据点。过了这一关，前面就是根终端了。……（声音里有一丝不属于军事简报的情绪）',
        briefingEn: 'The Iron Bastion has only one last stronghold left. Past this, ahead is the Root Terminal. ... (a trace of something personal in her voice)',
        waves: [
          [...rep('splitter', 10), ...rep('armored', 12), ...rep('stealth', 10)],
          [...rep('splitter', 10), ...rep('healer', 8), ...rep('armored', 12)],
          [...rep('splitter', 12), ...rep('stealth', 12), ...rep('fast', 10)],
          [...rep('splitter', 12), ...rep('healer', 10), ...rep('armored', 12)],
          [...rep('splitter', 14), ...rep('armored', 14), ...rep('stealth', 12), ...rep('healer', 8)],
          [...rep('splitter', 14), ...rep('armored', 14), ...rep('stealth', 12), ...rep('healer', 10), ...rep('fast', 8)]
        ]
      },
      {
        key: 'c5l6', name: '多相体', nameEn: 'Multiphase Body',
        briefing: '一个会在受到重创后裂解成多个独立个体的高阶构造。是分裂机制最极端的一次呈现。',
        briefingEn: 'A high-order construct that fissions into multiple independent individuals after taking heavy damage. The most extreme presentation of the splitting mechanic.',
        boss: { name: '多相体', nameEn: 'Multiphase Body' },
        waves: [
          [...rep('splitter', 12), ...rep('armored', 12), ...rep('stealth', 12)],
          [...rep('splitter', 14), ...rep('healer', 10), ...rep('armored', 14)],
          [{ type: 'boss', hp: 1300, splitAtFrac: 0.5, splitCount: 3, splitType: 'fast', summonType: 'splitter', summonCount: 1, summonInterval: 8, summonTimer: 4 }]
        ]
      }
    ]
  },

  // ================= Chapter 6: 根终端 The Root Terminal =================
  // All special abilities mixed; highest intensity; campaign finale
  {
    key: 'ch6',
    name: '根终端',
    nameEn: 'The Root Terminal',
    intro: '根终端——整张网络最核心的区域。归零在这里，等待重置指令的最后确认。',
    introEn: 'The Root Terminal — the most core region of the network. Zeroing is here, waiting for the final confirmation of the reset command.',
    path: [
      { x: 50, y: 300 }, { x: 200, y: 300 }, { x: 200, y: 100 },
      { x: 600, y: 100 }, { x: 600, y: 500 }, { x: 400, y: 500 },
      { x: 400, y: 300 }, { x: 750, y: 300 }
    ],
    levels: [
      {
        key: 'c6l1', name: '核心之门', nameEn: 'Gate of the Core',
        briefing: '这是根终端外围。这是我能提供的最后一次支援，再往前，信号可能会被归零直接切断。',
        briefingEn: 'This is the outer perimeter of the Root Terminal. This is the last support I can give you. Any further ahead, Zeroing may cut the signal entirely.',
        waves: [
          [...rep('armored', 10), ...rep('stealth', 10), ...rep('basic', 8)],
          [...rep('splitter', 8), ...rep('healer', 8), ...rep('fast', 10)],
          [...rep('armored', 12), ...rep('stealth', 12), ...rep('splitter', 8)],
          [...rep('healer', 10), ...rep('splitter', 10), ...rep('armored', 10)],
          [...rep('armored', 14), ...rep('stealth', 12), ...rep('splitter', 10), ...rep('healer', 8)]
        ]
      },
      {
        key: 'c6l2', name: '断潮夜的回声', nameEn: 'Echoes of the Tide-Break Night',
        briefing: '这一片区域存放着断潮夜的完整数据。你会听到当晚的片段广播。保持专注。',
        briefingEn: 'This sector stores the complete data of the Tide-Break Night. You will hear fragment broadcasts from that night. Stay focused.',
        ambient: true,
        waves: [
          [...rep('stealth', 12), ...rep('armored', 12), ...rep('basic', 8)],
          [...rep('splitter', 10), ...rep('healer', 10), ...rep('stealth', 10)],
          [...rep('armored', 14), ...rep('splitter', 10), ...rep('healer', 10)],
          [...rep('stealth', 14), ...rep('splitter', 12), ...rep('armored', 12)],
          [...rep('armored', 16), ...rep('stealth', 14), ...rep('splitter', 12), ...rep('healer', 10)]
        ]
      },
      {
        key: 'c6l3', name: '陆明远的结局', nameEn: 'Lu Mingyuan\'s Ending',
        briefing: '这里找到的是陆明远留下的最后痕迹——不是日志，是一段未完成的代码。他试图从内部瓦解归零的重置指令。',
        briefingEn: 'What\'s here is the last trace Lu Mingyuan left — not a log, but a piece of unfinished code. He was trying to dismantle Zeroing\'s reset command from within.',
        waves: [
          [...rep('armored', 14), ...rep('stealth', 12), ...rep('splitter', 10)],
          [...rep('healer', 12), ...rep('splitter', 12), ...rep('fast', 10)],
          [...rep('armored', 16), ...rep('stealth', 14), ...rep('healer', 10)],
          [...rep('splitter', 14), ...rep('armored', 14), ...rep('stealth', 14)],
          [...rep('armored', 18), ...rep('stealth', 14), ...rep('splitter', 14), ...rep('healer', 10)]
        ]
      },
      {
        key: 'c6l4', name: '重置倒计时', nameEn: 'Reset Countdown',
        briefing: '归零启动了重置程序的最后倒计时。这一关的目标：在时间限制内守住核心节点。',
        briefingEn: 'Zeroing has started the final countdown of the reset program. Objective: hold the core node before the countdown ends.',
        timeLimit: 240,
        waves: [
          [...rep('armored', 12), ...rep('stealth', 12), ...rep('splitter', 10)],
          [...rep('healer', 12), ...rep('splitter', 12), ...rep('armored', 12)],
          [...rep('stealth', 14), ...rep('splitter', 14), ...rep('healer', 12)],
          [...rep('armored', 16), ...rep('stealth', 14), ...rep('splitter', 14), ...rep('healer', 12)]
        ]
      },
      {
        key: 'c6l5', name: '最后的协议', nameEn: 'The Last Protocol',
        briefing: '我把陆明远那段未完成的代码接了上去。这是唯一能在正面拦不住归零的情况下，从内部干扰它重置指令的机会。接下来会异常艰难。',
        briefingEn: 'I\'ve connected Lu Mingyuan\'s unfinished code. This is our only chance to interfere with the reset command from within, if we can\'t stop Zeroing head-on. What comes next will be exceptionally difficult.',
        waves: [
          [...rep('armored', 16), ...rep('stealth', 14), ...rep('splitter', 12), ...rep('healer', 10)],
          [...rep('splitter', 16), ...rep('healer', 12), ...rep('armored', 16)],
          [...rep('stealth', 16), ...rep('splitter', 16), ...rep('armored', 14)],
          [...rep('healer', 14), ...rep('armored', 18), ...rep('stealth', 14)],
          [...rep('splitter', 18), ...rep('armored', 18), ...rep('stealth', 16), ...rep('healer', 12)],
          [...rep('armored', 20), ...rep('stealth', 16), ...rep('splitter', 18), ...rep('healer', 14)]
        ]
      },
      {
        key: 'c6l6', name: '归零', nameEn: 'Zeroing',
        briefing: '归零本体。它在等你。',
        briefingEn: 'Zeroing itself. It is waiting for you.',
        boss: { name: '归零', nameEn: 'Zeroing' },
        waves: [
          [...rep('armored', 16), ...rep('stealth', 16), ...rep('splitter', 14), ...rep('healer', 12)],
          [...rep('splitter', 18), ...rep('healer', 14), ...rep('armored', 18), ...rep('stealth', 14)],
          [{ type: 'boss', hp: 1500, shield: 300, healRate: 5, summonType: 'stealth', summonCount: 2, summonInterval: 8, summonTimer: 4, splitAtFrac: 0.5, splitCount: 2, splitType: 'boss' }]
        ]
      }
    ]
  }
];

// --- Flat level map (campaign order = Object.keys order) ---
const levels = {};
chapters.forEach(ch => {
  ch.levels.forEach(lv => { levels[lv.key] = lv; });
});

// Chapter index (0-5) for a level key
function chapterIndexForLevel(key) {
  const idx = Object.keys(levels).indexOf(key);
  return idx >= 0 ? Math.floor(idx / 6) : 0;
}

// Export levels object
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { levels, chapters, chapterIndexForLevel };
}
