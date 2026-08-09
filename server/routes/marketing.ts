import express from 'express';
import { marketingActivities } from '../data/mockData';

const router = express.Router();

// 获取营销活动列表
router.get('/activities', (req, res) => {
  const { status, type, page = 1, pageSize = 10 } = req.query;
  
  let filteredActivities = [...marketingActivities];
  
  // 状态筛选
  if (status && status !== 'all') {
    filteredActivities = filteredActivities.filter(a => a.status === status);
  }
  
  // 类型筛选
  if (type && type !== 'all') {
    filteredActivities = filteredActivities.filter(a => a.type === type);
  }
  
  // 分页
  const total = filteredActivities.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  const paginatedActivities = filteredActivities.slice(start, end);
  
  res.json({
    success: true,
    data: paginatedActivities,
    pagination: {
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    },
  });
});

// 获取营销活动详情
router.get('/activities/:id', (req, res) => {
  const activity = marketingActivities.find(a => a.id === req.params.id);
  
  if (activity) {
    res.json({
      success: true,
      data: activity,
    });
  } else {
    res.status(404).json({ success: false, message: '活动不存在' });
  }
});

// 创建营销活动
router.post('/activities', (req, res) => {
  const { name, type, reward, startDate, endDate } = req.body;
  
  if (!name || !type) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  
  const newActivity = {
    id: `MKT-${Date.now()}`,
    name,
    type,
    status: 'active' as const,
    reward: reward || '',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
  
  marketingActivities.push(newActivity);
  
  res.json({
    success: true,
    data: newActivity,
  });
});

// 更新营销活动
router.put('/activities/:id', (req, res) => {
  const { name, type, reward, status, startDate, endDate } = req.body;
  const activityIndex = marketingActivities.findIndex(a => a.id === req.params.id);
  
  if (activityIndex === -1) {
    return res.status(404).json({ success: false, message: '活动不存在' });
  }
  
  if (name) marketingActivities[activityIndex].name = name;
  if (type) marketingActivities[activityIndex].type = type;
  if (reward) marketingActivities[activityIndex].reward = reward;
  if (status) marketingActivities[activityIndex].status = status;
  if (startDate) marketingActivities[activityIndex].startDate = startDate;
  if (endDate) marketingActivities[activityIndex].endDate = endDate;
  
  res.json({
    success: true,
    data: marketingActivities[activityIndex],
  });
});

// 删除营销活动
router.delete('/activities/:id', (req, res) => {
  const activityIndex = marketingActivities.findIndex(a => a.id === req.params.id);
  
  if (activityIndex === -1) {
    return res.status(404).json({ success: false, message: '活动不存在' });
  }
  
  const deletedActivity = marketingActivities.splice(activityIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedActivity,
  });
});

export default router;
