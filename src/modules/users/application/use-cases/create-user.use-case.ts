import { UserRepository } from '@modules/users/domain/user.repository';
import { User } from '@modules/users/domain/user.entity';
import { UserEmail } from '@modules/users/domain/value-objects/user-email';
import { UserPassword } from '@modules/users/domain/value-objects/user-password';
import { Result, ok, err } from '@shared/core/result';
import { BaseError } from '@shared/core/errors/base.error';
import { PasswordHasher } from '@shared/infrastructure/security/password-hasher';

export interface CreateUserDTO {
    email: string;
    password: string;
}

export class UserAlreadyExistsError extends BaseError {
    constructor(email: string) {
        super(`User with email ${email} already exists`);
    }
}

export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    public async execute(dto: CreateUserDTO): Promise<Result<User, BaseError>> {
        const emailResult = UserEmail.create(dto.email);
        if (emailResult.isErr) {
            return err(emailResult.error);
        }

        const hashedPassword = await PasswordHasher.hash(dto.password);
        const passwordResult = UserPassword.create(hashedPassword);
        if (passwordResult.isErr) {
            return err(passwordResult.error);
        }

        const email = emailResult.value;
        const password = passwordResult.value;

        const existingUser = await this.userRepository.findByEmail(email.value);
        if (existingUser) {
            return err(new UserAlreadyExistsError(email.value));
        }

        const user = User.create({ email, password });
        await this.userRepository.save(user);

        return ok(user);
    }
}