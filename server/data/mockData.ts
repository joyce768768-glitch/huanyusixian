// ================================================================
// 寰宇思贤 - Mock 数据（绘本盲盒主题，B+C 共用）
// 注意：所有数据结构对齐 shared/types/index.ts
// ================================================================

// ---------------- 用户 / 权限角色 ----------------
export const users = [
  { id: 'USR-ADMIN-001', name: '管理员-艾伦', role: '平台管理员', date: '2024-01-01 10:00', wechat: 'admin_allen' },
  { id: 'USR-DIST-002',  name: '运营-贝尔',   role: '分销商',     date: '2024-02-15 14:30', wechat: 'op_bell' },
  { id: 'USR-ADMIN-003', name: '财务-查理',   role: '平台管理员', date: '2024-03-10 09:15', wechat: 'fin_charlie' },
  { id: 'USR-MEMBER-004', name: '客服-戴安娜', role: '普通会员',   date: '2024-04-05 16:45', wechat: 'cs_diana' },
  { id: 'USR-DIST-005',  name: '技术-艾德',   role: '分销商',     date: '2024-05-01 11:20', wechat: 'tech_ed' },
  { id: 'USR-DIST-006',  name: '销售-弗兰克', role: '分销商',     date: '2024-06-15 08:30', wechat: 'sales_frank' },
  { id: 'USR-ADMIN-007', name: '市场-格雷',   role: '平台管理员', date: '2024-07-20 13:00', wechat: 'marketing_grey' },
  { id: 'USR-MEMBER-008', name: '用户-海伦',   role: '普通会员',   date: '2024-08-08 17:20', wechat: 'user_helen' },
  // C端默认登录用户：张明远，VIP 3，同时拥有后台管理权限（分销商+管理员）
  { id: 'USR-CLIENT-001', name: '张明远', role: '分销商', date: '2023-06-25 10:00', wechat: 'zhangmingyuan', phone: '138****5678', adminAccess: true },
];

