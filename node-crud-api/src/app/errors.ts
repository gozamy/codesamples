export class AppError extends Error {
    constructor(
        public readonly code: string,
        public readonly statusCode: number,
        message: string,
    ) {
        super(message);

        this.name = 'AppError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super('NOT_FOUND', 404, message);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super('CONFLICT', 409, message);
    }
}