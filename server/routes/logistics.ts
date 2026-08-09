import express from 'express';
import { logisticsTemplates, shippingAddresses } from '../data/mockData';

const router = express.Router();

// 获取物流模板列表
router.get('/templates', (req, res) => {
  const { status, keyword, page = 1, pageSize = 10 } = req.query;
  
  let filteredTemplates = [...logisticsTemplates];
  
  // 状态筛选
  if (status && status !== 'all') {
    filteredTemplates = filteredTemplates.filter(t => t.status === status);
  }
  
  // 关键词搜索
  if (keyword) {
    const kw = String(keyword).toLowerCase();
    filteredTemplates = filteredTemplates.filter(t => 
      t.name.toLowerCase().includes(kw) || 
      t.desc.toLowerCase().includes(kw)
    );
  }
  
  // 分页
  const total = filteredTemplates.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  const paginatedTemplates = filteredTemplates.slice(start, end);
  
  res.json({
    success: true,
    data: paginatedTemplates,
    pagination: {
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    },
  });
});

// 获取物流模板详情
router.get('/templates/:id', (req, res) => {
  const template = logisticsTemplates.find(t => t.id === req.params.id);
  
  if (template) {
    res.json({
      success: true,
      data: template,
    });
  } else {
    res.status(404).json({ success: false, message: '模板不存在' });
  }
});

// 创建物流模板
router.post('/templates', (req, res) => {
  const { name, desc, mode, area } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  
  const newTemplate = {
    id: `LOG-${Date.now()}`,
    name,
    desc: desc || '',
    mode: mode || '按重量 (Weight-based)',
    area: area || '全国大部分地区',
    date: new Date().toISOString().split('T')[0],
    status: 'active',
  };
  
  logisticsTemplates.push(newTemplate);
  
  res.json({
    success: true,
    data: newTemplate,
  });
});

// 更新物流模板
router.put('/templates/:id', (req, res) => {
  const { name, desc, mode, area, status } = req.body;
  const templateIndex = logisticsTemplates.findIndex(t => t.id === req.params.id);
  
  if (templateIndex === -1) {
    return res.status(404).json({ success: false, message: '模板不存在' });
  }
  
  if (name) logisticsTemplates[templateIndex].name = name;
  if (desc) logisticsTemplates[templateIndex].desc = desc;
  if (mode) logisticsTemplates[templateIndex].mode = mode;
  if (area) logisticsTemplates[templateIndex].area = area;
  if (status !== undefined) logisticsTemplates[templateIndex].status = status;
  
  res.json({
    success: true,
    data: logisticsTemplates[templateIndex],
  });
});

// 删除物流模板
router.delete('/templates/:id', (req, res) => {
  const templateIndex = logisticsTemplates.findIndex(t => t.id === req.params.id);
  
  if (templateIndex === -1) {
    return res.status(404).json({ success: false, message: '模板不存在' });
  }
  
  const deletedTemplate = logisticsTemplates.splice(templateIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTemplate,
  });
});

// 获取发货地址列表
router.get('/addresses', (req, res) => {
  res.json({
    success: true,
    data: shippingAddresses,
  });
});

// 创建发货地址
router.post('/addresses', (req, res) => {
  const { name, user, phone, area, detail } = req.body;
  
  if (!name || !user || !phone || !area || !detail) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  
  const newAddress = {
    id: `ADDR-${Date.now()}`,
    name,
    user,
    phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    area,
    detail,
  };
  
  shippingAddresses.push(newAddress);
  
  res.json({
    success: true,
    data: newAddress,
  });
});

// 更新发货地址
router.put('/addresses/:id', (req, res) => {
  const { name, user, phone, area, detail } = req.body;
  const addressIndex = shippingAddresses.findIndex(a => a.id === req.params.id);
  
  if (addressIndex === -1) {
    return res.status(404).json({ success: false, message: '地址不存在' });
  }
  
  if (name) shippingAddresses[addressIndex].name = name;
  if (user) shippingAddresses[addressIndex].user = user;
  if (phone) shippingAddresses[addressIndex].phone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  if (area) shippingAddresses[addressIndex].area = area;
  if (detail) shippingAddresses[addressIndex].detail = detail;
  
  res.json({
    success: true,
    data: shippingAddresses[addressIndex],
  });
});

// 删除发货地址
router.delete('/addresses/:id', (req, res) => {
  const addressIndex = shippingAddresses.findIndex(a => a.id === req.params.id);
  
  if (addressIndex === -1) {
    return res.status(404).json({ success: false, message: '地址不存在' });
  }
  
  const deletedAddress = shippingAddresses.splice(addressIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedAddress,
  });
});

export default router;
