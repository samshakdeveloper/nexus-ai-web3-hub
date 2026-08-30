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

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Pass123456!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
userRouter.post('/register', userController.register);

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Authenticate user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Pass123456!
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Invalid credentials
 */
userRouter.post('/login', userController.login);

export { userRouter };