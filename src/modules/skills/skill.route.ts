import { Router } from 'express';
import { SkillController } from './skill.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { createSkillSchema, updateSkillSchema, skillIdSchema } from './skill.validation';

const router = Router();

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Retrieve all skills grouped by category name
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skills fetched successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 frontend:
 *                   - uid: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "TypeScript"
 *                     category_uid: "550e8400-e29b-41d4-a716-446655440010"
 *                     category:
 *                       uid: "550e8400-e29b-41d4-a716-446655440010"
 *                       name: "frontend"
 *                     icon: "https://..."
 */
router.get('/', SkillController.getSkills);

/**
 * @swagger
 * /skills/{uid}:
 *   get:
 *     summary: Get skill details by uid
 *     tags: [Skills]
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
 *               message: "Skill details fetched successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440001"
 *                 name: "TypeScript"
 *                 category_uid: "550e8400-e29b-41d4-a716-446655440010"
 *                 category:
 *                   uid: "550e8400-e29b-41d4-a716-446655440010"
 *                   name: "frontend"
 *       404:
 *         description: Skill not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Skill not found"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.get('/:uid', validate(skillIdSchema), SkillController.getSkillDetail);

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skills]
 *     security:
 *       - ApiKeyAuth: []
 *         bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category_uid]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "TypeScript"
 *               category_uid:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the skill category
 *               icon:
 *                 type: string
 *                 format: url
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill created successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440001"
 *                 name: "TypeScript"
 *                 category_uid: "550e8400-e29b-41d4-a716-446655440010"
 *                 category:
 *                   uid: "550e8400-e29b-41d4-a716-446655440010"
 *                   name: "frontend"
 *                 icon: "https://..."
 */
router.post('/', authMiddleware, validate(createSkillSchema), SkillController.createSkill);

/**
 * @swagger
 * /skills/{uid}:
 *   put:
 *     summary: Update an existing skill by uid
 *     tags: [Skills]
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
 *               category_uid:
 *                 type: string
 *                 format: uuid
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill updated successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440001"
 *                 name: "TypeScript Updated"
 *                 category_uid: "550e8400-e29b-41d4-a716-446655440010"
 *                 category:
 *                   name: "frontend"
 *       404:
 *         description: Skill not found
 */
router.put('/:uid', authMiddleware, validate(updateSkillSchema), SkillController.updateSkill);

/**
 * @swagger
 * /skills/{uid}:
 *   delete:
 *     summary: Soft delete a skill by uid
 *     tags: [Skills]
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
 *               message: "Skill deleted successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.delete('/:uid', authMiddleware, validate(skillIdSchema), SkillController.deleteSkill);

export const skillRoutes = router;
