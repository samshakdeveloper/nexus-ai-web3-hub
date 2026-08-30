import 'module-alias/register';
import { env } from '@config/env.config';
import { logger } from '@shared/infrastructure/logger';
import { MongoDatabase } from '@shared/infrastructure/database/mongodb';

async function bootstrap(): Promise<void> {
    try {
        logger.info('🚀 Initializing Nexus Enterprise AI & Web3 Hub...');
        logger.info(`⚙️  Environment: ${env.NODE_ENV}`);
        logger.info(`🔌 Port Configured: ${env.PORT}`);

        // Connect to Database
        const db = MongoDatabase.getInstance();
        await db.connect();

        // Handling unexpected process errors gracefully
        process.on('uncaughtException', (error) => {
            logger.error('💥 Uncaught Exception detected:', error);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason) => {
            logger.error('💥 Unhandled Rejection detected:', reason instanceof Error ? reason : new Error(String(reason)));
            process.exit(1);
        });

        const shutdown = async (signal: string): Promise<void> => {
            logger.warn(`⚠️  Received ${signal}. Starting graceful shutdown...`);
            await db.disconnect();
            process.exit(0);
        };

        process.on('SIGTERM', () => void shutdown('SIGTERM'));
        process.on('SIGINT', () => void shutdown('SIGINT'));

    } catch (error) {
        logger.error('❌ Fatal error during bootstrap:', error);
        process.exit(1);
    }
}

void bootstrap();