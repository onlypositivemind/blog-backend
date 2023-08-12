import { Router } from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/user-controller.js';

export const router = new Router();

// Auth
router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 20 }),
    userController.registration,
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
