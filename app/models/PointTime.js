// models/PointTime.js
const mongoose = require('mongoose');

const pointTimeSchema = new mongoose.Schema({
    pointLabel: String,
    timeInSeconds: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PointTime', pointTimeSchema);