require("dotenv").config();
export const PORT: string | number = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const MONGO_URI :string = process.env.MONGO_URI || '';
// export const MONGO_URI: string = process.env.MONGO_URI_LOCAL || "";

const REDIS_HOST: string = process.env.REDIS_HOST || "";
const REDIS_PORT: number = parseInt(process.env.REDIS_PORT || "6379");

export const redisConfig = { host: REDIS_HOST, port: REDIS_PORT };

export const HASH_SALT_ROUNDS: number = parseInt(
  process.env.HASH_SALT_ROUNDS || "10"
);

export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || "";
export const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY || "";
export const ACCESS_TOKEN_EXPIRY_FOR_CACHE = parseInt(process.env.ACCESS_TOKEN_EXPIRY_FOR_CACHE || "60");
export const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || "";
export const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY || "";
export const REFRESH_TOKEN_EXPIRY_FOR_CACHE: number = parseInt(process.env.REFRESH_TOKEN_EXPIRY_FOR_CACHE || "60");
export const RESET_PASSWORD_TOKEN_EXPIRY_FOR_CACHE: number = parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRY_FOR_CACHE || "60");
export const RESET_PASSWORD_TOKEN_SECRET: string = process.env.RESET_PASSWORD_TOKEN_SECRET || "";
export const ADMIN_TOKEN_SECRET: string = process.env.ADMIN_TOKEN_SECRET || "";

// OTP and Email Config
export const OTP_SECRET : string = process.env.OTP_SECRET || '';
export const OTP_TOKEN_EXPIRY_FOR_CACHE : number = parseInt(process.env.OTP_TOKEN_EXPIRY_FOR_CACHE || "60");
export const EMAIL_CONFIGS = {
    service: process.env.EMAIL_SERVICE || '',
    host: process.env.EMAIL_HOST || '',
    secure: process.env.EMAIL_SECURE === 'true' ? true : false,
    port: parseInt(process.env.EMAIL_PORT || '0'),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
};
export const SENDER_MAIL :string = process.env.SENDER_MAIL || '';
export const OTP_VALIDITY_PERIOD : number = parseInt(process.env.OTP_VALIDITY_PERIOD || "5");

export const SMS_CONFIG  = {
  sid: process.env.TWILIO_ACC_SID || "",
  authToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioMobNumber: process.env.TWILIO_MOBILE_NUM || ""
};

export const GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: process.env.GOOGLE_CALLBACK_URL || ""
};

export const FACEBOOK_CONFIG = {
  clientID: process.env.FACEBOOK_CLIENT_ID || "",
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || ""
};

export const TWITTER_CONFIG = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY || "",
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET || "",
  callbackURL: process.env.TWITTER_CALLBACK_URL || ""
};

// minio config
export const MINIO_CONFIG = {
  endPoint: process.env.MINIO_ENDPOINT || "",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true" ? true : false,
  rootUser: process.env.MINIO_ROOT_USER || "",
  rootPassword: process.env.MINIO_ROOT_PASSWORD || "",
  bucketName: process.env.MINIO_BUCKET_NAME || "",
  publicHost: process.env.MINIO_PUBLIC_ENDPOINT || "",
  policy: {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": ["*"]
        },
        "Action": [
          "s3:GetBucketLocation",
          "s3:ListBucket"
        ],
        "Resource": [
          `arn:aws:s3:::${process.env.MINIO_BUCKET_NAME || ""}`
        ]
      },
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": ["*"]
        },
        "Action": [
          "s3:GetObject"
        ],
        "Resource": [
          `arn:aws:s3:::${process.env.MINIO_BUCKET_NAME || ""}/*`
        ]
      }
    ]
  }
};
