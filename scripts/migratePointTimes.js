const mongoose = require('mongoose');
const PointTime = require('../api/models/PointTime');

// 替换为您的实际 MongoDB 连接字符串
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

console.log('Connecting to MongoDB...');
console.log('Connection string:', MONGODB_URI);

mongoose.connect(MONGODB_URI, { 
  serverSelectionTimeoutMS: 5000 // 5 秒超时
})
.then(() => {
  console.log('Connected to MongoDB');
  migrateData();
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

async function migrateData() {
  try {
    console.log('Fetching point times...');
    const pointTimes = await PointTime.find({});
    console.log(`Found ${pointTimes.length} point times`);

    for (let pointTime of pointTimes) {
      if (!pointTime.athleteName) {
        pointTime.athleteName = '未知运动员';
      }
      if (!pointTime.bodyPart) {
        pointTime.bodyPart = '右手';
      }
      await pointTime.save();
      console.log(`Updated point time: ${pointTime._id}`);
    }
    console.log('数据迁移完成');
  } catch (error) {
    console.error('迁移过程中出错:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}