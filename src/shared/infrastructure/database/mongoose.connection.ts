import mongoose, { Connection } from 'mongoose';
import { env } from '@config/env.config';
import { logger } from '@shared/infrastructure/logger';
import { Result, ok, err } from '@shared/core/result';

export class DatabaseService {
    private static instance: DatabaseService;
    private connection: Connection | null = null;

    private constructor() {}

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async connect(): Promise<Result<Connection, Error>> {
        if (this.connection && this.connection.readyState === 1) {
            return ok(this.connection);
        }

        try {
            logger.info('Connecting to MongoDB...');
            const db = await mongoose.connect(env.MONGODB_URI, {
                autoIndex: env.NODE_ENV !== 'production',
                serverSelectionTimeoutMS: 5000,
            });

            this.connection = db.connection;
            logger.info('Successfully connected to MongoDB database');
            return ok(this.connection);
        } catch (error) {
            logger.error('MongoDB Connection Error:', error);
            return err(error as Error);
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            await mongoose.disconnect();
            this.connection = null;
            logger.info('MongoDB connection closed gracefully');
        }
    }
}

export const databaseService = DatabaseService.getInstance();