// ---------------- 商品 ----------------
const IMG_A = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGjvqMQouYaCBhFJ83GDSCP9yTS3H9acUTEcXT29mMd4sJc9RRFc_LVF0p_vHy9rE8GG_6FF9FrVY3r-sguMlom8f88LO02EEzAlJshHYp2APIl38_FKU2bRkd4WmVioHdTmj60FxQXRGimhyogO1PaxCWpyh9MzzTJYrkBu_1P0VWZG2sH_-G87kgC19iWfFKC6hH6nZA1dBKqGG3sSDn_wFLcNDgxBd2BY4Et3CrJIgXxP2tgI5GI7H9WnAcmC8cL0GIXY5m8mU';
const IMG_B = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnl737ITvFLxFBEFVcoAefEQze_IF0P3QgoCiNbRFP9Me_0baHpEUv2Ih28bz2gXjISnl7mBmzeKmGXzwl-Q05aC4bxNCt-7ToRNKajeA-ufAAYze3yeOMeXF1Bb97eu9dmcMEJXjQIvn34Ky6CFWOmUF83CO3vEXmoGoDLPwJQ6GIOANRqCXsC0P3-cfgCyP6E0swE6b8lB2RfejwJ2F8KnJodRmGRBS3-mKGkCvDdbtDZhhruMNyGbVwzjRjR1yZHzdXWz9RoKY';
const IMG_C = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh7ycM_cnaXx3iXXXzXjzrzZfDde6DxXRCOUnZgC2opthCbQvWSXjFcju90sIr8FJmT49Gzk0kqZ1pMhkNArMaA27nxkRJNkloVoRod8RtUnwgjbjxmcntO7bZ40Pl9QyGKq4PfTgsvMGV8f70yGkB3h-0VmHmduOpwwpXBM4hlVL9OPWfMW1wESmMPJNxg7cyH26ENO54DnvqelXT1uF7OfDh6V-HnMiUe0MlblzbHhP8VyN2kMBOmDN164cOIo7jb6YYh8SzgXg';
const IMG_D = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhCS1GC3hE_yj51LRF4Qq5XNyMRvMj48UQUIgVkqjzFTS0cbJGXowtz9FL7jKZfvz1oKSxgK8ZzkgCOjq_fanAhN6M3sqvb9o-KjVdT2TaSFOJoADYWWPKSqrwEfPMRsSP7FCp3V2RVQFovbqRhEJJ61EEE13_zDSEkM0BGx8XIoHVwX7_1aaBJfyd5ruLvnu9AAoKyYoVVMQDy1K2tNZ_cwPH9PJWbqqitWXAbdeoLEp2vkMd_WWJPhEwRudg2maLbW7sIH99q0I';
const IMG_E = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJy1wX6-MAae6MW3AwN_dWsPlczjwd5m-DWpuGjEeUgW257L8XX2OMGVTL_8YmqSp0nJA9Gvy3BCssq9_ljLrV_1AGlNf5P5ik8ks8YqjKnf5c0YqxkRpUn57BDqWGY54iUtRoXc3mqW0676TeJEjesaFPVijasBAudagI4Xatwh_t9TaRqUuvLdFs8Ejq1OaMrEm27gfN0iNDgx3lXtf-QBpHczOevBHkkGmIy_savZYdBdpHU9ErxD03-GE4YsyxPsZkB8NsG78';
const IMG_F = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqBME4GACUv17hVkqZA-IB_JkkBOfBg9ha76RwCKFhggkgqfYv9Dt1gvJl8sZr6by9OuuIaOo_l60_YbRu4uqCLaNCoNxeP8DyURmsSF2NFG1YoOkkFqrtzxQEdUYTT1Tx3uN28cZdLZVpdZ--zIUNZr1wKEUIR3J3zYKzFFIegSnXVRNuAadntfOwH4A_gRdt1ByRUzryBBbMf-yYOCyDNbkBxvc1bY_2I2fcGdpWofQNcl-M4H4kv9gBeHmt51DcAX4yfEe2fCY';
const IMG_G = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrR-Rgi29HbeQSXmxniwebu5iOHu_UUeAY_HlH-sjzBYZpQIIPPQfgBsTW7Oi7QcTDLVf4ghjBLcnwPaJHvNmqKCH6S9T6UgLLczmIUOE9p7-Te2LMY5I8Rn6R6sQdlITqdK9ZwT4bxQ7cA2IUut9qkEIB2OSM_aZBM-Jz1hJBNCl2otw65eMyKbEOCBhLkmYNWt5n-STcrkMngT4i22pSAY5J7fpR7Jj6DPfODyn9A6CFBdZu_Nw-aAfNCoJA6gzbf1seP-1WNCM';
const IMG_H = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgWmpDiLPENXfaovmAjWRH9D9Jq-nyTyRYqV3ayQvbuBWAl5Mn2ufKUGeLMwhIh8OWiHh8JGc1mPOF4mAqqwP46xHSP4M4D95cmwPNCwoZpXlKNyjj4QKRe74AQuGvPgbHWOhNWVTuFUvIYokdf1XxyfsHEKdsb1XcDbgmrDaEJ-5UifMtx0F86UAk7u2esLAYOGzUTclAGv7BoEOhUGZaixG7-8ugLfeL9wPisAMJIp5BL5YnLXn432spf8MhmJjk0AUhAsn-2PI';

