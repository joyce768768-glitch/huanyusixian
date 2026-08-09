import express from 'express';
import { users, permissions } from '../data/mockData';

const router = express.Router();

// 获取用户列表
router.get('/users', (req, res) => {
  const { role, keyword, startDate, endDate, page = 1, pageSize = 10 } = req.query;
  
  let filteredUsers = [...users];
  
  // 角色筛选
  if (role && role !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.role === role);
  }
  
  // 关键词搜索
  if (keyword) {
    const kw = String(keyword).toLowerCase();
    filteredUsers = filteredUsers.filter(u => 
      u.name.toLowerCase().includes(kw) || 
      u.id.toLowerCase().includes(kw)
    );
  }
  
  // 日期范围筛选
  if (startDate) {
    filteredUsers = filteredUsers.filter(u => u.date >= String(startDate));
  }
  if (endDate) {
    filteredUsers = filteredUsers.filter(u => u.date <= String(endDate));
  }
  
  // 分页
  const total = filteredUsers.length;
  const start = (Number(page) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  const paginatedUsers = filteredUsers.slice(start, end);
  
  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    },
  });
});

// 获取用户详情
router.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (user) {
    res.json({
      success: true,
      data: user,
    });
  } else {
    res.status(404).json({ success: false, message: '用户不存在' });
  }
});

// 创建用户
router.post('/users', (req, res) => {
  const { name, wechat, role } = req.body;
  
  if (!name || !wechat) {
    return res.status(400).json({ success: false, message: '缺少必要参数' });
  }
  
  const newUser = {
    id: `USR-${Date.now()}`,
    name,
    wechat,
    role: role || '普通会员',
    date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().slice(0, 5),
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    data: newUser,
  });
});

// 更新用户角色
router.put('/users/:id/role', (req, res) => {
  const { role } = req.body;
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  users[userIndex].role = role;
  
  res.json({
    success: true,
    data: users[userIndex],
  });
});

// 删除用户
router.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedUser,
  });
});

// 获取权限列表
router.get('/list', (req, res) => {
  res.json({
    success: true,
    data: permissions,
  });
});

export default router;
