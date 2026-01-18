import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.js';
import { generalRateLimiter } from './middleware/rate-limit.js';
import authRouter from './routes/auth.js';
import tasksRouter from './routes/tasks.js';
import accountRouter from './routes/account.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(generalRateLimiter);

// Body parsing
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/account', accountRouter);

// Error handler (must be last)
app.use(errorHandler);

export default app;