export const products = [
  {
    id: 'PRD-001',
    name: '星空探险家系列 · 盲盒 A',
    title: '星空探险家系列 · 盲盒 A',
    description: '开启一段通往遥远星系的奇幻旅程，内含一本精装绘本与限定版星图模型。',
    category: '文学启蒙',
    price: 128,
    originalPrice: 158,
    stock: 1250,
    sold: 8420,
    status: 'online' as const,
    image: IMG_A,
    tag: '文学启蒙',
    isFavorite: true,
  },
  {
    id: 'PRD-002',
    name: '森林里的秘密花园 · 盲盒 B',
    title: '森林里的秘密花园 · 盲盒 B',
    description: '探索微观世界的奥秘，让孩子在翻阅中爱上大自然，含种子盲包。',
    category: '科普自然',
    price: 99,
    originalPrice: 128,
    stock: 860,
    sold: 5630,
    status: 'online' as const,
    image: IMG_B,
    tag: '科普自然',
    isFavorite: true,
  },
  {
    id: 'PRD-003',
    name: '睡前故事套装（5本）',
    title: '睡前故事套装',
    description: '精选世界经典童话，配以精美手绘插图，温润如水的叙事风格，相伴孩子每一个甜美梦乡。',
    category: '经典童话',
    price: 0,
    originalPrice: 128,
    stock: 3000,
    sold: 12800,
    status: 'online' as const,
    image: IMG_C,
    tag: '超值优惠',
  },
  {
    id: 'PRD-004',
    name: '趣味立体书 · 魔法森林',
    title: '趣味立体书',
    description: '通过巧妙的纸艺设计，将平面的画面变为生动的立体场景，激发孩子无限想象力。',
    category: '纸艺魔法',
    price: 0,
    originalPrice: 128,
    stock: 580,
    sold: 2100,
    status: 'online' as const,
    image: IMG_D,
    tag: '纸艺魔法',
  },
  {
    id: 'PRD-005',
    name: '海底两万里 · 科普礼盒',
    title: '海底两万里 · 科普礼盒',
    description: '跟随鹦鹉螺号的航迹，踏上沉浸式海洋科普之旅，附赠海洋生物盲盒。',
    category: '科普自然',
    price: 168,
    originalPrice: 198,
    stock: 320,
    sold: 1580,
    status: 'online' as const,
    image: IMG_E,
    tag: '科普自然',
  },
  {
    id: 'PRD-006',
    name: '中华成语故事 · 精装',
    title: '中华成语故事 · 精装',
    description: '20个脍炙人口的成语典故，配以国风水彩插画，适合4-10岁亲子共读。',
    category: '国学启蒙',
    price: 88,
    originalPrice: 108,
    stock: 2100,
    sold: 6780,
    status: 'online' as const,
    image: IMG_F,
    tag: '国学启蒙',
  },
  {
    id: 'PRD-007',
    name: '小王子 · 中英双语典藏',
    title: '儿童绘本 - 小王子',
    description: '中英双语对照，原版手稿插图，附赠作者语音导读。',
    category: '经典童话',
    price: 76,
    originalPrice: 98,
    stock: 1500,
    sold: 3890,
    status: 'online' as const,
    image: IMG_G,
    tag: '经典童话',
  },
  {
    id: 'PRD-008',
    name: '安徒生童话精选 · 典藏版',
    title: '儿童绘本 - 安徒生童话',
    description: '精选15篇安徒生最具代表性作品，超大开本，环保大豆油墨印刷。',
    category: '经典童话',
    price: 95,
    originalPrice: 128,
    stock: 980,
    sold: 2450,
    status: 'online' as const,
    image: IMG_H,
    tag: '经典童话',
  },
];

