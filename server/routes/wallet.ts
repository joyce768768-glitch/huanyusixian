import express from 'express';
import { walletData, walletTransactions, MY_PARTNERS_USER_ID } from '../data/mockData';

const router = express.Router();

// 钱包概览
router.get('/', (req, res) => {
  res.json({ success: true, data: walletData });
});

// 充值
router.post('/recharge', (req, res) => {
  const { amount } = req.body;
  const amt = Number(amount);
  if (!amt || amt <= 0) return res.status(400).json({ success: false, message: '金额非法' });
  walletData.balance += amt;
  walletData.totalIncome += amt;
  walletTransactions.unshift({
    id: `t-${Date.now()}`,
    title: `钱包充值 · ¥${amt}`,
    date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    amount: amt,
    type: 'income',
    icon: 'Wallet',
  });
  res.json({ success: true, data: { orderId: `RC-${Date.now()}` } });
});

// 提现
router.post('/withdraw', (req, res) => {
  const { amount, account } = req.body;
  const amt = Number(amount);
  if (!amt || amt <= 0) return res.status(400).json({ success: false, message: '金额非法' });
  if (amt > walletData.balance) return res.status(400).json({ success: false, message: '余额不足' });
  walletData.balance -= amt;
  walletData.totalExpense += amt;
  walletTransactions.unshift({
    id: `t-${Date.now()}`,
    title: `余额提现${account ? '至 ' + account : ''}`,
    date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    amount: -amt,
    type: 'expense',
    icon: 'CreditCard',
  });
  res.json({ success: true });
});

// 交易明细
router.get('/transactions', (req, res) => {
  const { type, page = 1, pageSize = 20 } = req.query;
  let list = [...walletTransactions];
  if (type) list = list.filter(t => t.type === type);
  const total = list.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const data = list.slice(start, start + Number(pageSize));
  res.json({ success: true, data, pagination: { total, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(total / Number(pageSize)) } });
});

export default router;
