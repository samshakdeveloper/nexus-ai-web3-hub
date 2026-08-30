import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from '@modules/users/infrastructure/http/routes/user.routes';
import { errorMiddleware } from '@shared/infrastructure/http/middlewares/error.middleware';

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/v1/users', userRouter);

// Global Error Handler Middleware
app.use(errorMiddleware);

export { app };
export default app;