// ---------------- 订单（B+C双兼容字段 + C 端 status 英文枚举 + 中文显示） ----------------
export const orders = [
  {
    id: 'ORD-20240115-8892',
    orderNumber: 'LR2024011501',
    goods: '星空探险家系列 · 盲盒 A',
    qty: 2,
    amount: '¥256.00',
    totalAmount: 256,
    itemCount: 2,
    time: '2024-01-15 14:32',
    createTime: '2024-01-15 14:32',
    dist: '张晓明',
    distId: 'DIS-001',
    userId: 'USR-CLIENT-001',
    status: '已完成',
    statusCode: 'completed',
    color: 'emerald',
    log: 'ship',
    items: [
      { id: 'it-1', productId: 'PRD-001', title: '星空探险家系列 · 盲盒 A', specs: '精装版', price: 128, quantity: 2, image: IMG_A },
    ],
  },
  {
    id: 'ORD-20240114-1102',
    orderNumber: 'LR2024011402',
    goods: '森林里的秘密花园 · 盲盒 B x2',
    qty: 2,
    amount: '¥198.00',
    totalAmount: 198,
    itemCount: 2,
    time: '2024-01-14 11:15',
    createTime: '2024-01-14 11:15',
    dist: '李思思',
    distId: 'DIS-002',
    userId: 'USR-CLIENT-001',
    status: '待发货',
    statusCode: 'pending_delivery',
    color: 'amber',
    log: 'box',
    items: [
      { id: 'it-2', productId: 'PRD-002', title: '森林里的秘密花园 · 盲盒 B', specs: '典藏版', price: 99, quantity: 2, image: IMG_B },
    ],
  },
  {
    id: 'ORD-20240112-9982',
    orderNumber: 'LR2024011203',
    goods: '海底两万里 · 科普礼盒',
    qty: 1,
    amount: '¥168.00',
    totalAmount: 168,
    itemCount: 1,
    time: '2024-01-12 16:45',
    createTime: '2024-01-12 16:45',
    dist: '王伟',
    distId: 'DIS-003',
    userId: 'USR-CLIENT-001',
    status: '已退货',
    statusCode: 'refunded',
    color: 'rose',
    log: 'return',
    items: [
      { id: 'it-3', productId: 'PRD-005', title: '海底两万里 · 科普礼盒', specs: '标准装', price: 168, quantity: 1, image: IMG_E },
    ],
  },
  {
    id: 'ORD-20240110-3345',
    orderNumber: 'LR2024011004',
    goods: '中华成语故事 · 精装 x3',
    qty: 3,
    amount: '¥264.00',
    totalAmount: 264,
    itemCount: 3,
    time: '2024-01-10 09:20',
    createTime: '2024-01-10 09:20',
    dist: '赵丽华',
    distId: 'DIS-004',
    userId: 'USR-CLIENT-001',
    status: '待付款',
    statusCode: 'pending_payment',
    color: 'blue',
    log: 'pay',
    items: [
      { id: 'it-4', productId: 'PRD-006', title: '中华成语故事 · 精装', specs: '平装版', price: 88, quantity: 3, image: IMG_F },
    ],
  },
  {
    id: 'ORD-20240108-5520',
    orderNumber: 'LR2024010805',
    goods: '小王子 · 中英双语典藏',
    qty: 1,
    amount: '¥76.00',
    totalAmount: 76,
    itemCount: 1,
    time: '2024-01-08 19:08',
    createTime: '2024-01-08 19:08',
    dist: '张晓明',
    distId: 'DIS-001',
    userId: 'USR-CLIENT-001',
    status: '已发货',
    statusCode: 'shipped',
    color: 'violet',
    log: 'truck',
    items: [
      { id: 'it-5', productId: 'PRD-007', title: '小王子 · 中英双语典藏', specs: '典藏版', price: 76, quantity: 1, image: IMG_G },
    ],
  },
];

// ---------------- 会员 ----------------
export const members = [
  { id: 'MEM-001', name: '张三', level: 'VIP 5' as const, totalAmount: 35680, registerDate: '2023-06-25', phone: '138****1234' },
  { id: 'MEM-002', name: '李四', level: 'VIP 3' as const, totalAmount: 8520,  registerDate: '2023-09-18', phone: '139****5678' },
  { id: 'MEM-003', name: '王五', level: 'VIP 2' as const, totalAmount: 1280,  registerDate: '2024-02-10', phone: '137****9012' },
  { id: 'MEM-004', name: '赵六', level: 'VIP 4' as const, totalAmount: 21500, registerDate: '2023-11-05', phone: '136****3456' },
  { id: 'MEM-005', name: '孙七', level: 'VIP 1' as const, totalAmount: 380,   registerDate: '2024-03-05', phone: '135****7890' },
  // C 端默认用户
  { id: 'MEM-CLIENT-001', name: '张明远', level: 'VIP 3' as const, totalAmount: 18520, registerDate: '2023-06-25', phone: '138****5678', userId: 'USR-CLIENT-001' },
];

