import swaggerJsdoc from 'swagger-jsdoc';

const PORT = Number(process.env.PORT);
const BASE_URL = process.env.BASE_URL;

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express Bun API Documentation',
            version: '1.0.0',
            description: `API documentation for the Express-Bun-TypeScript boilerplate.`,
        },
        servers: [
            {
                url: `${BASE_URL}:${PORT}/api`,
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message' },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Validation failed' },
                        timestamp: { type: 'string', format: 'date-time' },
                        error: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    path: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                Unauthorized: {
                    description: 'Unauthorized - No valid API key or JWT token provided',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                Forbidden: {
                    description: 'Forbidden - Valid credentials but insufficient permissions',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                Conflict: {
                    description: 'Conflict - Resource already exists (duplicate name/title)',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                ValidationError: {
                    description: 'Validation error - Invalid request body/params',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ValidationError' },
                        },
                    },
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
    },
    apis: ['./src/app.ts', './src/modules/**/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);