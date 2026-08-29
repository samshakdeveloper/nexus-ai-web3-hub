import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.entity';
import { UserEmail } from '../../domain/value-objects/user-email';
import { UserPassword } from '../../domain/value-objects/user-password';
import { Result, ok, err } from '../../../../shared/core/result';
import { BaseError } from '../../../../shared/core/errors/base.error';

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

        const passwordResult = UserPassword.create(dto.password);
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