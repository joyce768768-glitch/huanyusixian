import { Product, Order, Address, Transaction, DistributorPartner } from './types.ts';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: '星空探险家系列 · 盲盒 A',
    description: '开启一段通往遥远星系的奇幻旅程，内含一本精装绘本与限定版星图模型。',
    price: 128,
    originalPrice: 158,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGjvqMQouYaCBhFJ83GDSCP9yTS3H9acUTEcXT29mMd4sJc9RRFc_LVF0p_vHy9rE8GG_6FF9FrVY3r-sguMlom8f88LO02EEzAlJshHYp2APIl38_FKU2bRkd4WmVioHdTmj60FxQXRGimhyogO1PaxCWpyh9MzzTJYrkBu_1P0VWZG2sH_-G87kgC19iWfFKC6hH6nZA1dBKqGG3sSDn_wFLcNDgxBd2BY4Et3CrJIgXxP2tgI5GI7H9WnAcmC8cL0GIXY5m8mU',
    tag: '文学启蒙',
    isFavorite: true
  },
  {
    id: '2',
    title: '森林里的秘密花园 · 盲盒 B',
    description: '探索微观世界的奥秘，让孩子在翻阅中爱上大自然，含种子盲包。',
    price: 99,
    originalPrice: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnl737ITvFLxFBEFVcoAefEQze_IF0P3QgoCiNbRFP9Me_0baHpEUv2Ih28bz2gXjISnl7mBmzeKmGXzwl-Q05aC4bxNCt-7ToRNKajeA-ufAAYze3yeOMeXF1Bb97eu9dmcMEJXjQIvn34Ky6CFWOmUF83CO3vEXmoGoDLPwJQ6GIOANRqCXsC0P3-cfgCyP6E0swE6b8lB2RfejwJ2F8KnJodRmGRBS3-mKGkCvDdbtDZhhruMNyGbVwzjRjR1yZHzdXWz9RoKY',
    tag: '科普自然',
    isFavorite: true
  },
  {
    id: '3',
    title: '睡前故事套装',
    description: '精选世界经典童话，配以精美手绘插图，温润如水的叙事风格，相伴孩子每一个甜美梦乡。',
    price: 0,
    originalPrice: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh7ycM_cnaXx3iXXXzXjzrzZfDde6DxXRCOUnZgC2opthCbQvWSXjFcju90sIr8FJmT49Gzk0kqZ1pMhkNArMaA27nxkRJNkloVoRod8RtUnwgjbjxmcntO7bZ40Pl9QyGKq4PfTgsvMGV8f70yGkB3h-0VmHmduOpwwpXBM4hlVL9OPWfMW1wESmMPJNxg7cyH26ENO54DnvqelXT1uF7OfDh6V-HnMiUe0MlblzbHhP8VyN2kMBOmDN164cOIo7jb6YYh8SzgXg',
    tag: '超值优惠'
  },
  {
    id: '4',
    title: '趣味立体书',
    description: '通过巧妙的纸艺设计，将平面的画面变为生动的立体场景，激发孩子无限想象力。',
    price: 0,
    originalPrice: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhCS1GC3hE_yj51LRF4Qq5XNyMRvMj48UQUIgVkqjzFTS0cbJGXowtz9FL7jKZfvz1oKSxgK8ZzkgCOjq_fanAhN6M3sqvb9o-KjVdT2TaSFOJoADYWWPKSqrwEfPMRsSP7FCp3V2RVQFovbqRhEJJ61EEE13_zDSEkM0BGx8XIoHVwX7_1aaBJfyd5ruLvnu9AAoKyYoVVMQDy1K2tNZ_cwPH9PJWbqqitWXAbdeoLEp2vkMd_WWJPhEwRudg2maLbW7sIH99q0I',
    tag: '纸艺魔法'
  }
];

export const ORDERS: Order[] = [
  {
    id: 'o1',
    orderNumber: 'LR2023102401',
    status: 'pending_payment',
    totalAmount: 128,
    itemCount: 1,
    items: [
      {
        id: 'oi1',
        title: '5本儿童绘本盲盒',
        specs: '精装版',
        price: 128,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJy1wX6-MAae6MW3AwN_dWsPlczjwd5m-DWpuGjEeUgW257L8XX2OMGVTL_8YmqSp0nJA9Gvy3BCssq9_ljLrV_1AGlNf5P5ik8ks8YqjKnf5c0YqxkRpUn57BDqWGY54iUtRoXc3mqW0676TeJEjesaFPVijasBAudagI4Xatwh_t9TaRqUuvLdFs8Ejq1OaMrEm27gfN0iNDgx3lXtf-QBpHczOevBHkkGmIy_savZYdBdpHU9ErxD03-GE4YsyxPsZkB8NsG78'
      }
    ]
  },
  {
    id: 'o2',
    orderNumber: 'LR2023102215',
    status: 'pending_delivery',
    totalAmount: 89.5,
    itemCount: 2,
    items: [
      {
        id: 'oi2',
        title: '《森林里的秘密》精装绘本',
        specs: '典藏版',
        price: 44.75,
        quantity: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqBME4GACUv17hVkqZA-IB_JkkBOfBg9ha76RwCKFhggkgqfYv9Dt1gvJl8sZr6by9OuuIaOo_l60_YbRu4uqCLaNCoNxeP8DyURmsSF2NFG1YoOkkFqrtzxQEdUYTT1Tx3uN28cZdLZVpdZ--zIUNZr1wKEUIR3J3zYKzFFIegSnXVRNuAadntfOwH4A_gRdt1ByRUzryBBbMf-yYOCyDNbkBxvc1bY_2I2fcGdpWofQNcl-M4H4kv9gBeHmt51DcAX4yfEe2fCY'
      }
    ]
  },
  {
    id: 'o3',
    orderNumber: 'LR2023101809',
    status: 'completed',
    totalAmount: 45,
    itemCount: 1,
    items: [
      {
        id: 'oi3',
        title: '《宇宙大冒险》科普绘本',
        specs: '平装版',
        price: 45,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrR-Rgi29HbeQSXmxniwebu5iOHu_UUeAY_HlH-sjzBYZpQIIPPQfgBsTW7Oi7QcTDLVf4ghjBLcnwPaJHvNmqKCH6S9T6UgLLczmIUOE9p7-Te2LMY5I8Rn6R6sQdlITqdK9ZwT4bxQ7cA2IUut9qkEIB2OSM_aZBM-Jz1hJBNCl2otw65eMyKbEOCBhLkmYNWt5n-STcrkMngT4i22pSAY5J7fpR7Jj6DPfODyn9A6CFBdZu_Nw-aAfNCoJA6gzbf1seP-1WNCM'
      }
    ]
  }
];

