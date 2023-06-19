require("dotenv").config();
export const PORT: string | number = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
// export const MONGO_URI :string = process.env.MONGO_URI || '';
export const MONGO_URI: string = process.env.MONGO_URI_LOCAL || "";

const REDIS_HOST: string = process.env.REDIS_HOST || "";
const REDIS_PORT: number = parseInt(process.env.REDIS_PORT || "6379");

export const redisConfig = { host: REDIS_HOST, port: REDIS_PORT };

export const HASH_SALT_ROUNDS: number = parseInt(
  process.env.HASH_SALT_ROUNDS || "10"
);

export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || "";
export const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY || "";
export const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || "";
export const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY || "";
export const REFRESH_TOKEN_EXPIRY_FOR_CACHE: number = parseInt(process.env.REFRESH_TOKEN_EXPIRY_FOR_CACHE || "60");