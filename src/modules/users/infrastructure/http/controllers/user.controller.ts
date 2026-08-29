import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user.use-case';
import { AuthenticateUser } from '@modules/users/application/use-cases/authenticate-user';

export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly authenticateUserUseCase: AuthenticateUser
    ) {}

    public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.createUserUseCase.execute({ email, password });

            if (result.isErr) {
                res.status(400).json({
                    success: false,
                    error: result.error.message,
                });
                return;
            }

            const user = result.value;
            res.status(201).json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email.value,
                    createdAt: user.createdAt,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.authenticateUserUseCase.execute({ email, password });

            if (result.isErr) {
                res.status(result.error.statusCode || 401).json({
                    success: false,
                    error: result.error.message,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: result.value,
            });
        } catch (error) {
            next(error);
        }
    };
}