const { getRedis } = require('../../lib/redis.js');
module.exports = async function handler(req, res) {
  const { address } = req.query;
  const redis = await getRedis();
  const keys = await redis.keys(`inbox:${address.toLowerCase()}:*`);
  if (!keys.length) return res.json([]);
  const messages = await Promise.all(keys.map(k => redis.get(k)));
  const parsed = messages.map(m => JSON.parse(m))
    .sort((a, b) => new Date(b.Date) - new Date(a.Date));
  res.json(parsed);
}
