//server.js
const express = require('express');
const next = require('next');
const mongoose = require('mongoose');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 更新 MongoDB 连接字符串
const MONGODB_URI = 'mongodb://localhost:27017/climbingWall'; // 修改为新的数据库名

mongoose.connect(MONGODB_URI, {
}).then(() => console.log("MongoDB connected to climbingWall database"))
  .catch(err => console.log("MongoDB connection error:", err));

app.prepare().then(() => {
  const server = express();

  // 更新模型导入路径
  const PointTime = require('../models/PointTime');

  server.use(express.json());

  // API 路由
  server.get('/api/hello', (req, res) => {
    res.send('Hello World!');
  });

  server.get('/api/climbing-records', async (req, res) => {
    try {
      const pointTimes = await PointTime.find({}).sort({ timestamp: -1 });
      res.json(pointTimes);
    } catch (error) {
      console.error('Error fetching climbing records:', error);
      res.status(500).json({ message: 'Failed to fetch climbing records' });
    }
  });

  server.post('/api/climbing-records', async (req, res) => {
    try {
        const { pointLabel, timeInSeconds, athleteName, bodyPart } = req.body;
        const newPointTime = new PointTime({ pointLabel, timeInSeconds, athleteName, bodyPart });
        await newPointTime.save();
        res.status(201).json(newPointTime);
    } catch (error) {
        console.error('Error saving climbing record:', error);
        res.status(500).json({ message: 'Failed to save climbing record data' });
    }
  });

  server.put('/api/climbing-records/:id', async (req, res) => {
    try {
      const { pointLabel, timeInSeconds, athleteName, bodyPart } = req.body;
      const update = { pointLabel, timeInSeconds, athleteName, bodyPart };
      const pointTime = await PointTime.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!pointTime) {
        return res.status(404).json({ message: 'Climbing record not found' });
      }
      res.json(pointTime);
    } catch (error) {
      console.error('Error updating climbing record:', error);
      res.status(500).json({ message: 'Failed to update climbing record' });
    }
  });

  server.delete('/api/climbing-records/:id', async (req, res) => {
    try {
      console.log('Attempting to delete record with ID:', req.params.id);
      console.log('PointTime model methods:', Object.keys(PointTime));
      const pointTime = await PointTime.findByIdAndDelete(req.params.id);
      if (!pointTime) {
        return res.status(404).json({ message: '未找到记录' });
      }
      console.log(`成功删除记录，ID: ${req.params.id}`); // 添加服务器端日志
      res.json({ message: '记录删除成功', id: req.params.id });
    } catch (error) {
      console.error('删除记录时出错:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: '删除记录失败', id: req.params.id, error: error.message });
    }
  });

  server.get('/api/climbing-records/:label', async (req, res) => {
    try {
        const pointLabel = req.params.label;
        const pointTimes = await PointTime.find({ pointLabel }).sort({ timestamp: -1 });
        res.json(pointTimes);
    } catch (error) {
        console.error('Error fetching climbing records for label:', error);
        res.status(500).json({ message: 'Failed to fetch climbing records for label' });
    }
  });

  // 处理所有其他 Next.js 的服务请求
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});