import { getRedis } from '../lib/redis.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { To, From, Subject, HtmlBody, TextBody, Date, MessageID } = req.body;
  const inbox = To.split('@')[0].toLowerCase();
  const redis = await getRedis();
  await redis.setEx(
    `inbox:${inbox}:${MessageID}`,
    3600,
    JSON.stringify({ MessageID, From, Subject, HtmlBody, TextBody, Date })
  );
  res.status(200).end();
}
