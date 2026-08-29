import { describe, it, expect, vi } from 'vitest';
import { Model, Document } from 'mongoose';
import { BaseRepository } from './base.repository';

interface TestDoc extends Document {
    name: string;
    isDeleted?: boolean;
}

class TestRepository extends BaseRepository<TestDoc> {
    constructor(model: Model<TestDoc>) {
        super(model);
    }
}

describe('BaseRepository Unit Tests', () => {
    it('should create an entity successfully', async () => {
        const mockCreatedDoc = { _id: '123', name: 'Test Item' } as TestDoc;
        const mockModel = {
            create: vi.fn().mockResolvedValue(mockCreatedDoc),
        } as unknown as Model<TestDoc>;

        const repo = new TestRepository(mockModel);
        const result = await repo.create({ name: 'Test Item' });

        expect(result.isOk).toBe(true);
        if (result.isOk) {
            expect(result.unwrap()).toEqual(mockCreatedDoc);
        }
    });

    it('should return failure result when create throws an error', async () => {
        const mockModel = {
            create: vi.fn().mockRejectedValue(new Error('Database timeout')),
        } as unknown as Model<TestDoc>;

        const repo = new TestRepository(mockModel);
        const result = await repo.create({ name: 'Fail Item' });

        expect(result.isErr).toBe(true);
        if (result.isErr) {
            expect(result.error.message).toBe('Database timeout');
        }
    });

    it('should find entity by id successfully', async () => {
        const mockDoc = { _id: '123', name: 'Found Item' } as TestDoc;
        const mockModel = {
            findOne: vi.fn().mockResolvedValue(mockDoc),
        } as unknown as Model<TestDoc>;

        const repo = new TestRepository(mockModel);
        const result = await repo.findById('123');

        expect(result.isOk).toBe(true);
        if (result.isOk) {
            expect(result.unwrap()).toEqual(mockDoc);
        }
    });

    it('should update entity successfully', async () => {
        const mockUpdatedDoc = { _id: '123', name: 'Updated Name' } as TestDoc;
        const mockModel = {
            findOneAndUpdate: vi.fn().mockResolvedValue(mockUpdatedDoc),
        } as unknown as Model<TestDoc>;

        const repo = new TestRepository(mockModel);
        const result = await repo.update('123', { name: 'Updated Name' });

        expect(result.isOk).toBe(true);
        if (result.isOk) {
            expect(result.unwrap()).toEqual(mockUpdatedDoc);
        }
    });

    it('should soft delete entity successfully', async () => {
        const mockModel = {
            updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }),
        } as unknown as Model<TestDoc>;

        const repo = new TestRepository(mockModel);
        const result = await repo.softDelete('123');

        expect(result.isOk).toBe(true);
        if (result.isOk) {
            expect(result.unwrap()).toBe(true);
        }
    });
});