import createError from 'http-errors';
import { cache } from '../../frameworks/database/node-cache.js';

export function makeLogoutUser({ verifyRefreshToken }) {
    return async function logoutUser({ refreshToken }) {
        if(!refreshToken) throw createError.BadRequest();
        const userID = await verifyRefreshToken(refreshToken);
        

        if(cache.del(userID) === 1) 
        return {
            success: true,
            status: 204
        };
        else throw createError.Unauthorized();
    }
}