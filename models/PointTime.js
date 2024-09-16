const mongoose = require('mongoose');

const pointTimeSchema = new mongoose.Schema({
    walltype: {
        type: String,
        enum: ['儿童', '成人']
    },
    pointLabel: String,
    timeInSeconds: Number,
    timestamp: { type: Date, default: Date.now },
    athleteName: String,
    bodyPart: {
        type: String,
        enum: ['左手', '右手', '左脚', '右脚']
    }
}, { collection: 'pointtimes' });

module.exports = mongoose.models.PointTime || mongoose.model('PointTime', pointTimeSchema);