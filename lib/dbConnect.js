// lib/dbConnect.js
const mongoose = require('mongoose');


// 使用环境变量来决定使用哪个数据库连接字符串
const MONGODB_URI = process.env.USE_REMOTE_DB === 'true'
  ? process.env.MONGODB_ATLAS_URI
  : process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/climbingWall';

console.log('USE_REMOTE_DB:', process.env.USE_REMOTE_DB);
console.log('Selected MONGODB_URI:', MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error(
    '请在 .env.local 文件中定义 MONGODB_LOCAL_URI 和 MONGODB_ATLAS_URI 环境变量'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = dbConnect;