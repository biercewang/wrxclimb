// models/PointTime.js
const mongoose = require('mongoose');

const pointTimeSchema = new mongoose.Schema({
    pointLabel: String,
    timeInSeconds: Number,
    timestamp: { type: Date, default: Date.now }
}, { collection: 'pointtimes' }); // 确保这里使用的是实际存在的集合名称

module.exports = mongoose.model('PointTime', pointTimeSchema);