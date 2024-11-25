import createError from 'http-errors';
import Joi from 'joi';
import { userValidation } from '../../entities/user.js';

export function makeLoginUser({ UserRepo }, { signAccessToken, signRefreshToken }) {
    return async function loginUser({ email, password }) {
        const result = await userValidation({ email, password }, true);

        const user = await UserRepo.findOne({ email: result.email });
        if(!user) throw createError.NotFound('User is not regisered');

        const isMatch = await user.isValidPassword(result.password);
        if(!isMatch) throw createError.Unauthorized('Username/Password is not valid');

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        return { accessToken, refreshToken };
    }
}