import type { Request, Response } from 'express';
import { SkillService } from './skill.service';
import { sendSuccess } from '@/utils/response.util';
import { asyncHandler } from '@/utils/async-handler.util';

/**
 * Skill controller.
 * Handles CRUD operations for skills.
 */
export const SkillController = {
    /**
     * Retrieves all skills grouped by category.
     */
    getSkills: asyncHandler(async (_req: Request, res: Response) => {
        const data = await SkillService.findAllGrouped();
        return sendSuccess(res, 'Skills fetched successfully', data);
    }),

    /**
     * Retrieves a single skill by UID.
     */
    getSkillDetail: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        const skill = await SkillService.getById(uid);
        return sendSuccess(res, 'Skill details fetched successfully', skill);
    }),

    /**
     * Creates a new skill entry.
     */
    createSkill: asyncHandler(async (req: Request, res: Response) => {
        const data = await SkillService.create(req.body);
        return sendSuccess(res, 'Skill created successfully', data, 201);
    }),

    /**
     * Updates an existing skill by UID.
     */
    updateSkill: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        const data = await SkillService.update(uid, req.body);
        return sendSuccess(res, 'Skill updated successfully', data);
    }),

    /**
     * Deletes a skill by UID.
     */
    deleteSkill: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        await SkillService.delete(uid);
        return sendSuccess(res, 'Skill deleted successfully');
    }),
};