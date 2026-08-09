// 向后兼容：C端旧的类型引用，统一重定向到 shared/types
export {
  type Product,
  type OrderItem,
  type OrderStatus,
  OrderStatusLabel,
  type Order,
  type Address,
  type Transaction,
  type Distributor,
  type Distributor as DistributorPartner,
  type Coupon,
  type Wallet,
  type Member,
} from '../../shared/types';
