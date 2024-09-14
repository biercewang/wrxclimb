import PointTime from '../../api/models/PointTime';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { pointLabel, timeInSeconds, athleteName, bodyPart } = req.body;
      const newPointTime = new PointTime({
        pointLabel,
        timeInSeconds,
        athleteName,
        bodyPart
      });
      await newPointTime.save();
      res.status(201).json(newPointTime);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else if (req.method === 'GET') {
    // ... 处理 GET 请求
  }
}