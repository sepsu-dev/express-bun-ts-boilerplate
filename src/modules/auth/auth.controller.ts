import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '@/utils/response.util';
import { asyncHandler } from '@/utils/async-handler.util';

/**
 * Authentication controller.
 * Handles login and token generation endpoints.
 */
export const AuthController = {
    /**
     * Authenticates a user with email and password.
     * Returns a JWT token on success.
     */
    login: asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);
        return sendSuccess(res, 'Login successful', result);
    }),
};