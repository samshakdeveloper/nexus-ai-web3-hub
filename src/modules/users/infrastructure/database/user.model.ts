import { Schema, model, Document } from 'mongoose';

export interface IUserDocument extends Document {
    email: string;
    passwordHash: string;
    fullName: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
    {
        email: { type: String, required: true, unique: true, index: true },
        passwordHash: { type: String, required: true },
        fullName: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export const UserModel = model<IUserDocument>('User', userSchema);