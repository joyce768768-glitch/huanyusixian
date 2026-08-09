import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 路由导入
import authRoutes from './routes/auth';
import orderRoutes from './routes/orders';
import productRoutes from './routes/products';
import memberRoutes from './routes/members';
import distributorRoutes from './routes/distributors';
import financeRoutes from './routes/finance';
import logisticsRoutes from './routes/logistics';
import permissionRoutes from './routes/permissions';
import marketingRoutes from './routes/marketing';

// C 端用户专属路由
import addressesRoutes from './routes/addresses';
import cartRoutes from './routes/cart';
import favoritesRoutes from './routes/favorites';
import couponsRoutes from './routes/coupons';
import walletRoutes from './routes/wallet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// B 端 + C 端共用业务路由
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/distributors', distributorRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/marketing', marketingRoutes);

// C 端用户专属路由
app.use('/api/addresses', addressesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/wallet', walletRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   B端 Admin:     http://localhost:3000/  (Vite --mode admin)`);
  console.log(`   C端 Client:    http://localhost:3002/  (Vite --mode client)`);
  console.log(`   API 健康检查:  http://localhost:${PORT}/api/health`);
});