// ---------------- 分销商 ----------------
export const distributors = [
  { id: 'DIS-001', name: '张晓明', level: '高级分销商' as const, status: 'active' as const, regTime: '2024-01-15', orders: 182, revenue: 125800, rate: '15%', phone: '138****8888' },
  { id: 'DIS-002', name: '李思思', level: '中级分销商' as const, status: 'active' as const, regTime: '2024-02-20', orders: 96,  revenue: 68500,  rate: '12%', phone: '139****6666' },
  { id: 'DIS-003', name: '王伟',   level: '初级分销商' as const, status: 'active' as const, regTime: '2024-03-10', orders: 45,  revenue: 28900,  rate: '10%', phone: '137****5555' },
  { id: 'DIS-004', name: '赵丽华', level: '高级分销商' as const, status: 'active' as const, regTime: '2024-01-05', orders: 234, revenue: 156200, rate: '15%', phone: '136****4444' },
];

// 我的分销伙伴（张明远 DIS-ME-001 发展的下级）
export const MY_PARTNERS_USER_ID = 'USR-CLIENT-001';
export const myPartners = [
  {
    id: 'P-001',
    name: '林沐然',
    joinDate: '2023-11-15',
    sales: 12450,
    orderCount: 156,
    level: '高级伙伴' as const,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgWmpDiLPENXfaovmAjWRH9D9Jq-nyTyRYqV3ayQvbuBWAl5Mn2ufKUGeLMwhIh8OWiHh8JGc1mPOF4mAqqwP46xHSP4M4D95cmwPNCwoZpXlKNyjj4QKRe74AQuGvPgbHWOhNWVTuFUvIYokdf1XxyfsHEKdsb1XcDbgmrDaEJ-5UifMtx0F86UAk7u2esLAYOGzUTclAGv7BoEOhUGZaixG7-8ugLfeL9wPisAMJIp5BL5YnLXn432spf8MhmJjk0AUhAsn-2PI',
  },
  {
    id: 'P-002',
    name: '王思远',
    joinDate: '2023-12-02',
    sales: 8210.5,
    orderCount: 92,
    level: '普通伙伴' as const,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwIafY_H0RRfyHa7Ma7jvmp0SAVwox5ui6LvPNyeTQAmW7sO0CfLfq5ZReojMqdMhgfl8WwolZoSwJTe75kQeDOYiECcM6l1cy6OpSGAI5yLn0y9gUMqhoud8XuTif_GjkMdM-OXcevWQPkFtQKmkpruSHjHWaPSPh6x_1zjjY8CBtL7tNtozWvg_u7sUjU6pMBMPsLNzw52OFQqWtuY-OwDE9Rutw9gKtHxZxsfOrEDQSsaUi8SIg_wRR0SliANQHIH-tv9Ig3-I',
  },
  {
    id: 'P-003',
    name: '陈小宁',
    joinDate: '2024-01-10',
    sales: 15800,
    orderCount: 210,
    level: '高级伙伴' as const,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1uboM6xswKsTVzv3gddrsv23HPxxS0syZ-ZfHUHwIWXEdcuhJ9cILfEiqQVeBjzfWQeC0f97wQqRbkusTSP7tKwj__O8rpU6RDaNo-0hTxkE2EBtcKdOly7fvg_yZe7zDZbJVhttbeOpnK_prjfmuM1VpRqkl9THhppn_L2TphUMFw5mc10Oso9gKWTxXfOHZZel9gJ3u19q-7uE2MllOrSY0-h8otFePMxrsMg2CR4o2uFJUrShoetEEaAopUjifs29ymQ55e0Q',
  },
];

