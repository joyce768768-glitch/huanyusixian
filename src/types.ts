export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  tag: string;
  category?: string;
  isFavorite?: boolean;
}

export interface OrderItem {
  id: string;
  title: string;
  specs: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending_payment' | 'pending_delivery' | 'completed';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  itemCount: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'expense' | 'income';
  icon: string;
}

export interface DistributorPartner {
  id: string;
  name: string;
  joinDate: string;
  sales: number;
  orderCount: number;
  level: '高级伙伴' | '普通伙伴';
  avatar: string;
}
