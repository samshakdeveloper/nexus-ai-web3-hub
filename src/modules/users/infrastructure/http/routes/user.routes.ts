import { Router } from 'express';
import { UserController } from '@modules/users/infrastructure/http/controllers/user.controller';
import { CreateUserUseCase } from '@modules/users/application/use-cases/create-user.use-case';
import { AuthenticateUser } from '@modules/users/application/use-cases/authenticate-user';
import { MongoUserRepository } from '@modules/users/infrastructure/repositories/mongo-user.repository';

const userRouter = Router();

const userRepository = new MongoUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const authenticateUserUseCase = new AuthenticateUser(userRepository);
const userController = new UserController(createUserUseCase, authenticateUserUseCase);

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);

export { userRouter };