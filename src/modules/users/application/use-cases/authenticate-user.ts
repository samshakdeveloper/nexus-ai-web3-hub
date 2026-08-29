import { IUserRepository } from '@modules/users/domain/user.repository.interface';
import { ok, err, Result } from '@shared/core/result';
import { BaseError } from '@shared/core/errors/base.error';

export class InvalidCredentialsError extends BaseError {
    constructor() {
        super('Invalid email or password', 'INVALID_CREDENTIALS', 401); // پارامتر دوم کد خطا، پارامتر سوم استتوس کد
        this.name = 'InvalidCredentialsError';
    }
}
export interface AuthenticatedUserDto {
    id: string;
    email: string;
}

export class AuthenticateUser {
    constructor(private readonly userRepository: IUserRepository) {}

    public async execute(input: { email: string; password: string }): Promise<Result<AuthenticatedUserDto, BaseError>> {
        // ۱. جستجوی کاربر با ایمیل
        const userOrNull = await this.userRepository.findByEmail(input.email);

        // حالت خطا: کاربر پیدا نشد
        if (!userOrNull) {
            return err(new InvalidCredentialsError());
        }

        // ۲. حالت موفقیت
        return ok({
            id: userOrNull.id.toString(), // تبدیل شناسه به استرینگ برای جلوگیری از خطاهای احتمالی آبجکت
            email: userOrNull.email.value,
        });
    }
}