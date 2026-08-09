# 寰宇思贤 · 绘本盲盒管理平台

> 儿童绘本盲盒电商全栈应用 — C端用户商城 + B端管理后台 + Express API 服务

## 项目简介

寰宇思贤是一个面向儿童绘本盲盒销售的全栈电商平台，采用单项目多入口架构，包含：

- **C端用户商城**（`client/`）：商品浏览、购物车、下单支付、会员体系、分销裂变、钱包、优惠券等
- **B端管理后台**（`admin/`）：数据看板、订单管理、商品管理、分销商管理、物流、财务、营销、权限等
- **Express 后端**（`server/`）：14 个路由模块，提供 B 端 + C 端完整 RESTful API
- **共享层**（`shared/`）：统一类型定义 + API 客户端，确保前后端数据一致性

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 6（多入口多 mode 构建） |
| 样式方案 | Tailwind CSS v4 |
| 动画 | Motion |
| 图标 | Lucide React |
| 后端 | Express + CORS |
| 数据 | Mock 数据（绘本盲盒主题） |

## 目录结构

```
huanyusixian/
├── admin/              # B端管理后台（Vite mode=admin，端口 3000）
│   ├── src/
│   │   ├── api/        # B端 API 引用（重定向到 shared/api）
│   │   ├── components/ # 通用组件
│   │   ├── hooks/      # 数据 Hooks
│   │   ├── pages/      # 9 个管理页面
│   │   └── types.ts    # B端类型（重定向到 shared/types）
├── client/             # C端用户商城（Vite mode=client，端口 3002）
│   ├── src/
│   │   ├── components/ # BottomNav, Header, CheckoutDrawer, ShareDrawer
│   │   ├── pages/      # 12 个用户页面
│   │   └── types.ts    # C端类型（重定向到 shared/types）
├── server/             # Express 后端（端口 4000）
│   ├── data/           # Mock 数据
│   └── routes/         # 14 个路由模块
├── shared/             # 前后端共享层
│   ├── api/            # 统一 API 客户端（请求拦截/超时/错误处理）
│   └── types/          # 统一类型定义
├── vite.config.ts      # 多入口构建配置 + 路径别名 + 代理
├── tsconfig.json       # TypeScript 配置（@admin/@client/@shared/@server）
└── package.json        # 统一依赖管理
```

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动后端 API 服务（端口 4000）
npm run server

# 3. 启动 C端用户商城（端口 3002）
npm run dev:client

# 4. 启动 B端管理后台（端口 3000）
npm run dev:admin

# 同时启动两端
npm run dev:all
```

## 功能模块

### C端用户商城

| 模块 | 页面 | 功能 |
|------|------|------|
| 商品 | Home / ProductDetail / Favorites | 商品列表、详情、收藏 |
| 订单 | Orders / Cart / CheckoutDrawer | 购物车、下单、支付、取消、确认收货 |
| 会员 | Profile / Membership | 个人中心、会员等级与权益 |
| 钱包 | Wallet | 余额查询、充值、提现、交易明细 |
| 分销 | Distributors | 分销伙伴列表、邀请、申请成为分销商 |
| 地址 | Addresses | 增删改查、设为默认 |
| 优惠券 | Coupons | 优惠券列表、领取新人礼包 |
| 后台入口 | AdminPanel | 有权限用户可直接进入 B端后台 |

### B端管理后台

| 页面 | 功能 |
|------|------|
| Dashboard | 数据看板（销售额、订单、分销商统计） |
| Orders | 订单管理（筛选、详情、状态流转） |
| Products / AddProduct | 商品管理、新增商品 |
| Members | 会员管理 |
| Distributors | 分销商管理 |
| Logistics | 物流模板与发货地址 |
| Finance | 财务报表 |
| Marketing | 营销活动管理 |
| Permissions | 权限管理 |

### 后端 API

14 个路由模块：`auth` `products` `orders` `members` `distributors` `finance` `logistics` `permissions` `marketing` `wallet` `addresses` `cart` `coupons` `favorites`

## 构建部署

```bash
# 同时构建两端
npm run build

# 单独构建
npm run build:admin   # 输出到 dist/admin
npm run build:client  # 输出到 dist/client
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 后端服务端口 | 4000 |
| `VITE_API_URL` | API 基础路径 | /api |
| `VITE_ADMIN_URL` | B端后台 URL（C端 iframe 嵌入用） | http://localhost:3000 |

## 版本历史

- **v2.0.0**（2026-08-09）：项目合并重构，C端商城全链路 API 打通，新增后台管理入口
- v1.0.0：初始版本（AI Studio 单端应用）

## License

MIT
