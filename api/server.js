//server.js
const express = require('express');
const next = require('next');
const mongoose = require('mongoose');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDB 连接
const MONGODB_URI = 'mongodb://localhost:27017/myDatabase'; // 根据实际情况修改数据库名

mongoose.connect(MONGODB_URI, {
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// app.prepare().then(() => {
//   const server = express();

//   // 这里可以设置您的 Express 路由
//   server.get('/api/hello', (req, res) => {
//     res.send('Hello World!');
//   });

//   // 处理所有其他 Next.js 的服务请求
//   server.all('*', (req, res) => {
//     return handle(req, res);
//   });

//   server.listen(port, (err) => {
//     if (err) throw err;
//     console.log(`> Ready on http://localhost:${port}`);
//   });
// });

app.prepare().then(() => {
  const server = express();

  // 引入模型
  const PointTime = require('./models/PointTime');

  server.use(express.json()); // 放在所有路由定义之前

  // API 路由
  server.get('/api/hello', (req, res) => {
    res.send('Hello World!');
  });

  server.get('/api/point-times', async (req, res) => {
    try {
      const pointTimes = await PointTime.find({});
      res.json(pointTimes);
    } catch (error) {
      console.error('Error fetching point times:', error);
      res.status(500).json({ message: 'Failed to fetch point times' });
    }
  });

  server.post('/api/point-times', async (req, res) => {
    try {
        const { pointLabel, timeInSeconds } = req.body;
        const newPointTime = new PointTime({ pointLabel, timeInSeconds });
        await newPointTime.save();
        res.status(201).json(newPointTime);  // 确保返回新创建的对象
    } catch (error) {
        console.error('Error saving point time:', error);
        res.status(500).json({ message: 'Failed to save point time data' });
    }
});

  server.put('/api/point-times/:id', async (req, res) => {
    try {
      const { pointLabel, timeInSeconds } = req.body;
      const update = { pointLabel, timeInSeconds };
      const pointTime = await PointTime.findByIdAndUpdate(req.params.id, update, { new: true });
      if (!pointTime) {
        return res.status(404).json({ message: 'Point time not found' });
      }
      res.json(pointTime);
    } catch (error) {
      console.error('Error updating point time:', error);
      res.status(500).json({ message: 'Failed to update point time' });
    }
  });

  server.delete('/api/point-times/:id', async (req, res) => {
    try {
      const pointTime = await PointTime.findByIdAndRemove(req.params.id);
      if (!pointTime) {
        return res.status(404).json({ message: 'Point time not found' });
      }
      res.json({ message: 'Point time deleted successfully' });
    } catch (error) {
      console.error('Error deleting point time:', error);
      res.status(500).json({ message: 'Failed to delete point time' });
    }
  });

  //该岩点历史信息
  server.get('/api/point-times/:label', async (req, res) => {
    try {
        const pointLabel = req.params.label;
        const pointTimes = await PointTime.find({ pointLabel });
        res.json(pointTimes);
    } catch (error) {
        console.error('Error fetching point times for label:', error);
        res.status(500).json({ message: 'Failed to fetch point times for label' });
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