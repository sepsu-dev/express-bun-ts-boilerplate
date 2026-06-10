import { z } from 'zod';

const iconField = z.string().url('Icon must be a valid URL').optional().or(z.literal(''));

export const createSkillCategorySchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Category name must be at least 2 characters'),
        icon: iconField,
    })
});

export const updateSkillCategorySchema = z.object({
    params: z.object({
        uid: z.string().uuid('Invalid category uid'),
    }),
    body: z.object({
        name: z.string().min(2, 'Category name must be at least 2 characters').optional(),
        icon: iconField,
    })
});

export const skillCategoryIdSchema = z.object({
    params: z.object({
        uid: z.string().uuid('Invalid category uid'),
    })
});
