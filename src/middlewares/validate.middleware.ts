import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { sendError } from '@/utils/response.util';

/**
 * Zod schema validation middleware factory.
 * Validates `req.body`, `req.query`, and `req.params` against the provided Zod schema.
 * Returns a 400 response with formatted errors on validation failure.
 */
export const validate = (schema: z.ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                return sendError(res, 'Validation failed', 400, formattedErrors);
            }
            next(error);
        }
    };
};