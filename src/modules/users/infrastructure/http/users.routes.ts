import { Router } from 'express';
import { RegisterUserController } from './controllers/register-user.controller';

const router = Router();

router.post('/register', RegisterUserController.handle);

export const userRoutes = router;