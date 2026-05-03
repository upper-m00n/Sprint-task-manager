import mongoose from 'mongoose';
import { config } from './config.js';

const CONNECT_OPTS = {
  serverSelectionTimeoutMS: 8000,
};

export async function connectDb() {
  await mongoose.connect(config.mongoUri, CONNECT_OPTS);
}