// ---------------- 财务（B端流水） ----------------
export const financeRecords = [
  { id: 'FIN-001', type: '商品收入', category: 'sales',   amount: 125800.00, time: '2024-05-24', description: '分销商订单结算' },
  { id: 'FIN-002', type: '分销商入驻', category: 'income', amount: 18200.00,  time: '2024-05-24', description: '新分销商入驻费用' },
  { id: 'FIN-003', type: '商品成本支出', category: 'expense', amount: -45600.00, time: '2024-05-23', description: '商品采购成本' },
  { id: 'FIN-004', type: '快递费支出', category: 'expense', amount: -8900.00,  time: '2024-05-23', description: '物流运费结算' },
  { id: 'FIN-005', type: '商品退货收入', category: 'income', amount: 2450.00,   time: '2024-05-22', description: '退货退款' },
];

// ---------------- C 端：钱包/流水 ----------------
export const walletData = {
  balance: 1288.5,
  frozenAmount: 0,
  totalIncome: 6580,
  totalExpense: 5291.5,
  userId: MY_PARTNERS_USER_ID,
};

export const walletTransactions = [
  { id: 't-1', title: '购买《夏洛的网》绘本',   date: '2024-01-15 14:20', amount: -45,   type: 'expense' as const, icon: 'BookOpen' },
  { id: 't-2', title: '钱包充值',               date: '2024-01-14 09:15', amount: 500,   type: 'income'  as const, icon: 'Wallet'   },
  { id: 't-3', title: '分销佣金 - 王小明购书',   date: '2024-01-13 18:45', amount: 12.8,  type: 'income'  as const, icon: 'Users'    },
  { id: 't-4', title: '余额提现',               date: '2024-01-12 10:30', amount: -200,  type: 'expense' as const, icon: 'CreditCard' },
  { id: 't-5', title: '分销佣金 - 陈小宁购书',   date: '2024-01-11 20:10', amount: 25.6,  type: 'income'  as const, icon: 'Users'    },
  { id: 't-6', title: '订单退款 · 科普礼盒',     date: '2024-01-09 11:05', amount: 168,   type: 'income'  as const, icon: 'RefreshCw' },
];

// ---------------- 物流模板 ----------------
export const logisticsTemplates = [
  { id: 'LOG-001', name: '全国标准运费 (Standard)', desc: '默认基础运费模板。', mode: '按重量 (Weight-based)', area: '全国大部分地区', date: '2023-10-15', status: 'active' as const },
  { id: 'LOG-002', name: '小件商品免邮 (Eco-Pack)',  desc: '满 ¥99 元免运费策略。', mode: '按件数 (Per item)', area: '华东、华南地区', date: '2023-10-15', status: '' },
  { id: 'LOG-003', name: '偏远地区加价模板',         desc: '新疆、西藏等偏远地区额外加价。', mode: '按重量 (Weight-based)', area: '新疆、西藏、青海', date: '2023-11-20', status: 'active' as const },
];

// 发货地址（仓库）
export const shippingAddresses = [
  { id: 'SHIP-001', name: '上海总仓', user: '张经理', phone: '138****1111', area: '上海市 浦东新区', detail: '张江高科技园区XX路XX号' },
  { id: 'SHIP-002', name: '深圳分仓', user: '李主管', phone: '139****2222', area: '广东省 深圳市', detail: '南山区科技园XX大厦XX层' },
  { id: 'SHIP-003', name: '北京仓库', user: '王专员', phone: '137****3333', area: '北京市 朝阳区', detail: '望京SOHOXX座XX室' },
];

// ---------------- 权限 ----------------
export const permissions = [
  { name: '数据统计',       type: 'parent' as const, admin: true,  distro: true,  member: false },
  { name: '  - 首页仪表盘', type: 'child'  as const, admin: true,  distro: true,  member: false },
  { name: '  - 销售趋势分析', type: 'child' as const, admin: true,  distro: true,  member: false },
  { name: '订单管理',       type: 'parent' as const, admin: true,  distro: true,  member: false },
  { name: '  - 订单列表',   type: 'child'  as const, admin: true,  distro: true,  member: false },
  { name: '门店会员',       type: 'parent' as const, admin: true,  distro: false, member: false },
  { name: '  - 会员列表',   type: 'child'  as const, admin: true,  distro: true,  member: false },
  { name: '物流设置',       type: 'parent' as const, admin: true,  distro: false, member: false },
  { name: '收支管理',       type: 'parent' as const, admin: true,  distro: false, member: false },
  { name: '商品管理',       type: 'parent' as const, admin: true,  distro: true,  member: false },
];

