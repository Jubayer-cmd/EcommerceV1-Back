/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';
import app from './../app';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  email: process.env.EMAIL,
  appPass: process.env.APP_PASS,
  clientUrl: process.env.CLIENT_URL,

  ssl: {
    storeId: process.env.STORE_ID,
    storePass: process.env.STORE_PASS,
    sslPaymentUrl: process.env.SSL_BASE_PAYMENT_URL,
    sslValidationUrl: process.env.SSL_BASE_VALIDATION_URL,
  },
};
