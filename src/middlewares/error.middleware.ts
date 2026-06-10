import type { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response.util';
import { AppError } from '@/utils/app-error.util';

/**
 * Global error handling middleware.
 * Handles known AppError instances, JSON parse errors, and unknown errors.
 */
export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('SERVER_ERROR', err);

    // Handle known AppError instances
    if (err instanceof AppError) {
        return sendError(res, err.message, err.status);
    }

    // Handle JSON parse errors
    if (err.type === 'entity.parse.failed') {
        return sendError(res, 'Invalid JSON in request body', 400);
    }

    // Handle unknown errors
    const statusCode = err.status || 500;
    const message = err.message && process.env.NODE_ENV === 'development' ? err.message : 'Internal server error';

    return sendError(res, message, statusCode);
};
