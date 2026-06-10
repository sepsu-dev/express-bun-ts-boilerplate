import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@/middlewares/validate.middleware';
import { loginSchema } from './auth.validation';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Login successful"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 profile:
 *                   uid: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Admin User"
 *                   email: "admin@email.com"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid email or password"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.post('/login', validate(loginSchema), AuthController.login);

export const authRoutes = router;