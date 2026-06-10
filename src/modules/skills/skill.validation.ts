import { z } from 'zod';

export const createSkillSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Skill name must be at least 2 characters'),
        category_uid: z.string().uuid('category_uid must be a valid UUID'),
        icon: z.string().url('Icon must be a valid URL').optional().or(z.literal('')),
    })
});

export const updateSkillSchema = z.object({
    params: z.object({
        uid: z.string().uuid(),
    }),
    body: createSkillSchema.shape.body.partial()
});

export const skillIdSchema = z.object({
    params: z.object({
        uid: z.string().uuid(),
    })
});
