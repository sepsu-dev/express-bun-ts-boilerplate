import { projectRepository } from './project.repository';
import type { Project } from './project.model';
import { AppError } from '@/utils/app-error.util';

export const ProjectService = {
    getPaginated: async (page: number, limit: number) => {
        return await projectRepository.findAll(page, limit);
    },

    getById: async (id: string) => {
        const project = await projectRepository.findById(id);
        if (!project) {
            throw new AppError('Project not found', 404);
        }
        return project;
    },

    findByTitle: async (title: string) => {
        return await projectRepository.findByTitle(title);
    },

    create: async (data: Partial<Project>) => {
        if (data.title) {
            const existing = await projectRepository.findByTitle(data.title);
            if (existing) {
                throw new AppError(`Project "${data.title}" already exists`, 409);
            }
        }
        return await projectRepository.create(data);
    },

    update: async (id: string, data: Partial<Project>) => {
        if (data.title) {
            const existing = await projectRepository.findByTitle(data.title);
            if (existing && existing.uid !== id) {
                throw new AppError(`Project "${data.title}" already exists`, 409);
            }
        }

        const updated = await projectRepository.update(id, data);
        if (!updated) {
            throw new AppError('Project not found', 404);
        }
        return updated;
    },

    delete: async (id: string) => {
        const deleted = await projectRepository.delete(id);
        if (!deleted) {
            throw new AppError('Project not found', 404);
        }
    },

    addSkill: async (projectUid: string, skillUid: string) => {
        return await projectRepository.addSkill(projectUid, skillUid);
    },

    removeSkill: async (projectUid: string, skillUid: string) => {
        return await projectRepository.removeSkill(projectUid, skillUid);
    }
};