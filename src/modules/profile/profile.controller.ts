import type { Request, Response } from 'express';
import { ProfileService } from './profile.service';
import bcrypt from 'bcrypt';
import { sendSuccess } from '@/utils/response.util';
import { asyncHandler } from '@/utils/async-handler.util';
import { AppError } from '@/utils/app-error.util';
import { omitPassword } from '@/utils/sanitize.util';

/**
 * Profile controller.
 * Handles public profile retrieval, update, and password change.
 */
export const ProfileController = {
    /**
     * Fetches the public profile (password excluded).
     */
    getProfile: asyncHandler(async (_req: Request, res: Response) => {
        const data = await ProfileService.getProfile();

        if (!data) {
            throw new AppError('Profile not found', 404);
        }

        return sendSuccess(res, 'Profile fetched successfully', omitPassword(data));
    }),

    /**
     * Updates the profile fields (name, title, bio, etc.).
     */
    updateProfile: asyncHandler(async (req: Request, res: Response) => {
        const data = await ProfileService.update(req.body);

        if (!data) {
            throw new AppError('Failed to update profile', 404);
        }

        return sendSuccess(res, 'Profile updated successfully', omitPassword(data));
    }),

    /**
     * Changes the user password after verifying the current password.
     */
    changePassword: asyncHandler(async (req: Request, res: Response) => {
        const { oldPassword, newPassword } = req.body;

        // Use getWithPassword to ensure password field is returned
        const profile = await ProfileService.getProfileWithPassword();
        if (!profile || !profile.password) {
            throw new AppError('Profile not found', 404);
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, profile.password);
        if (!isMatch) {
            throw new AppError('Current password is incorrect', 401);
        }

        // Update new password (will be automatically hashed by repository on update)
        await ProfileService.update({ password: newPassword });

        return sendSuccess(res, 'Password changed successfully');
    }),
};