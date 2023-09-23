import { validationResult } from 'express-validator';
import { userService } from '../services/user.service.js';
import { ApiError } from '../exceptions/apiError.js';
import { setRefreshTokenInCookie } from '../utils/helpers/setRefreshTokenInCookie.js';
import { makeAuthResponse } from '../utils/helpers/makeAuthResponse.js';

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation errors', errors.array()));
            }

            const { email, username, password } = req.body;
            const userData = await userService.registration({ email, username, password });

            setRefreshTokenInCookie(res, userData.tokens.refreshToken);

            return res.json(makeAuthResponse(userData));
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const userData = await userService.login({ username, password });

            setRefreshTokenInCookie(res, userData.tokens.refreshToken);

            return res.json(makeAuthResponse(userData));
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const logoutInfo = await userService.logout(refreshToken);

            res.clearCookie('refreshToken');

            return res.status(200).json(logoutInfo);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);

            setRefreshTokenInCookie(res, userData.tokens.refreshToken);

            return res.json(makeAuthResponse(userData));
        } catch (e) {
            next(e);
        }
    }
}

export const userController = new UserController();
