const { getRedisClient } = require('../config/redis');

// Cache key generator
const getCacheKey = (prefix, ...args) => {
  return `${prefix}:${args.join(':')}`;
};

// Get from cache
const getCache = async (key) => {
  try {
    const redis = getRedisClient();
    if (!redis) return null;
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// Set cache with TTL
const setCache = async (key, value, ttl = 3600) => {
  try {
    const redis = getRedisClient();
    if (!redis) return false;
    await redis.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

// Delete cache
const deleteCache = async (key) => {
  try {
    const redis = getRedisClient();
    if (!redis) return false;
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

// Clear cache by prefix
const clearCacheByPattern = async (pattern) => {
  try {
    const redis = getRedisClient();
    if (!redis) return false;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

module.exports = {
  getCacheKey,
  getCache,
  setCache,
  deleteCache,
  clearCacheByPattern,
};
