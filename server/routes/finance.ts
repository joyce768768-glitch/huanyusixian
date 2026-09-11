import express from 'express';
import { financeRecords } from '../data/mockData';

const router = express.Router();

// 获取财务记录列表
router.get('/', (req, res) => {
  const { category, keyword, startDate, endDate, page = 1, pageSize = 10 } = req.query;
  
  let filteredRecords = [...financeRecords];
  
  // 分类筛选（category 字段为 income/expense）
  if (category && category !== 'all') {
    filteredRecords = filteredRecords.filter(r => r.category === category);
  }
  
  // 关键词搜索
  if (keyword) {
    const kw = String(keyword).toLowerCase();
    filteredRecords = filteredRecords.filter(r => 
      r.type.toLowerCase().includes(kw) || 
      r.description.toLowerCase().includes(kw)
    );
  }
  
  // 日期范围筛选
  if (startDate) {
    filteredRecords = filteredRecords.filter(r => r.time >= String(startDate));
  }
  if (endDate) {
    filteredRecords = filteredRecords.filter(r => r.time <= String(endDate));
  }
  
  // 分页
  const total = filteredRecords.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  const paginatedRecords = filteredRecords.slice(start, end);
  
  // 计算汇总
  const summary = {
    totalIncome: filteredRecords.filter(r => r.amount > 0).reduce((sum, r) => sum + r.amount, 0),
    totalExpense: Math.abs(filteredRecords.filter(r => r.amount < 0).reduce((sum, r) => sum + r.amount, 0)),
    netProfit: filteredRecords.reduce((sum, r) => sum + r.amount, 0),
  };
  
  res.json({
    success: true,
    data: paginatedRecords,
    summary,
    pagination: {
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    },
  });
});

// 创建财务记录
router.post('/', (req, res) => {
  const { type, amount, description } = req.body;
  
  if (!type || amount === undefined) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  
  const newRecord = {
    id: `FIN-${Date.now()}`,
    type,
    category: amount > 0 ? 'income' : 'expense',
    amount: Number(amount),
    time: new Date().toISOString().split('T')[0],
    description: description || '',
  };
  
  financeRecords.push(newRecord);
  
  res.json({
    success: true,
    data: newRecord,
  });
});

export default router;
