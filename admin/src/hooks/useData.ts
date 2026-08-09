import { useState, useEffect } from 'react';
import { 
  orderAPI, 
  productAPI, 
  memberAPI, 
  distributorAPI, 
  financeAPI, 
  logisticsAPI, 
  permissionAPI,
  marketingAPI 
} from '../api';

// 通用数据获取Hook
export const useData = <T>(
  fetchFunction: () => Promise<{ success: boolean; data?: T; message?: string; pagination?: any }>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      if (result.success) {
        setData(result.data || null);
        setPagination(result.pagination || null);
      } else {
        setError(result.message || '获取数据失败');
      }
    } catch (err) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, pagination, refetch: fetchData };
};

// 订单数据Hook
export const useOrders = (params?: { status?: string; keyword?: string; page?: number; pageSize?: number }) => {
  return useData(() => orderAPI.getOrders(params), [params]);
};

// 商品数据Hook
export const useProducts = (params?: { category?: string; keyword?: string; page?: number; pageSize?: number }) => {
  return useData(() => productAPI.getProducts(params), [params]);
};

// 会员数据Hook
export const useMembers = (params?: { level?: string; keyword?: string; page?: number; pageSize?: number }) => {
  return useData(() => memberAPI.getMembers(params), [params]);
};

// 分销商数据Hook
export const useDistributors = (params?: { level?: string; status?: string; keyword?: string; page?: number; pageSize?: number }) => {
  return useData(() => distributorAPI.getDistributors(params), [params]);
};

// 财务数据Hook
export const useFinanceRecords = (params?: { category?: string; keyword?: string; startDate?: string; endDate?: string; page?: number; pageSize?: number }) => {
  return useData(() => financeAPI.getRecords(params), [params]);
};

// 物流模板数据Hook
export const useLogisticsTemplates = (params?: { status?: string; keyword?: string; page?: number; pageSize?: number }) => {
  return useData(() => logisticsAPI.getTemplates(params), [params]);
};

// 发货地址数据Hook
export const useShippingAddresses = () => {
  return useData(() => logisticsAPI.getShippingAddresses(), []);
};

// 用户数据Hook
export const useUsers = (params?: { role?: string; keyword?: string; startDate?: string; endDate?: string; page?: number; pageSize?: number }) => {
  return useData(() => permissionAPI.getUsers(params), [params]);
};

// 权限列表Hook
export const usePermissions = () => {
  return useData(() => permissionAPI.getPermissions(), []);
};

// 营销活动数据Hook
export const useMarketingActivities = (params?: { status?: string; type?: string; page?: number; pageSize?: number }) => {
  return useData(() => marketingAPI.getActivities(params), [params]);
};
