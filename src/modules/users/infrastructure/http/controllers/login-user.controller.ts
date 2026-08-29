import { Request, Response, NextFunction } from 'express';
import { AuthenticateUser } from '@modules/users/application/use-cases/authenticate-user';
import { MongoUserRepository } from '@modules/users/infrastructure/repositories/mongo-user.repository';

export class LoginUserController {
    public static async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            const userRepository = new MongoUserRepository();
            const authenticateUserUseCase = new AuthenticateUser(userRepository);

            const result = await authenticateUserUseCase.execute({ email, password });

            if (result.isErr) {
                res.status(result.error.statusCode || 400).json({
                    success: false,
                    error: result.error.message,
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                data: result.value,
            });
        } catch (error) {
            next(error);
        }
    }
}