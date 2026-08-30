import { IUserRepository } from '@modules/users/domain/user.repository.interface';
import { ok, err, Result } from '@shared/core/result';
import { BaseError } from '@shared/core/errors/base.error';
import { JwtService } from '@shared/infrastructure/security/jwt.service';
import { PasswordHasher } from '@shared/infrastructure/security/password-hasher';

export class InvalidCredentialsError extends BaseError {
    constructor() {
        super('Invalid email or password', 'INVALID_CREDENTIALS', 401);
        this.name = 'InvalidCredentialsError';
    }
}

export interface AuthResponseDto {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

export class AuthenticateUser {
    constructor(private readonly userRepository: IUserRepository) {}

    public async execute(input: { email: string; password: string }): Promise<Result<AuthResponseDto, BaseError>> {
        // ۱. جستجوی کاربر با ایمیل
        const user = await this.userRepository.findByEmail(input.email);

        if (!user) {
            return err(new InvalidCredentialsError());
        }

        // ۲. بررسی صحت کلمه‌عبور با هش ذخیره‌شده
        const isPasswordValid = await PasswordHasher.compare(input.password, user.password.value);

        if (!isPasswordValid) {
            return err(new InvalidCredentialsError());
        }

        // ۳. تولید توکن JWT
        const token = JwtService.generateToken({
            userId: user.id.toString(),
            email: user.email.value,
        });

        // ۴. بازگرداندن پاسخ موفقیت‌آمیز همراه با توکن
        return ok({
            token,
            user: {
                id: user.id.toString(),
                email: user.email.value,
            },
        });
    }
}