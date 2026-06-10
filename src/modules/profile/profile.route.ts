import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { updateProfileSchema, changePasswordSchema } from './profile.validation';

const router = Router();

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Retrieve developer profile information
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Profile fetched successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "Admin User"
 *                 email: "admin@email.com"
 */
router.get('/', ProfileController.getProfile);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update profile information
 *     tags: [Profile]
 *     security:
 *       - ApiKeyAuth: []
 *         bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *               image_url:
 *                 type: string
 *               github_url:
 *                 type: string
 *               focus:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Profile updated successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Failed to update profile"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.put('/', authMiddleware, validate(updateProfileSchema), ProfileController.updateProfile);

/**
 * @swagger
 * /profile/change-password:
 *   put:
 *     summary: Change admin password
 *     tags: [Profile]
 *     security:
 *       - ApiKeyAuth: []
 *         bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Password changed successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *       400:
 *         description: New password and confirmation do not match
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "New password and confirmation do not match"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Profile not found"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *       401:
 *         description: Old password incorrect
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Current password is incorrect"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.put('/change-password', authMiddleware, validate(changePasswordSchema), ProfileController.changePassword);

export const profileRoutes = router;
