// 向后兼容：B 端代码不改引用路径，底层统一用 shared/api
export {
  authAPI,
  productAPI,
  orderAPI,
  memberAPI,
  distributorAPI,
  financeAPI,
  logisticsAPI,
  permissionAPI,
  marketingAPI,
  type APIResult,
} from '@shared/api';
