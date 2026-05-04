const { createClient } = require('redis');

// Pure function to initialize Redis client
const initRedisClient = async () => {
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: { reconnectStrategy: (retries) => Math.min(retries * 50, 500) },
    });

    client.on('error', (err) => console.error('❌ Redis error:', err));
    client.on('connect', () => console.log('✅ Redis connected'));

    await client.connect();
    return client;
  } catch (error) {
    console.error('❌ Redis initialization failed:', error.message);
    return null;
  }
};

// Pure function to get cached value
const getCached = (client) => async (key) => {
  if (!client) return null;
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

// Pure function to set cache value
const setCached = (client) => async (key, value, ttl = 3600) => {
  if (!client) return false;
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// Pure function to delete cache entry
const deleteCached = (client) => async (key) => {
  if (!client) return false;
  try {
    await client.del(key);
    return true;
  } catch {
    return false;
  }
};

// Pure function to invalidate pattern
const invalidatePattern = (client) => async (pattern) => {
  if (!client) return 0;
  try {
    const keys = await client.keys(pattern);
    if (keys.length === 0) return 0;
    return await client.del(keys);
  } catch {
    return 0;
  }
};

// Pure function to disconnect
const disconnectRedis = (client) => async () => {
  if (client) await client.quit();
};

module.exports = {
  initRedisClient,
  getCached,
  setCached,
  deleteCached,
  invalidatePattern,
  disconnectRedis,
};
