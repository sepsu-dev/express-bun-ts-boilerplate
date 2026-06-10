import { z } from 'zod';

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        title: z.string().optional(),
        location: z.string().optional(),
        bio: z.string().optional(),
        image_url: z.string().url().optional().or(z.literal('')),
        github_url: z.string().url().optional().or(z.literal('')),
        focus: z.array(z.string()).optional(),
    }).partial()
});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, 'Old password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Confirm password is required'),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: 'New password and confirmation do not match',
        path: ['confirmPassword'],
    })
});
