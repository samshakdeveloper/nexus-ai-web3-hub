import { Router } from 'express';
import { RegisterUserController } from './controllers/register-user.controller';
import { validateBody } from '@shared/infrastructure/http/middlewares/validation.middleware';
import { registerUserSchema } from './validators/register-user.schema';

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema), // اعتبارسنجی لبه سیستم پیش از کنترلر
    RegisterUserController.handle
);

export const userRoutes = router;