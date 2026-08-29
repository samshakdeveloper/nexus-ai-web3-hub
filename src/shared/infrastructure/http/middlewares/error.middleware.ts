import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/core/errors/app.error';
import { logger } from '@shared/infrastructure/logger';
import { env } from '@config/env.config';

export const errorMiddleware = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (error instanceof AppError) {
        logger.warn(`AppError [${error.statusCode}]: ${error.message}`, {
            details: error.details,
        });

        res.status(error.statusCode).json({
            status: 'error',
            statusCode: error.statusCode,
            message: error.message,
            ...(error.details && { details: error.details }),
        });
        return;
    }

    logger.error(`Unhandled Error: ${error.message}`, { stack: error.stack });

    res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
};