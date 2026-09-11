import type {
  Product,
  Order,
  OrderStatus,
  Member,
  Distributor,
  FinanceRecord,
  LogisticsTemplate,
  ShippingAddress,
  User,
  PermissionItem,
  MarketingActivity,
  Address,
  Coupon,
  Transaction,
  Wallet,
} from '../types';

// ================================================================
// 寰宇思贤统一 API 客户端（B端后台 + C端小程序 共用）
// 开发环境默认走 Vite 代理 /api -> Express(4000)，生产环境 VITE_API_URL 配置
// ================================================================

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const DEFAULT_TIMEOUT = 15000;

// -------- 通用请求封装（带超时 + 统一错误结构） --------
export interface APIResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<APIResult<T>> => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  const reqPromise = fetch(`${API_BASE_URL}${url}`, {
    ...config,
    signal: controller.signal,
  });

  try {
    const response = await reqPromise;
    clearTimeout(timeoutId);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return { success: false, message: `${response.status} ${response.statusText}${text ? ' - ' + text.slice(0, 80) : ''}` };
    }
    const result = (await response.json()) as APIResult<T>;
    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError') {
      return { success: false, message: '请求超时，请重试' };
    }
    console.error('[API Error]', url, error);
    return { success: false, message: '网络错误，请稍后重试' };
  }
};

