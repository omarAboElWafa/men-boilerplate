import Redis from 'ioredis';
import { redisConfig} from './config';

const client = new Redis(redisConfig);

// get data from cache
export const getFromCache = (key: string): Promise<string | null> => {
  return client.get(key).then((data) => {
    return data;
  }).catch((err) => {
    throw err;
  });
};
  
// set data to cache with expiration time
export const setToCache = (key: string, value: string, expirationTimeInMinutes: number): Promise<string> => {
  return client.set(key, value, 'EX', expirationTimeInMinutes * 60).then((data) => {
    return data;
  }).catch((err) => {
    throw err;
  });
}

// delete data from cache
export const deleteFromCache = (key: string) : Promise<number> => {
  return client.del(key).then(
    (data) => {
      return data;
    }
  ).catch((err) => {
    throw err;
  });
}

// delete all data from cache
export const clearCache = () :Promise<string> => {
  return client.flushall().then((data)=> {
    return data;
  }).catch((err) => {
    throw err;
  });
}