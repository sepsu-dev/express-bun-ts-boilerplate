import type { Request, Response } from 'express';
import { SkillCategoryService } from './skill-category.service';
import { sendSuccess } from '@/utils/response.util';
import { asyncHandler } from '@/utils/async-handler.util';

/**
 * Skill category controller.
 * Handles CRUD operations for skill categories.
 */
export const SkillCategoryController = {
    /**
     * Retrieves all skill categories.
     */
    getCategories: asyncHandler(async (_req: Request, res: Response) => {
        const data = await SkillCategoryService.findAll();
        return sendSuccess(res, 'Skill categories fetched successfully', data);
    }),

    /**
     * Retrieves a single skill category by UID.
     */
    getCategoryDetail: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        const category = await SkillCategoryService.getById(uid);
        return sendSuccess(res, 'Skill category fetched successfully', category);
    }),

    /**
     * Creates a new skill category entry.
     */
    createCategory: asyncHandler(async (req: Request, res: Response) => {
        const { name, icon } = req.body as { name: string; icon?: string };
        const data = await SkillCategoryService.create({ name, icon });
        return sendSuccess(res, 'Skill category created successfully', data, 201);
    }),

    /**
     * Updates an existing skill category by UID.
     */
    updateCategory: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        const { name, icon } = req.body as { name?: string; icon?: string };
        const data = await SkillCategoryService.update(uid, { name, icon });
        return sendSuccess(res, 'Skill category updated successfully', data);
    }),

    /**
     * Deletes a skill category by UID.
     */
    deleteCategory: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        await SkillCategoryService.delete(uid);
        return sendSuccess(res, 'Skill category deleted successfully');
    }),
};