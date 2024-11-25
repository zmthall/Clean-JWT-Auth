import JWT from 'jsonwebtoken';
import createError from 'http-errors';
import 'dotenv/config';
import { cache } from '../database/node-cache.js';

export const jwtService = {
    signAccessToken: async (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '1hr',
                issuer: 'website-domain.web',
                audience: userID
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) {
                    console.log(err.message);
                    return reject(createError.InternalServerError());
                }
                resolve(token);
            })
        })
    },
    signRefreshToken: async (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'website-domain.web',
                audience: userID
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) {
                    console.log(err.message);
                    return reject(createError.InternalServerError());
                }
                if(cache.set(userID, token, 365 * 24 * 60 * 60))
                    resolve(token);
                else {
                    reject(createError.InternalServerError());
                    return;
                }
            })
        })
    },
    verifyRefreshToken: async (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken, 
                process.env.REFRESH_TOKEN_SECRET, 
                (err, payload) => {
                    if(err) return reject(createError.Unauthorized());

                const userID = payload.aud;
                const result = cache.get(userID);
                
                if(refreshToken === result) return resolve(userID);
                else reject(createError.Unauthorized());
            })
        })
    }
}