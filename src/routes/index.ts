import { Router } from 'express';
import { authRoutes } from '@/modules/auth/auth.route';
import { projectRoutes } from '@/modules/projects/project.route';
import { skillRoutes } from '@/modules/skills/skill.route';
import { skillCategoryRoutes } from '@/modules/skill-categories/skill-category.route';
import { profileRoutes } from '@/modules/profile/profile.route';

/**
 * Central application router.
 * Mounts all module route groups under the `/api` prefix.
 */
const router = Router();

const API_PREFIX = '/api';

router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/projects`, projectRoutes);
router.use(`${API_PREFIX}/skills`, skillRoutes);
router.use(`${API_PREFIX}/skill-categories`, skillCategoryRoutes);
router.use(`${API_PREFIX}/profile`, profileRoutes);

export const routes = router;
