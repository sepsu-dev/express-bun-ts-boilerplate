import { Router } from 'express';
import { SkillCategoryController } from './skill-category.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import {
    createSkillCategorySchema,
    updateSkillCategorySchema,
    skillCategoryIdSchema
} from './skill-category.validation';

const router = Router();

/**
 * @swagger
 * /skill-categories:
 *   get:
 *     summary: Retrieve all skill categories
 *     tags: [Skill Categories]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill categories fetched successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 - uid: "550e8400-e29b-41d4-a716-446655440010"
 *                   name: "frontend"
 *                   icon: "https://cdn.example.com/icons/frontend.svg"
 *                   created_at: "2024-03-20T10:00:00.000Z"
 *                   updated_at: "2024-03-20T10:00:00.000Z"
 */
router.get('/', SkillCategoryController.getCategories);

/**
 * @swagger
 * /skill-categories/{uid}:
 *   get:
 *     summary: Get skill category detail by uid
 *     tags: [Skill Categories]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill category fetched successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440010"
 *                 name: "frontend"
 *                 icon: "https://cdn.example.com/icons/frontend.svg"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Skill category not found"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.get('/:uid', validate(skillCategoryIdSchema), SkillCategoryController.getCategoryDetail);

/**
 * @swagger
 * /skill-categories:
 *   post:
 *     summary: Create a new skill category
 *     tags: [Skill Categories]
 *     security:
 *       - ApiKeyAuth: []
 *         bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "devops"
 *               icon:
 *                 type: string
 *                 format: url
 *                 example: "https://cdn.example.com/icons/devops.svg"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill category created successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440012"
 *                 name: "devops"
 *                 icon: "https://cdn.example.com/icons/devops.svg"
 *                 created_at: "2024-03-20T10:00:00.000Z"
 *       409:
 *         description: Category already exists
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Category \"devops\" already exists"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.post('/', authMiddleware, validate(createSkillCategorySchema), SkillCategoryController.createCategory);

/**
 * @swagger
 * /skill-categories/{uid}:
 *   put:
 *     summary: Update a skill category by uid
 *     tags: [Skill Categories]
 *     security:
 *       - ApiKeyAuth: []
 *         bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "cloud"
 *               icon:
 *                 type: string
 *                 format: url
 *                 example: "https://cdn.example.com/icons/cloud.svg"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill category updated successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440012"
 *                 name: "cloud"
 *                 icon: "https://cdn.example.com/icons/cloud.svg"
 *       404:
 *         description: Not found
 */
router.put('/:uid', authMiddleware, validate(updateSkillCategorySchema), SkillCategoryController.updateCategory);

/**
 * @swagger
 * /skill-categories/{uid}:
 *   delete:
 *     summary: Delete a skill category by uid
 *     tags: [Skill Categories]
 *     security:
 *       - ApiKeyAuth: []
 *         bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill category deleted successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *       409:
 *         description: Category still in use by skills
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Cannot delete category that is still used by one or more skills"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *       404:
 *         description: Not found
 */
router.delete('/:uid', authMiddleware, validate(skillCategoryIdSchema), SkillCategoryController.deleteCategory);

export const skillCategoryRoutes = router;
