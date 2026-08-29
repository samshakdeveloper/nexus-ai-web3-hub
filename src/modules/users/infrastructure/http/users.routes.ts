import { Router } from 'express';
import { RegisterUserController } from './controllers/register-user.controller';
import { LoginUserController } from './controllers/login-user.controller';
import { validateBody } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { registerUserSchema } from './validators/register-user.schema';
import { loginUserSchema } from './validators/login-user.schema';

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema),
    RegisterUserController.handle
);

router.post(
    '/login',
    validateBody(loginUserSchema),
    LoginUserController.handle
);

export const userRoutes = router;