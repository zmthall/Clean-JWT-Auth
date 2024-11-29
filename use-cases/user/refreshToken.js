import createError from 'http-errors';

export function makeRefreshToken({ signAccessToken, signRefreshToken, verifyRefreshToken }) {
    return async function refreshToken({ refreshToken }) {
        if(!refreshToken) throw createError.BadRequest()

        const userID = await verifyRefreshToken(refreshToken);

        const newAccessToken = await signAccessToken(userID);
        const newRefreshToken = await signRefreshToken(userID);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken }
    }
}