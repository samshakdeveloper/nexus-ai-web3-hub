import { describe, it, expect } from 'vitest';
import { UserEmail, InvalidEmailError } from './value-objects/user-email';
import { UserPassword, InvalidPasswordError } from './value-objects/user-password';
import { User } from './user.entity';

describe('User Domain Module', () => {
    describe('UserEmail Value Object', () => {
        it('should create a valid email when formatted correctly', () => {
            const result = UserEmail.create('Test@Domain.com');
            expect(result.isOk).toBe(true);
            if (result.isOk) {
                expect(result.value.value).toBe('test@domain.com');
            }
        });

        it('should return error for invalid email string', () => {
            const result = UserEmail.create('invalid-email');
            expect(result.isErr).toBe(true);
            if (result.isErr) {
                expect(result.error).toBeInstanceOf(InvalidEmailError);
            }
        });
    });

    describe('UserPassword Value Object', () => {
        it('should accept valid password', () => {
            const result = UserPassword.create('securePassword123');
            expect(result.isOk).toBe(true);
        });

        it('should reject short password', () => {
            const result = UserPassword.create('123');
            expect(result.isErr).toBe(true);
            if (result.isErr) {
                expect(result.error).toBeInstanceOf(InvalidPasswordError);
            }
        });
    });

    describe('User Entity', () => {
        it('should instantiate User aggregate with valid properties', () => {
            const email = UserEmail.create('dev@nexus.com').unwrap();
            const password = UserPassword.create('strongPassword123').unwrap();

            const user = User.create({ email, password });

            expect(user.id).toBeDefined();
            expect(user.email.value).toBe('dev@nexus.com');
            expect(user.createdAt).toBeInstanceOf(Date);
        });
    });
});