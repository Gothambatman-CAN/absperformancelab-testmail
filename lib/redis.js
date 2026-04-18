const { createClient } = require('redis');
let client;
async function getRedis() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
  }
  return client;
}
module.exports = { getRedis };
