import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import workflowRoutes from './routes/workflows.js';
import itemRoutes from './routes/items.js';
import { initRedis } from './clients/redisClient.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'flowboard-backend' });
});

app.use('/auth', authRoutes);
app.use('/workflows', workflowRoutes);
app.use('/items', itemRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/flowboard';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    await initRedis();
    console.log('Connected to Redis');

    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

