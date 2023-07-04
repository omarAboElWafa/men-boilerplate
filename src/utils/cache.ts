import Redis from 'ioredis';
import { redisConfig} from './config';

export const getClient = async () => {
  return await new Redis(redisConfig);
} 

export const tokenClientPool = new Redis(redisConfig);

// get data from cache
export const getFromCache = (client:Redis, key: string): Promise<string | null> => {
  return client.get(key).then((data) => {
    return data;
  }).catch((err) => {
    throw err;
  });
};
  
// set data to cache with expiration time
export const setToCache = (client:Redis, key: string, value: string, expirationTimeInMinutes: number): Promise<string> => {
  return client.set(key, value, 'EX', expirationTimeInMinutes * 60).then((data) => {
    return data;
  }).catch((err) => {
    throw err;
  });
}

// delete data from cache
export const deleteFromCache = (client:Redis, key: string) : Promise<number> => {
  return client.del(key).then(
    (data) => {
      return data;
    }
  ).catch((err) => {
    throw err;
  });
}

// delete all data from cache
export const clearCache = (client:Redis) :Promise<string> => {
  return client.flushall().then((data)=> {
    return data;
  }).catch((err) => {
    throw err;
  });
}

export const closeClient = async (client:Redis) => {
  return await client.disconnect();
}