import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorMiddleware } from './error.middleware';
import { NotFoundError } from '@shared/core/errors/app.error';
import { logger } from '@shared/infrastructure/logger';

// تمیز کردن لاگ‌ها در محیط تست
vi.mock('@shared/infrastructure/logger', () => ({
    logger: {
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    },
}));

describe('Error Middleware Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle AppError and send correct status and json response', () => {
        const error = new NotFoundError('User not found');
        const req = {} as Request;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;
        const next = vi.fn() as NextFunction;

        errorMiddleware(error, req, res, next);

        expect(logger.warn).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            statusCode: 404,
            message: 'User not found',
        });
    });

    it('should handle unhandled errors with status 500', () => {
        const error = new Error('Unexpected crash');
        const req = {} as Request;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;
        const next = vi.fn() as NextFunction;

        errorMiddleware(error, req, res, next);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'error',
                statusCode: 500,
            })
        );
    });
});