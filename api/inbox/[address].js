const { getRedis } = require('../../lib/redis.js');
module.exports = async function handler(req, res) {
  const auth = req.headers['authorization'] ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!process.env.INBOX_SECRET || token !== process.env.INBOX_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { address } = req.query;
  const redis = await getRedis();
  const keys = await redis.keys(`inbox:${address.toLowerCase()}:*`);
  if (!keys.length) return res.json([]);
  const messages = await Promise.all(keys.map(k => redis.get(k)));
  const parsed = messages.map(m => JSON.parse(m))
    .sort((a, b) => new Date(b.Date) - new Date(a.Date));
  res.json(parsed);
}
