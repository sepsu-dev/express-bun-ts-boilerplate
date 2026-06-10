import { z } from 'zod';

export const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required (e.g. postgresql://user:pass@localhost:5432/db)'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    PUBLIC_API_KEY: z.string().min(1, 'PUBLIC_API_KEY is required'),
    PORT: z.coerce.number().min(1, 'PORT is required (e.g. 3000)'),
    BASE_URL: z.string().min(1, 'BASE_URL is required (e.g. http://localhost)'),
    NODE_ENV: z.enum(['development', 'test', 'production']).optional().default('development'),
});

export type EnvVars = z.infer<typeof envSchema>;