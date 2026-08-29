import { describe, it, expect } from 'vitest';
import { User } from './user';

describe('User Domain Entity Unit Tests', () => {
    it('should create a valid user instance', () => {
        const result = User.create({
            email: 'test@example.com',
            passwordHash: 'hashed_password_123',
            fullName: 'John Doe',
            role: 'user',
            isActive: true,
        });

        expect(result.isOk).toBe(true);
        if (result.isOk) {
            const user = result.unwrap();
            expect(user.email).toBe('test@example.com');
            expect(user.fullName).toBe('John Doe');
            expect(user.role).toBe('user');
        }
    });

    it('should fail creation with invalid email', () => {
        const result = User.create({
            email: 'invalid-email',
            passwordHash: 'hashed_password_123',
            fullName: 'John Doe',
            role: 'user',
            isActive: true,
        });

        expect(result.isErr).toBe(true);
        if (result.isErr) {
            expect(result.error.message).toBe('Invalid email format');
        }
    });

    it('should fail creation with short full name', () => {
        const result = User.create({
            email: 'test@example.com',
            passwordHash: 'hashed_password_123',
            fullName: 'A',
            role: 'user',
            isActive: true,
        });

        expect(result.isErr).toBe(true);
        if (result.isErr) {
            expect(result.error.message).toBe('Full name must be at least 2 characters long');
        }
    });
});