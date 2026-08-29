export abstract class AppError extends Error {
    public abstract readonly statusCode: number;

    constructor(
        message: string,
        public readonly details: Record<string, unknown> | null = null
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    public readonly statusCode = 404;
    constructor(message = 'Resource not found', details: Record<string, unknown> | null = null) {
        super(message, details);
    }
}

export class ValidationError extends AppError {
    public readonly statusCode = 400;
    constructor(message = 'Validation error', details: Record<string, unknown> | null = null) {
        super(message, details);
    }
}

export class UnauthorizedError extends AppError {
    public readonly statusCode = 401;
    constructor(message = 'Unauthorized access', details: Record<string, unknown> | null = null) {
        super(message, details);
    }
}

export class ForbiddenError extends AppError {
    public readonly statusCode = 403;
    constructor(message = 'Forbidden action', details: Record<string, unknown> | null = null) {
        super(message, details);
    }
}

export class InternalServerError extends AppError {
    public readonly statusCode = 500;
    constructor(message = 'Internal server error', details: Record<string, unknown> | null = null) {
        super(message, details);
    }
}