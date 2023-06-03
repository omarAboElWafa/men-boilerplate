require('dotenv').config();
export const PORT :string | number  = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_URI :string = process.env.MONGO_URI || '';