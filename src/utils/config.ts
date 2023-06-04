require('dotenv').config();
export const PORT :string | number  = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_URI :string = process.env.MONGO_URI || '';

const REDIS_HOST :string = process.env.REDIS_HOST || '';
const REDIS_PORT :number = parseInt(process.env.REDIS_PORT || '6379');

export const redisConfig = { host: REDIS_HOST, port: REDIS_PORT };