// ---------------- 营销活动 ----------------
export const marketingActivities = [
  { id: 'MKT-001', name: '新用户注册有礼', type: 'register', status: 'active' as const, reward: '¥20 优惠券', startDate: '2024-01-01', endDate: '2024-12-31' },
  { id: 'MKT-002', name: '邀请好友奖励',   type: 'invite',   status: 'active' as const, reward: '¥15 优惠券', startDate: '2024-02-01', endDate: '2024-12-31' },
];

// ================================================================
// C 端用户专属 Mock 数据
// ================================================================

// C 端默认用户的收货地址
export const userAddresses = [
  { id: 'ADDR-C-001', name: '张明远',  phone: '138 **** 5678', address: '上海市徐汇区龙腾大道 2555 号滨江艺术中心 3 楼 301 室', area: '上海市 徐汇区', detail: '龙腾大道 2555 号滨江艺术中心 3 楼 301 室', isDefault: true,  userId: MY_PARTNERS_USER_ID },
  { id: 'ADDR-C-002', name: '李晓梅',  phone: '135 **** 9012', address: '北京市朝阳区建国路 88 号 SOHO 现代城 C 座 1506',      area: '北京市 朝阳区', detail: '建国路 88 号 SOHO 现代城 C 座 1506',      isDefault: false, userId: MY_PARTNERS_USER_ID },
  { id: 'ADDR-C-003', name: '王小凡',  phone: '186 **** 2234', address: '广东省深圳市南山区粤海街道科苑路 15 号科兴科学园 B1 单元', area: '广东省 深圳市 南山区', detail: '粤海街道科苑路 15 号科兴科学园 B1 单元', isDefault: false, userId: MY_PARTNERS_USER_ID },
];

// 我的优惠券
export const userCoupons = [
  { id: 'CP-001', title: '满99减20新人券',     discountType: 'amount'   as const, amount: 20,  minSpend: 99,  validFrom: '2024-01-01', validTo: '2024-12-31', status: 'unused'  as const },
  { id: 'CP-002', title: '满199减50通用券',    discountType: 'amount'   as const, amount: 50,  minSpend: 199, validFrom: '2024-01-01', validTo: '2024-06-30', status: 'unused'  as const },
  { id: 'CP-003', title: '首单8折邀请券',      discountType: 'percent'  as const, percent: 20, minSpend: 50,  validFrom: '2024-01-01', validTo: '2024-12-31', status: 'unused'  as const },
  { id: 'CP-004', title: '盲盒系列运费券',     discountType: 'shipping' as const, amount: 0,   minSpend: 68,  validFrom: '2024-01-01', validTo: '2024-03-31', status: 'used'    as const },
  { id: 'CP-005', title: '首单满99减20',       discountType: 'amount'   as const, amount: 20,  minSpend: 99,  validFrom: '2023-01-01', validTo: '2023-12-31', status: 'expired' as const },
];

// 我的收藏夹
export const favoriteIds = ['PRD-001', 'PRD-002', 'PRD-007'];

// 购物车
export const cartItems = [
  { id: 'CI-001', productId: 'PRD-001', quantity: 1, specs: '精装版',  selected: true,  addedAt: '2024-01-15 10:00', userId: MY_PARTNERS_USER_ID },
  { id: 'CI-002', productId: 'PRD-005', quantity: 2, specs: '标准装',  selected: true,  addedAt: '2024-01-14 19:22', userId: MY_PARTNERS_USER_ID },
  { id: 'CI-003', productId: 'PRD-007', quantity: 1, specs: '典藏版',  selected: false, addedAt: '2024-01-13 22:05', userId: MY_PARTNERS_USER_ID },
];
