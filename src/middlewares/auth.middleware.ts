import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '@/utils/response.util';
import { APP_CONFIG } from '@/config';

export interface JwtPayload {
    id: string;
    email: string;
}

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * JWT Bearer token authentication middleware.
 * Verifies the Authorization header and decodes the user payload.
 * Attaches `req.user` for downstream handlers.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1] as string;

    try {
        const decoded = jwt.verify(token, APP_CONFIG.jwtSecret) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return sendError(res, 'Invalid or expired token.', 401);
    }
};