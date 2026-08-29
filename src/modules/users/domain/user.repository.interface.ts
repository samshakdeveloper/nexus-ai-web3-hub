import { User } from './user.entity'; // یا مسیر صحیح انتیتی کاربر

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
}