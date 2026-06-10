import { envSchema, type EnvVars } from './env-schema';

let validatedEnv: EnvVars;

try {
    validatedEnv = envSchema.parse(process.env);
} catch (error: unknown) {
    if (error instanceof Error && 'issues' in error) {
        const issues = (error as any).issues as Array<{ path: string[]; message: string }>;
        const missing = issues.map((i) => `  - "${i.path.join('.')}": ${i.message}`).join('\n');
        console.error(`❌ Environment variable validation failed:\n${missing}`);
        process.exit(1);
    }
    throw error;
}

export const APP_CONFIG = {
    port: validatedEnv.PORT,
    baseUrl: validatedEnv.BASE_URL,
    databaseUrl: validatedEnv.DATABASE_URL,
    jwtSecret: validatedEnv.JWT_SECRET,
    publicApiKey: validatedEnv.PUBLIC_API_KEY,
    nodeEnv: validatedEnv.NODE_ENV,
};
