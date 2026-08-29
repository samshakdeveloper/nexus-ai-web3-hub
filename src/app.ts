import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from '@shared/infrastructure/http/middlewares/error.middleware';

const app: Application = express();

// Security & Base Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler (Must be last middleware)
app.use(errorMiddleware);

export default app;