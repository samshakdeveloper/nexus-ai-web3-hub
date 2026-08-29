import express, { Application, Request, Response, NextFunction } from 'express';
import { userRoutes } from '@modules/users/infrastructure/http/users.routes';

const app: express.Application = express();

// Middleware های عمومی
app.use(express.json());

// ثبت روترهای ماژول‌ها
app.use('/api/v1/users', userRoutes);

// Route تست سلامت سرور
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware سراسری مدیریت خطاها (Global Error Handler)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error('❌ Unhandled Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
    });
});

export { app };