export const ADDRESSES: Address[] = [
  {
    id: 'a1',
    name: '张明远',
    phone: '138 **** 5678',
    address: '上海市徐汇区龙腾大道 2555 号滨江艺术中心 3 楼 301 室',
    isDefault: true
  },
  {
    id: 'a2',
    name: '李晓梅',
    phone: '135 **** 9012',
    address: '北京市朝阳区建国路 88 号 SOHO 现代城 C 座 1506',
    isDefault: false
  },
  {
    id: 'a3',
    name: '王小凡',
    phone: '186 **** 2234',
    address: '广东省深圳市南山区粤海街道科苑路 15 号科兴科学园 B1 单元',
    isDefault: false
  }
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    title: '购买《夏洛的网》绘本',
    date: '2023-10-24 14:20',
    amount: -45,
    type: 'expense',
    icon: 'BookOpen'
  },
  {
    id: 't2',
    title: '钱包充值',
    date: '2023-10-22 09:15',
    amount: 500,
    type: 'income',
    icon: 'Wallet'
  },
  {
    id: 't3',
    title: '分销佣金 - 王小明购书',
    date: '2023-10-20 18:45',
    amount: 12.8,
    type: 'income',
    icon: 'Users'
  },
  {
    id: 't4',
    title: '余额提现',
    date: '2023-10-18 10:30',
    amount: -200,
    type: 'expense',
    icon: 'CreditCard'
  }
];

export const PARTNERS: DistributorPartner[] = [
  {
    id: 'p1',
    name: '林沐然',
    joinDate: '2023-11-15',
    sales: 12450,
    orderCount: 156,
    level: '高级伙伴',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgWmpDiLPENXfaovmAjWRH9D9Jq-nyTyRYqV3ayQvbuBWAl5Mn2ufKUGeLMwhIh8OWiHh8JGc1mPOF4mAqqwP46xHSP4M4D95cmwPNCwoZpXlKNyjj4QKRe74AQuGvPgbHWOhNWVTuFUvIYokdf1XxyfsHEKdsb1XcDbgmrDaEJ-5UifMtx0F86UAk7u2esLAYOGzUTclAGv7BoEOhUGZaixG7-8ugLfeL9wPisAMJIp5BL5YnLXn432spf8MhmJjk0AUhAsn-2PI'
  },
  {
    id: 'p2',
    name: '王思远',
    joinDate: '2023-12-02',
    sales: 8210.5,
    orderCount: 92,
    level: '普通伙伴',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwIafY_H0RRfyHa7Ma7jvmp0SAVwox5ui6LvPNyeTQAmW7sO0CfLfq5ZReojMqdMhgfl8WwolZoSwJTe75kQeDOYiECcM6l1cy6OpSGAI5yLn0y9gUMqhoud8XuTif_GjkMdM-OXcevWQPkFtQKmkpruSHjHWaPSPh6x_1zjjY8CBtL7tNtozWvg_u7sUjU6pMBMPsLNzw52OFQqWtuY-OwDE9Rutw9gKtHxZxsfOrEDQSsaUi8SIg_wRR0SliANQHIH-tv9Ig3-I'
  },
  {
    id: 'p3',
    name: '陈小宁',
    joinDate: '2024-01-10',
    sales: 15800,
    orderCount: 210,
    level: '高级伙伴',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1uboM6xswKsTVzv3gddrsv23HPxxS0syZ-ZfHUHwIWXEdcuhJ9cILfEiqQVeBjzfWQeC0f97wQqRbkusTSP7tKwj__O8rpU6RDaNo-0hTxkE2EBtcKdOly7fvg_yZe7zDZbJVhttbeOpnK_prjfmuM1VpRqkl9THhppn_L2TphUMFw5mc10Oso9gKWTxXfOHZZel9gJ3u19q-7uE2MllOrSY0-h8otFePMxrsMg2CR4o2uFJUrShoetEEaAopUjifs29ymQ55e0Q'
  }
];
