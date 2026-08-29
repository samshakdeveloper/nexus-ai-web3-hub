import { Request, Response, NextFunction } from 'express';
import { CreateUser } from '@modules/users/application/use-cases/create-user';
import { MongoUserRepository } from '@modules/users/infrastructure/repositories/mongo-user.repository';

export class RegisterUserController {
    public static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            // در گام‌های بعدی این وابستگی‌ها را از طریق Dependency Injection مدیریت می‌کنیم
            const userRepository = new MongoUserRepository();
            const createUserUseCase = new CreateUser(userRepository);

            const result = await createUserUseCase.execute({ email, password });

            if (result.isErr) {
                res.status(400).json({
                    success: false,
                    error: result.error.message,
                });
                return;
            }

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    id: result.value.id,
                    email: result.value.email,
                    createdAt: result.value.createdAt,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}