import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { Result, ok, err } from '@shared/core/result';

export abstract class BaseRepository<T extends Document> {
    protected constructor(protected readonly model: Model<T>) {}

    public async create(item: Partial<T>): Promise<Result<T, Error>> {
        try {
            const createdEntity = await this.model.create(item);
            return ok(createdEntity);
        } catch (error) {
            return err(error as Error);
        }
    }

    public async findById(id: string): Promise<Result<T | null, Error>> {
        try {
            const result = await this.model.findOne({
                _id: id,
                isDeleted: { $ne: true },
            } as FilterQuery<T>);
            return ok(result);
        } catch (error) {
            return err(error as Error);
        }
    }

    public async update(id: string, item: UpdateQuery<T>): Promise<Result<T | null, Error>> {
        try {
            const updatedEntity = await this.model.findOneAndUpdate(
                { _id: id, isDeleted: { $ne: true } } as FilterQuery<T>,
                item,
                { new: true }
            );
            return ok(updatedEntity);
        } catch (error) {
            return err(error as Error);
        }
    }

    public async softDelete(id: string): Promise<Result<boolean, Error>> {
        try {
            const res = await this.model.updateOne(
                { _id: id } as FilterQuery<T>,
                { isDeleted: true, deletedAt: new Date() } as UpdateQuery<T>
            );
            return ok(res.modifiedCount > 0);
        } catch (error) {
            return err(error as Error);
        }
    }
}