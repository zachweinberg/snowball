import Redis from 'ioredis';
import { logSentryError } from './sentry';

const redisClient = new Redis(process.env.REDIS_URL!, { tls: { rejectUnauthorized: false } });

redisClient.on('error', (err) => {
  logSentryError(err);
});

const setAsync = (key: string, value: any, expirationSeconds: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, 'EX', expirationSeconds, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const getAsync = (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result ?? null);
    });
  });
};

const deleteAsync = (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const setRedisKey = async (key: string, value: any, expirationSeconds: number): Promise<void> => {
  try {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    await setAsync(key, value, expirationSeconds);
  } catch (err) {
    console.error('Could not set Redis key', key, value);
    logSentryError(err);
  }
};

export const getRedisKey = async (key: string): Promise<string | null> => {
  try {
    const result = await getAsync(key);

    if (result) {
      return result;
    }

    return null;
  } catch (err) {
    console.error('Could not retrieve Redis key', key);
    logSentryError(err);
    return null;
  }
};

export const deleteRedisKey = async (key: string): Promise<void> => {
  try {
    await deleteAsync(key);
  } catch (err) {
    console.error('Could not delete Redis key', key);
    logSentryError(err);
  }
};
