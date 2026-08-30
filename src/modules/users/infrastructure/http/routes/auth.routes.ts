import { Router, Request, Response, NextFunction } from 'express';
import { LoginUserController } from '../controllers/login-user.controller';
import { AuthenticateUser } from '@modules/users/application/use-cases/authenticate-user';
import { MongoUserRepository } from '@modules/users/infrastructure/repositories/mongo-user.repository';

const authRouter = Router();

// Composition Root / Manual DI Setup
const userRepository = new MongoUserRepository();
const authenticateUserUseCase = new AuthenticateUser(userRepository);
const loginUserController = new LoginUserController(authenticateUserUseCase);

authRouter.post('/login', (req: Request, res: Response, next: NextFunction) =>
    loginUserController.handle(req, res, next)
);

export { authRouter };