import { AggregateRoot } from '@shared/domain/aggregate-root';
import { Result, ok, err } from '@shared/core/result';
import { ValidationError } from '@shared/core/errors/app.error';

export interface UserProps {
    email: string;
    passwordHash: string;
    fullName: string;
    role?: 'user' | 'admin';
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id);
    }

    public static create(props: UserProps, id?: string): Result<User, ValidationError> {
        if (!props.email || !props.email.includes('@')) {
            return err(new ValidationError('Invalid email format'));
        }

        if (!props.fullName || props.fullName.trim().length < 2) {
            return err(new ValidationError('Full name must be at least 2 characters long'));
        }

        const isActive = props.isActive !== undefined ? props.isActive : true;
        const role = props.role ? props.role : 'user';
        const createdAt = props.createdAt ? props.createdAt : new Date();
        const updatedAt = props.updatedAt ? props.updatedAt : new Date();

        const user = new User(
            {
                email: props.email,
                passwordHash: props.passwordHash,
                fullName: props.fullName,
                isActive,
                role,
                createdAt,
                updatedAt,
            },
            id
        );

        return ok(user);
    }

    get email(): string {
        return this.props.email;
    }

    get passwordHash(): string {
        return this.props.passwordHash;
    }

    get fullName(): string {
        return this.props.fullName;
    }

    get role(): 'user' | 'admin' {
        return this.props.role || 'user';
    }

    get isActive(): boolean {
        return this.props.isActive !== undefined ? this.props.isActive : true;
    }
}