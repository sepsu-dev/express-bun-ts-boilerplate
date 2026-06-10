import { skillCategoryRepository } from './skill-category.repository';
import { AppError } from '@/utils/app-error.util';

export const SkillCategoryService = {
    findAll: async () => {
        return await skillCategoryRepository.findAll();
    },

    getById: async (uid: string) => {
        const category = await skillCategoryRepository.findById(uid);
        if (!category) {
            throw new AppError('Skill category not found', 404);
        }
        return category;
    },

    findByName: async (name: string) => {
        return await skillCategoryRepository.findByName(name);
    },

    create: async (data: { name: string; icon?: string }) => {
        const existing = await skillCategoryRepository.findByName(data.name);
        if (existing) {
            throw new AppError(`Category "${data.name}" already exists`, 409);
        }
        return await skillCategoryRepository.create(data);
    },

    update: async (uid: string, data: { name?: string; icon?: string }) => {
        if (data.name) {
            const existing = await skillCategoryRepository.findByName(data.name);
            if (existing && existing.uid !== uid) {
                throw new AppError(`Category "${data.name}" already exists`, 409);
            }
        }

        const updated = await skillCategoryRepository.update(uid, data);
        if (!updated) {
            throw new AppError('Skill category not found', 404);
        }
        return updated;
    },

    delete: async (uid: string) => {
        try {
            const deleted = await skillCategoryRepository.delete(uid);
            if (!deleted) {
                throw new AppError('Skill category not found', 404);
            }
        } catch (error: any) {
            // Foreign key violation — category still in use by skills
            if (error.code === '23503') {
                throw new AppError('Cannot delete category that is still used by one or more skills', 409);
            }
            throw error;
        }
    },
};