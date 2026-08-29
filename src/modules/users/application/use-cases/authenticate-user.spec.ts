import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthenticateUser, InvalidCredentialsError } from './authenticate-user';
import { IUserRepository } from '@modules/users/domain/user.repository.interface';
import { User } from '@modules/users/domain/user.entity';
import { UserEmail } from '@modules/users/domain/value-objects/user-email';

describe('AuthenticateUser Use Case', () => {
    let authenticateUser: AuthenticateUser;
    let mockUserRepository: Partial<IUserRepository>;

    const testEmail = 'test@nexus.com';
    const testPassword = 'Password123';

    beforeEach(() => {
        // ایجاد Mock برای ریپازیتوری کاربران
        mockUserRepository = {
            findByEmail: vi.fn(),
        };
        authenticateUser = new AuthenticateUser(mockUserRepository as IUserRepository);
    });

    it('should successfully authenticate a user when valid credentials are provided', async () => {
        // ساخت یک کاربر نمونه دامنه با رعایت الگوی Result دامنه
        const emailOrError = UserEmail.create(testEmail);
        const userOrError = User.create({
            email: emailOrError.value!,
            password: testPassword
        });

        // اگر User.create خودش Result برمی‌گرداند:
        const mockUser = userOrError.isOk ? userOrError.value : userOrError;
        // (اگر User.create مستقیماً انتیتی برمی‌گرداند که همان خط قبلی درست است، اما چک کردن isOk جلوی خطاهای احتمالی دامنه را می‌گیرد)

        // شبیه‌سازی پیدا شدن کاربر در دیتابیس
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUser as any);

        const result = await authenticateUser.execute({
            email: testEmail,
            password: testPassword,
        });

        expect(result.isOk).toBe(true);
        expect(result.value).toHaveProperty('id');
        expect(result.value?.email).toBe(testEmail);
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(testEmail);
    });

    it('should fail with InvalidCredentialsError if user does not exist', async () => {
        // شبیه‌سازی عدم یافتن کاربر
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null);

        const result = await authenticateUser.execute({
            email: 'notfound@nexus.com',
            password: testPassword,
        });

        expect(result.isErr).toBe(true);
        expect(result.error).toBeInstanceOf(InvalidCredentialsError);
        expect(result.error.statusCode).toBe(401);
    });
});