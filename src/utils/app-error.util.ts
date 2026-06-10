/**
 * Custom application error with HTTP status code.
 * Throw this in services/controllers and it will be caught by the global error middleware.
 *
 * @example
 * throw new AppError('Skill not found', 404);
 * throw new AppError('Category "frontend" already exists', 409);
 */
export class AppError extends Error {
    public status: number;

    constructor(message: string, status: number = 500) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}