export abstract class BaseError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly details?: Record<string, unknown> | undefined;

    constructor(
        message: string,
        code = 'INTERNAL_ERROR', // مقدار پیش‌فرض اضافه شد
        statusCode = 500,
        details?: Record<string, unknown>
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DomainError extends BaseError {
    constructor(message: string, code = 'DOMAIN_ERROR', details?: Record<string, unknown>) {
        super(message, code, 400, details);
    }
}

export class InfrastructureError extends BaseError {
    constructor(message: string, code = 'INFRASTRUCTURE_ERROR', details?: Record<string, unknown>) {
        super(message, code, 500, details);
    }
}

export class NotFoundError extends BaseError {
    constructor(entity: string, id: string) {
        super(`${entity} with identifier ${id} was not found.`, 'NOT_FOUND', 404);
    }
}