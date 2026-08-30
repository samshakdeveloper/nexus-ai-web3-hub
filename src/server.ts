import app from './app';
import { env } from '@config/env.config';
import { logger } from '@shared/infrastructure/logger';
import { DatabaseService } from '@shared/infrastructure/database/mongoose.connection';

const startServer = async (): Promise<void> => {
    try {
        // Connect to Database
        const db = DatabaseService.getInstance();
        await db.connect();

        // Start Express Server
        const server = app.listen(env.PORT, () => {
            logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
        });

        // Graceful Shutdown
        const handleExit = async (): Promise<void> => {
            logger.info('Shutting down server...');
            server.close(async () => {
                await db.disconnect();
                logger.info('Server and Database connection closed.');
                process.exit(0);
            });
        };

        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();