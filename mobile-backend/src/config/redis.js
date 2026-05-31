const { createClient } = require('redis');

let client = null;

const connectRedis = async () => {
  const url = process.env.REDIS_URI || 'redis://localhost:6379';
  console.log(`Redis sunucusuna bağlanılıyor: ${url}`);
  
  client = createClient({ url });

  client.on('error', (err) => {
    console.error('Redis Hata:', err.message);
  });

  client.on('connect', () => {
    console.log('Redis Bağlantısı Başarıyla Kuruldu.');
  });

  await client.connect();
};

const getRedisClient = () => {
  if (!client) {
    throw new Error('Redis bağlantısı henüz kurulmadı.');
  }
  return client;
};

const getCache = async (key) => {
  try {
    const c = getRedisClient();
    const data = await c.get(key);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Redis cache okuma hatası:', error.message);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds = 300) => {
  try {
    const c = getRedisClient();
    const stringData = JSON.stringify(value);
    await c.set(key, stringData, {
      EX: ttlSeconds
    });
    console.log(`Redis: [${key}] anahtarı önbelleğe kaydedildi (TTL: ${ttlSeconds}s)`);
  } catch (error) {
    console.error('Redis cache yazma hatası:', error.message);
  }
};

const deleteCache = async (key) => {
  try {
    const c = getRedisClient();
    await c.del(key);
  } catch (error) {
    console.error('Redis cache silme hatası:', error.message);
  }
};

const clearUserCache = async (userId) => {
  try {
    const c = getRedisClient();
    const pattern = `user:${userId}:*`;
    const keys = await c.keys(pattern);
    if (keys && keys.length > 0) {
      await c.del(keys);
      console.log(`Redis: Kullanıcıya (${userId}) ait ${keys.length} adet önbellek kaydı silindi.`);
    }
  } catch (error) {
    console.error('Redis cache desen silme hatası:', error.message);
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  getCache,
  setCache,
  deleteCache,
  clearUserCache
};
