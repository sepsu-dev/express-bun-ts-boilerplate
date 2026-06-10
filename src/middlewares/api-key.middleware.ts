import type { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response.util';
import { APP_CONFIG } from '@/config';

/**
 * API Key authentication middleware.
 * Validates the `x-api-key` header against the configured PUBLIC_API_KEY.
 * Used to protect public-facing `/api/*` routes.
 */
export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== APP_CONFIG.publicApiKey) {
        return sendError(res, 'Access denied. Invalid or missing API Key in x-api-key header.', 403);
    }

    next();
};