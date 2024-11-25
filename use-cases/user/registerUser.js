import createError from 'http-errors';
import { userValidation } from '../../entities/user.js';

export function makeRegisterUser({ UserRepo }, { signAccessToken, signRefreshToken }) {
    return async function registerUser({ email, password }) {
        const result = await userValidation({ email, password });
        if(!email || !password) throw createError.BadRequest();
        const doesExist = await UserRepo.findOne({ email: result.email });
        if(doesExist) throw createError.Conflict(`${result.email} is already registered`);
        
        const user = new UserRepo(result);
        const savedUser = await user.save();

        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefreshToken(savedUser.id);

        return { accessToken, refreshToken };
    }
}