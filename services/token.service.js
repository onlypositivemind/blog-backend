import jwt from 'jsonwebtoken';
import { tokenModel } from '../models/tokenModel.js';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '15m',
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '14d',
        });

        return { accessToken, refreshToken };
    }

    validateAccessToken(accessToken) {
        try {
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(refreshToken) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        return tokenModel.create({ user: userId, refreshToken });
    }

    async removeToken(refreshToken) {
        return tokenModel.deleteOne({ refreshToken });
    }

    async findRefreshToken(refreshToken) {
        return tokenModel.findOne({ refreshToken });
    }
}

export const tokenService = new TokenService();
