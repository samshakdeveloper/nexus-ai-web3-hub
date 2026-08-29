import { Entity } from '../../../shared/domain/entity';
import { UserEmail } from './value-objects/user-email';
import { UserPassword } from './value-objects/user-password';

export interface UserProps {
    email: UserEmail;
    password: UserPassword;
    createdAt: Date;
}

export class User extends Entity<UserProps> {
    get email(): UserEmail {
        return this.props.email;
    }

    get password(): UserPassword {
        return this.props.password;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    public static create(props: Omit<UserProps, 'createdAt'> & { createdAt?: Date }, id?: string): User {
        return new User(
            {
                ...props,
                createdAt: props.createdAt ? props.createdAt : new Date(),
            },
            id
        );
    }
}