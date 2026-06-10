import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { routes } from '@/routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';
import { sendSuccess, sendError } from './utils/response.util';
import { APP_CONFIG } from './config';
import { apiLimiter } from './config/rate-limiter';
import { apiKeyMiddleware } from './middlewares/api-key.middleware';

const app: Application = express();
const PORT = APP_CONFIG.port;
const BASE_URL = APP_CONFIG.baseUrl;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - only applies to /api/ routes
app.use('/api', apiLimiter);

// API Key authentication - only applies to /api/ routes
app.use('/api', apiKeyMiddleware);

// Swagger Docs
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,
    },
}));

app.get('/', (_req: Request, res: Response) => {
    return sendSuccess(res, 'Portfolio API is running');
});

// Routes (health check + API)
app.use('/', routes);

// 404 Handler
app.use((_req: Request, res: Response) => {
    return sendError(res, 'Endpoint not found', 404);
});

// Global Error Handler
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
    console.log(`Server ready at ${BASE_URL}:${PORT}`);
});

/**
 * Graceful shutdown handler.
 * Closes the HTTP server and exits the process.
 * Forces exit after 5 seconds if the server doesn't close in time.
 */
const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    // Force exit after 5s if graceful shutdown fails
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 5000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);