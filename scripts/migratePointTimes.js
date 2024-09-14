const mongoose = require('mongoose');
const PointTime = require('../models/PointTime');

// 明确指定使用 climbingWall 数据库
const MONGODB_URI = 'mongodb://localhost:27017/climbingWall';

console.log('Connecting to MongoDB...');
console.log('Connection string:', MONGODB_URI);

mongoose.connect(MONGODB_URI, { 
  serverSelectionTimeoutMS: 5000 // 5 秒超时
})
.then(() => {
  console.log('Connected to MongoDB');
  setupDatabase();
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

async function setupDatabase() {
  try {
    // 确保我们连接到了正确的数据库
    console.log(`Connected to database: ${mongoose.connection.name}`);
    
    // 创建一些示例数据
    const sampleData = [
      { pointLabel: 'R1A1', timeInSeconds: 5.2, athleteName: '张三', bodyPart: '右手' },
      { pointLabel: 'L2B3', timeInSeconds: 3.7, athleteName: '李四', bodyPart: '左脚' },
      { pointLabel: 'R3C2', timeInSeconds: 4.5, athleteName: '王五', bodyPart: '左手' },
    ];

    console.log('Creating sample data...');
    for (let data of sampleData) {
      const newPointTime = new PointTime(data);
      await newPointTime.save();
      console.log(`Created point time: ${newPointTime._id}`);
    }

    console.log('Database setup complete');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}