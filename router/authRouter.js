import { Router } from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/user.controller.js';

const authRouter = new Router();

authRouter.post(
    '/registration',
    body('username').isLength({ min: 3, max: 20 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    userController.registration,
);
authRouter.post('/login', userController.login);
authRouter.post('/logout', userController.logout);
authRouter.get('/refresh', userController.refresh);

export { authRouter };
