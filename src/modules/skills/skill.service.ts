import { skillRepository } from './skill.repository';
import { AppError } from '@/utils/app-error.util';

export const SkillService = {
    findAllGrouped: async () => {
        return await skillRepository.findAllGrouped();
    },

    getById: async (uid: string) => {
        const skill = await skillRepository.findById(uid);
        if (!skill) {
            throw new AppError('Skill not found', 404);
        }
        return skill;
    },

    findByName: async (name: string) => {
        return await skillRepository.findByName(name);
    },

    create: async (data: { name: string; category_uid: string; icon?: string }) => {
        const existing = await skillRepository.findByName(data.name);
        if (existing) {
            throw new AppError(`Skill "${data.name}" already exists`, 409);
        }
        return await skillRepository.create(data);
    },

    update: async (
        uid: string,
        data: Partial<{ name: string; category_uid: string; icon: string }>
    ) => {
        if (data.name) {
            const existing = await skillRepository.findByName(data.name);
            if (existing && existing.uid !== uid) {
                throw new AppError(`Skill "${data.name}" already exists`, 409);
            }
        }

        const updated = await skillRepository.update(uid, data);
        if (!updated) {
            throw new AppError('Skill not found', 404);
        }
        return updated;
    },

    delete: async (uid: string) => {
        try {
            const deleted = await skillRepository.delete(uid);
            if (!deleted) {
                throw new AppError('Skill not found', 404);
            }
        } catch (error: any) {
            // Foreign key violation — skill still in use by projects
            if (error.code === '23503') {
                throw new AppError('Cannot delete skill that is still used by one or more projects', 409);
            }
            throw error;
        }
    },
};