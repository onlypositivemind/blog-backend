import bcrypt from 'bcrypt';
import { UserModel } from '../models/user-model.js';
import { UserDto } from '../dtos/user-dto.js';
import { tokenService } from './token-service.js';
import { ApiError } from '../exceptions/api-error.js';

const generateTokensAndSaveRefreshToken = async (userDto) => {
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return tokens;
};

class UserService {
    async registration({ email, username, password }) {
        const existUsername = await UserModel.findOne({ username });
        if (existUsername) {
            throw ApiError.BadRequest('Username cannot be used. Please choose another username.');
        }

        const existEmail = await UserModel.findOne({ email });
        if (existEmail) {
            throw ApiError.BadRequest('A user is already registered with this e-mail address.');
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await UserModel.create({ email, username, password: hashPassword });

        const userDto = new UserDto(user);
        const tokens = await generateTokensAndSaveRefreshToken(userDto);

        return { tokens: { ...tokens }, user: { ...userDto } };
    }

    async login({ username, password }) {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw ApiError.BadRequest(
                'The username and/or password you specified are not correct.',
            );
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            throw ApiError.BadRequest(
                'The username and/or password you specified are not correct.',
            );
        }

        const userDto = new UserDto(user);
        const tokens = await generateTokensAndSaveRefreshToken(userDto);

        return { tokens: { ...tokens }, user: { ...userDto } };
    }

    async logout(refreshToken) {
        const logoutInfo = await tokenService.removeToken(refreshToken);
        return logoutInfo;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findRefreshToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);

        const userDto = new UserDto(user);
        const tokens = await generateTokensAndSaveRefreshToken(userDto);

        return { tokens: { ...tokens }, user: { ...userDto } };
    }
}

export const userService = new UserService();
