import type { Request, Response } from 'express';
import { ProjectService } from './project.service';
import { sendSuccess } from '@/utils/response.util';
import { asyncHandler } from '@/utils/async-handler.util';

/**
 * Project controller.
 * Handles CRUD operations for projects and project-skill associations.
 */
export const ProjectController = {
    /**
     * Retrieves paginated projects with optional search/filter.
     */
    getProjects: asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 3;

        const { data, total } = await ProjectService.getPaginated(page, limit);

        return sendSuccess(res, 'Projects fetched successfully', {
            items: data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }),

    /**
     * Retrieves a single project by UID.
     */
    getProjectDetail: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        const project = await ProjectService.getById(uid);
        return sendSuccess(res, 'Project details fetched successfully', project);
    }),

    /**
     * Creates a new project entry.
     */
    createProject: asyncHandler(async (req: Request, res: Response) => {
        const data = await ProjectService.create(req.body);
        return sendSuccess(res, 'Project created successfully', data, 201);
    }),

    /**
     * Updates an existing project by UID.
     */
    updateProject: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        const data = await ProjectService.update(uid, req.body);
        return sendSuccess(res, 'Project updated successfully', data);
    }),

    /**
     * Deletes a project by UID.
     */
    deleteProject: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        await ProjectService.delete(uid);
        return sendSuccess(res, 'Project deleted successfully');
    }),

    /**
     * Associates a skill with a project.
     */
    addSkillToProject: asyncHandler(async (req: Request, res: Response) => {
        const { uid } = req.params as { uid: string };
        const { skill_uid } = req.body as { skill_uid: string };
        await ProjectService.addSkill(uid, skill_uid);
        return sendSuccess(res, 'Skill added to project successfully');
    }),

    /**
     * Removes a skill association from a project.
     */
    removeSkillFromProject: asyncHandler(async (req: Request, res: Response) => {
        const { uid, skill_uid } = req.params as { uid: string; skill_uid: string };
        await ProjectService.removeSkill(uid, skill_uid);
        return sendSuccess(res, 'Skill removed from project successfully');
    }),
};