// ================================================================
// 1. 认证
// ================================================================
export const authAPI = {
  login: (username: string, password: string): Promise<APIResult<{ token: string; user: User }>> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getCurrentUser: (): Promise<APIResult<User>> => request('/auth/me'),
  clientLogin: (phone: string, code: string): Promise<APIResult<{ token: string; user: User }>> =>
    request('/auth/client-login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),
  checkAdminAccess: (): Promise<APIResult<{ hasAccess: boolean; role: string; adminUrl: string | null }>> =>
    request('/auth/admin-access'),
};

// ================================================================
// 2. 商品（B + C 共用）
// ================================================================
export const productAPI = {
  getProducts: (params?: {
    category?: string;
    keyword?: string;
    tag?: string;
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<Product[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/products?${query}`);
  },
  getProductById: (id: string): Promise<APIResult<Product>> => request(`/products/${id}`),
  createProduct: (data: Partial<Product> & { name: string; category?: string; price: number }): Promise<APIResult<Product>> =>
    request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Product>): Promise<APIResult<Product>> =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleProductStatus: (id: string, status: 'online' | 'offline'): Promise<APIResult<Product>> =>
    request(`/products/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  deleteProduct: (id: string): Promise<APIResult<void>> =>
    request(`/products/${id}`, { method: 'DELETE' }),
};

// ================================================================
// 3. 订单（B + C 共用）
// ================================================================
export const orderAPI = {
  getOrders: (params?: {
    status?: OrderStatus | string;
    keyword?: string;
    userId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<Order[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/orders?${query}`);
  },
  getOrderById: (id: string): Promise<APIResult<Order>> => request(`/orders/${id}`),
  updateOrderStatus: (id: string, status: OrderStatus | string): Promise<APIResult<Order>> =>
    request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  createOrder: (data: {
    items: { productId: string; quantity: number; specs?: string }[];
    addressId?: string;
    couponId?: string;
    remark?: string;
  }): Promise<APIResult<Order>> =>
    request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  payOrder: (id: string, payMethod: 'wallet' | 'wechat' | 'alipay' = 'wechat'): Promise<APIResult<Order>> =>
    request(`/orders/${id}/pay`, { method: 'POST', body: JSON.stringify({ payMethod }) }),
  cancelOrder: (id: string): Promise<APIResult<void>> =>
    request(`/orders/${id}/cancel`, { method: 'POST' }),
  confirmReceive: (id: string): Promise<APIResult<Order>> =>
    request(`/orders/${id}/receive`, { method: 'POST' }),
};

// ================================================================
// 4. 会员
// ================================================================
export const memberAPI = {
  getMembers: (params?: {
    level?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<Member[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/members?${query}`);
  },
  getMemberById: (id: string): Promise<APIResult<Member>> => request(`/members/${id}`),
  getCurrentMember: (): Promise<APIResult<Member>> => request('/members/me'),
  createMember: (data: Partial<Member> & { name: string; phone: string }): Promise<APIResult<Member>> =>
    request('/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMemberLevel: (id: string, level: string): Promise<APIResult<Member>> =>
    request(`/members/${id}/level`, { method: 'PUT', body: JSON.stringify({ level }) }),
  joinMembership: (planId?: string): Promise<APIResult<{ member: Member; expireDate: string }>> =>
    request('/members/join', { method: 'POST', body: JSON.stringify({ planId }) }),
};

// ================================================================
// 5. 分销商（B 端全量管理 + C端我的伙伴）
// ================================================================
export const distributorAPI = {
  getDistributors: (params?: {
    level?: string;
    status?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<Distributor[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/distributors?${query}`);
  },
  getDistributorById: (id: string): Promise<APIResult<Distributor>> => request(`/distributors/${id}`),
  createDistributor: (data: Partial<Distributor> & { name: string; phone?: string }): Promise<APIResult<Distributor>> =>
    request('/distributors', { method: 'POST', body: JSON.stringify(data) }),
  updateDistributor: (id: string, data: Partial<Distributor>): Promise<APIResult<Distributor>> =>
    request(`/distributors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  // C 端：我发展的下级伙伴
  getMyPartners: (params?: { level?: string; page?: number; pageSize?: number }): Promise<APIResult<Distributor[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/distributors/my-partners?${query}`);
  },
  // C 端：获取我的邀请码
  getMyInviteCode: (): Promise<APIResult<{ inviteCode: string; inviter: string }>> =>
    request('/distributors/my-invite-code'),
  // C 端：申请成为分销商
  apply: (data: { name: string; phone: string; wechat?: string; inviterCode?: string }): Promise<APIResult<Distributor>> =>
    request('/distributors/apply', { method: 'POST', body: JSON.stringify(data) }),
};

// ================================================================
// 6. 财务 / 钱包
// ================================================================
export const financeAPI = {
  getRecords: (params?: {
    category?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<FinanceRecord[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/finance?${query}`);
  },
  createRecord: (data: Partial<FinanceRecord> & { amount: number; category?: string }): Promise<APIResult<FinanceRecord>> =>
    request('/finance', { method: 'POST', body: JSON.stringify(data) }),
};

// C 端：我的钱包
export const walletAPI = {
  getWallet: (): Promise<APIResult<Wallet>> => request('/wallet'),
  recharge: (amount: number, payMethod: string = 'wechat'): Promise<APIResult<{ orderId: string }>> =>
    request('/wallet/recharge', { method: 'POST', body: JSON.stringify({ amount, payMethod }) }),
  withdraw: (amount: number, account: string): Promise<APIResult<void>> =>
    request('/wallet/withdraw', { method: 'POST', body: JSON.stringify({ amount, account }) }),
  getTransactions: (params?: {
    type?: 'income' | 'expense';
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<Transaction[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/wallet/transactions?${query}`);
  },
};

// ================================================================
// 7. 物流
// ================================================================
export const logisticsAPI = {
  getTemplates: (params?: {
    status?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<LogisticsTemplate[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/logistics/templates?${query}`);
  },
  getTemplateById: (id: string): Promise<APIResult<LogisticsTemplate>> =>
    request(`/logistics/templates/${id}`),
  createTemplate: (data: Partial<LogisticsTemplate> & { name: string }): Promise<APIResult<LogisticsTemplate>> =>
    request('/logistics/templates', { method: 'POST', body: JSON.stringify(data) }),
  updateTemplate: (id: string, data: Partial<LogisticsTemplate>): Promise<APIResult<LogisticsTemplate>> =>
    request(`/logistics/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTemplate: (id: string): Promise<APIResult<void>> =>
    request(`/logistics/templates/${id}`, { method: 'DELETE' }),
  // B端：发货地址（仓库）
  getShippingAddresses: (): Promise<APIResult<ShippingAddress[]>> => request('/logistics/addresses'),
  createShippingAddress: (data: Omit<ShippingAddress, 'id'>): Promise<APIResult<ShippingAddress>> =>
    request('/logistics/addresses', { method: 'POST', body: JSON.stringify(data) }),
  updateShippingAddress: (id: string, data: Partial<ShippingAddress>): Promise<APIResult<ShippingAddress>> =>
    request(`/logistics/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteShippingAddress: (id: string): Promise<APIResult<void>> =>
    request(`/logistics/addresses/${id}`, { method: 'DELETE' }),
};

// ================================================================
// 8. 权限管理
// ================================================================
export const permissionAPI = {
  getUsers: (params?: {
    role?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<User[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/permissions/users?${query}`);
  },
  getUserById: (id: string): Promise<APIResult<User>> => request(`/permissions/users/${id}`),
  createUser: (data: Partial<User> & { name: string; wechat?: string; role?: string }): Promise<APIResult<User>> =>
    request('/permissions/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUserRole: (id: string, role: string): Promise<APIResult<User>> =>
    request(`/permissions/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id: string): Promise<APIResult<void>> =>
    request(`/permissions/users/${id}`, { method: 'DELETE' }),
  getPermissions: (): Promise<APIResult<PermissionItem[]>> => request('/permissions/list'),
};

// ================================================================
// 9. 营销 / 优惠券
// ================================================================
export const marketingAPI = {
  getActivities: (params?: {
    status?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<APIResult<MarketingActivity[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/marketing/activities?${query}`);
  },
  getActivityById: (id: string): Promise<APIResult<MarketingActivity>> =>
    request(`/marketing/activities/${id}`),
  createActivity: (data: Partial<MarketingActivity> & { name: string; type: string }): Promise<APIResult<MarketingActivity>> =>
    request('/marketing/activities', { method: 'POST', body: JSON.stringify(data) }),
  updateActivity: (id: string, data: Partial<MarketingActivity>): Promise<APIResult<MarketingActivity>> =>
    request(`/marketing/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteActivity: (id: string): Promise<APIResult<void>> =>
    request(`/marketing/activities/${id}`, { method: 'DELETE' }),
};

// C 端：我的优惠券
export const couponAPI = {
  getMyCoupons: (params?: { status?: 'unused' | 'used' | 'expired' }): Promise<APIResult<Coupon[]>> => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/coupons?${query}`);
  },
  receive: (activityId: string): Promise<APIResult<Coupon>> =>
    request(`/coupons/receive`, { method: 'POST', body: JSON.stringify({ activityId }) }),
  receiveNewUserGift: (): Promise<APIResult<Coupon[]>> =>
    request(`/coupons/new-user-gift`, { method: 'POST' }),
};

// ================================================================
// 10. C 端用户专属
// ================================================================

// 收货地址（用户端，和 /logistics/addresses 的"仓库发货地址"概念区分）
export const addressAPI = {
  getAddresses: (): Promise<APIResult<Address[]>> => request('/addresses'),
  getAddressById: (id: string): Promise<APIResult<Address>> => request(`/addresses/${id}`),
  createAddress: (data: Omit<Address, 'id'>): Promise<APIResult<Address>> =>
    request('/addresses', { method: 'POST', body: JSON.stringify(data) }),
  updateAddress: (id: string, data: Partial<Address>): Promise<APIResult<Address>> =>
    request(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAddress: (id: string): Promise<APIResult<void>> =>
    request(`/addresses/${id}`, { method: 'DELETE' }),
  setDefault: (id: string): Promise<APIResult<Address>> =>
    request(`/addresses/${id}/default`, { method: 'POST' }),
};

// 收藏夹
export const favoriteAPI = {
  getFavorites: (): Promise<APIResult<Product[]>> => request('/favorites'),
  add: (productId: string): Promise<APIResult<Product>> =>
    request('/favorites', { method: 'POST', body: JSON.stringify({ productId }) }),
  remove: (productId: string): Promise<APIResult<void>> =>
    request(`/favorites/${productId}`, { method: 'DELETE' }),
  toggle: (productId: string): Promise<APIResult<{ isFavorite: boolean }>> =>
    request('/favorites/toggle', { method: 'POST', body: JSON.stringify({ productId }) }),
};

// 购物车
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  specs?: string;
  selected?: boolean;
  addedAt?: string;
}

export const cartAPI = {
  getCart: (): Promise<APIResult<CartItem[]>> => request('/cart'),
  add: (productId: string, quantity: number = 1, specs?: string): Promise<APIResult<CartItem[]>> =>
    request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity, specs }) }),
  updateQuantity: (itemId: string, quantity: number): Promise<APIResult<CartItem[]>> =>
    request(`/cart/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  remove: (itemId: string): Promise<APIResult<CartItem[]>> =>
    request(`/cart/${itemId}`, { method: 'DELETE' }),
  clear: (): Promise<APIResult<void>> => request('/cart', { method: 'DELETE' }),
  getCount: (): Promise<APIResult<{ count: number }>> => request('/cart/count'),
  // 结算（直接生成订单）
  checkout: (data: {
    itemIds?: string[];
    addressId?: string;
    couponId?: string;
    remark?: string;
  }): Promise<APIResult<Order>> =>
    request('/cart/checkout', { method: 'POST', body: JSON.stringify(data) }),
};
