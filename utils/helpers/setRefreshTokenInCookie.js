import { getDaysInMilliseconds } from './getDaysInMilliseconds.js';

export const setRefreshTokenInCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        maxAge: getDaysInMilliseconds(14),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
};
