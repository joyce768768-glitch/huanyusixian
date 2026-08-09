// ================================================================
// 寰宇思贤管理平台 - 统一共享类型定义
// B端后台 / C端前端 / Server 后端 共用
// ================================================================

// ---------------- 商品 ----------------
export interface Product {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  sold?: number;
  status?: 'online' | 'offline';
  image?: string;
  tag?: string;
  isFavorite?: boolean;
}

// ---------------- 订单 ----------------
export type OrderStatus =
  | 'pending_payment'
  | 'pending_delivery'
  | 'shipped'
  | 'completed'
  | 'refunded'
  | 'cancelled';

export const OrderStatusLabel: Record<OrderStatus, string> = {
  pending_payment: '待付款',
  pending_delivery: '待发货',
  shipped: '已发货',
  completed: '已完成',
  refunded: '已退货',
  cancelled: '已取消',
};

export interface OrderItem {
  id: string;
  productId?: string;
  title: string;
  specs?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  itemCount?: number;
  qty?: number;
  goods?: string;
  amount?: number;
  time?: string;
  dist?: string;
  distId?: string;
  color?: string;
  log?: string;
  createTime?: string;
}

// ---------------- 会员 ----------------
export type MemberLevel = 'VIP 1' | 'VIP 2' | 'VIP 3' | 'VIP 4' | 'VIP 5';

export interface Member {
  id: string;
  name: string;
  phone: string;
  level: MemberLevel | string;
  totalAmount?: number;
  registerDate?: string;
  userId?: string;
}

// ---------------- 分销商 ----------------
export type DistributorLevel =
  | '初级分销商'
  | '中级分销商'
  | '高级分销商'
  | '普通伙伴'
  | '高级伙伴';

export type DistributorStatus = 'active' | 'inactive' | 'pending';

export interface Distributor {
  id: string;
  name: string;
  phone?: string;
  level: DistributorLevel;
  status?: DistributorStatus;
  regTime?: string;
  joinDate?: string;
  orders?: number;
  orderCount?: number;
  revenue?: number;
  sales?: number;
  rate?: string;
  commissionRate?: number;
  avatar?: string;
}

// ---------------- 地址 ----------------
export interface Address {
  id: string;
  name: string;
  phone: string;
  address?: string;
  detail?: string;
  area?: string;
  user?: string;
  isDefault?: boolean;
  type?: 'shipping' | 'receiving';
}

// ---------------- 财务 / 钱包 ----------------
export type FinanceCategory = 'sales' | 'income' | 'expense' | 'commission' | 'withdraw' | 'recharge';
export type TransactionType = 'income' | 'expense';

export interface FinanceRecord {
  id: string;
  type?: string;
  category: FinanceCategory | string;
  amount: number;
  time?: string;
  date?: string;
  description?: string;
  title?: string;
  icon?: string;
  userId?: string;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: TransactionType;
  icon?: string;
}

export interface Wallet {
  balance: number;
  frozenAmount?: number;
  totalIncome?: number;
  totalExpense?: number;
}

// ---------------- 物流 ----------------
export type LogisticsStatus = 'active' | 'inactive';

export interface LogisticsTemplate {
  id: string;
  name: string;
  desc?: string;
  description?: string;
  mode?: string;
  area?: string;
  date?: string;
  status?: LogisticsStatus;
}

export interface ShippingAddress {
  id: string;
  name: string;
  user?: string;
  phone: string;
  area: string;
  detail: string;
}

// ---------------- 营销 ----------------
export type MarketingActivityType = 'register' | 'invite' | 'coupon' | 'flashsale' | 'rebate';
export type MarketingActivityStatus = 'active' | 'inactive' | 'expired';

export interface MarketingActivity {
  id: string;
  name: string;
  type: MarketingActivityType | string;
  status?: MarketingActivityStatus | string;
  reward?: string;
  startDate?: string;
  endDate?: string;
}

export interface Coupon {
  id: string;
  title: string;
  discountType: 'amount' | 'percent' | 'shipping';
  amount?: number;
  percent?: number;
  minSpend?: number;
  validFrom?: string;
  validTo?: string;
  status?: 'unused' | 'used' | 'expired';
}

// ---------------- 用户 / 权限 ----------------
export type RoleType = '平台管理员' | '分销商' | '普通会员' | '高级管理员' | '普通用户';

export interface User {
  id: string;
  name: string;
  role: RoleType | string;
  date?: string;
  wechat?: string;
  phone?: string;
  avatar?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: RoleType | string;
  token: string;
  permissions?: string[];
}

export interface PermissionItem {
  name: string;
  type: 'parent' | 'child';
  admin: boolean;
  distro: boolean;
  member: boolean;
}
