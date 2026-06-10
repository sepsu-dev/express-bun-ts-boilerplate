import { z } from 'zod';

export const createProjectSchema = z.object({
    body: z.object({
        title: z.string().min(5),
        subtitle: z.string().optional(),
        overview: z.string().min(10),
        architecture: z.string().optional(),
        demo_url: z.string().url().optional().or(z.literal('')),
        source_url: z.string().url().optional().or(z.literal('')),
        image_url: z.string().url().optional().or(z.literal('')),
        is_public: z.boolean().optional(),
    })
});

export const updateProjectSchema = z.object({
    params: z.object({
        uid: z.string().uuid(),
    }),
    body: createProjectSchema.shape.body.partial()
});

export const getProjectsSchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 3)),
    })
});


export const projectIdSchema = z.object({
    params: z.object({
        uid: z.string().uuid(),
    })
});

export const projectSkillSchema = z.object({
    params: z.object({
        uid: z.string().uuid(),
        skill_uid: z.string().uuid(),
    })
});

export const addProjectSkillSchema = z.object({
    params: z.object({
        uid: z.string().uuid(),
    }),
    body: z.object({
        skill_uid: z.string().uuid(),
    })
});
