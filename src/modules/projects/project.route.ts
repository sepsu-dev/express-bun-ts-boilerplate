import { Router } from 'express';
import { ProjectController } from './project.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema, getProjectsSchema, projectIdSchema, projectSkillSchema, addProjectSkillSchema } from './project.validation';

const router = Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve a paginated list of projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Projects fetched successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 items:
 *                   - uid: "550e8400-e29b-41d4-a716-446655440002"
 *                     title: "Portfolio API"
 *                     subtitle: "Backend Project"
 *                     overview: "Detailed overview description..."
 *                     architecture: "Microservices architecture..."
 *                     demo_url: "https://demo.example.com"
 *                     source_url: "https://github.com/example/portfolio-api"
 *                     image_url: "https://cdn.example.com/projects/portfolio.png"
 *                     is_public: true
 *                     created_at: "2024-03-20T10:00:00.000Z"
 *                     updated_at: "2024-03-20T10:00:00.000Z"
 *                     skills:
 *                       - uid: "550e8400-e29b-41d4-a716-446655440001"
 *                         name: "TypeScript"
 *                         icon: "https://cdn.example.com/icons/typescript.svg"
 *                       - uid: "550e8400-e29b-41d4-a716-446655440002"
 *                         name: "Docker"
 *                         icon: "https://cdn.example.com/icons/docker.svg"
 *               meta:
 *                 total: 1
 *                 page: 1
 *                 limit: 3
 *                 totalPages: 1
 */
router.get('/', validate(getProjectsSchema), ProjectController.getProjects);

/**
 * @swagger
 * /projects/{uid}:
 *   get:
 *     summary: Get project details by uid
 *     tags: [Projects]
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
 *               message: "Project details fetched successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440002"
 *                 title: "Portfolio API"
 *                 subtitle: "Backend Project"
 *                 overview: "Detailed overview description..."
 *                 architecture: "Microservices architecture..."
 *                 demo_url: "https://demo.example.com"
 *                 source_url: "https://github.com/example/portfolio-api"
 *                 image_url: "https://cdn.example.com/projects/portfolio.png"
 *                 is_public: true
 *                 created_at: "2024-03-20T10:00:00.000Z"
 *                 updated_at: "2024-03-20T10:00:00.000Z"
 *                 skills:
 *                   - uid: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "TypeScript"
 *                     icon: "https://cdn.example.com/icons/typescript.svg"
 *                   - uid: "550e8400-e29b-41d4-a716-446655440002"
 *                     name: "Docker"
 *                     icon: "https://cdn.example.com/icons/docker.svg"
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Project not found"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.get('/:uid', validate(projectIdSchema), ProjectController.getProjectDetail);

// Protected Routes (Project Management)
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
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
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               overview:
 *                 type: string
 *               architecture:
 *                 type: string
 *               demo_url:
 *                 type: string
 *               source_url:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Project created successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440002"
 *                 title: "Portfolio API"
 *                 subtitle: "Backend Project"
 *                 overview: "Detailed overview..."
 *                 architecture: "Architecture description..."
 *                 demo_url: "https://..."
 *                 source_url: "https://..."
 *                 image_url: "https://..."
 *                 is_public: true
 *                 created_at: "2024-03-20T10:00:00.000Z"
 *                 updated_at: "2024-03-20T10:00:00.000Z"
 */
router.post('/', authMiddleware, validate(createProjectSchema), ProjectController.createProject);

/**
 * @swagger
 * /projects/{uid}:
 *   put:
 *     summary: Update an existing project by uid
 *     tags: [Projects]
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
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               overview:
 *                 type: string
 *               architecture:
 *                 type: string
 *               demo_url:
 *                 type: string
 *               source_url:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Project updated successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 *               data:
 *                 uid: "550e8400-e29b-41d4-a716-446655440002"
 *                 title: "Updated Title"
 *                 updated_at: "2024-03-20T11:00:00.000Z"
 *       404:
 *         description: Project not found
 */
router.put('/:uid', authMiddleware, validate(updateProjectSchema), ProjectController.updateProject);

/**
 * @swagger
 * /projects/{uid}:
 *   delete:
 *     summary: Soft delete a project by uid
 *     tags: [Projects]
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
 *               message: "Project deleted successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.delete('/:uid', authMiddleware, validate(projectIdSchema), ProjectController.deleteProject);

// Protected Routes (Skill Assignment)
/**
 * @swagger
 * /projects/{uid}/skills:
 *   post:
 *     summary: Add a skill to a project
 *     tags: [Projects]
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
 *             required: [skill_uid]
 *             properties:
 *               skill_uid:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Skill added successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill added to project successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.post('/:uid/skills', authMiddleware, validate(addProjectSkillSchema), ProjectController.addSkillToProject);

/**
 * @swagger
 * /projects/{uid}/skills/{skill_uid}:
 *   delete:
 *     summary: Remove a skill from a project
 *     tags: [Projects]
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
 *       - in: path
 *         name: skill_uid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Skill removed successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Skill removed from project successfully"
 *               timestamp: "2024-03-20T10:00:00.000Z"
 */
router.delete('/:uid/skills/:skill_uid', authMiddleware, validate(projectSkillSchema), ProjectController.removeSkillFromProject);

export const projectRoutes = router;
