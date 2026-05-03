import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskboard',
  secretKey: process.env.SECRET_KEY,
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
  accessTokenExpireMinutes: parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '10080', 10),
  projectName: process.env.PROJECT_NAME || 'Sprint',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiV1: '/api/v1',
};

if (!config.secretKey) {
  console.warn('WARNING: SECRET_KEY is not set. Set it in .env for production.');
}
