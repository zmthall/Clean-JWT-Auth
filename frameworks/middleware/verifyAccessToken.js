import createError from 'http-errors';
import JWT from 'jsonwebtoken';
import 'dotenv/config';
import { cache } from '../database/node-cache.js';

// This verifyAccessToken Middleware function would be used to implement the functionality of JWT tokens for user privelage management on the client side, this is just an example of its usage. 
export function verifyAccessToken(req, res, next) {
    if(!req.headers['authorization']) return next(createError.Unauthorized());
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createError.Unauthorized(message));
        }

        const userID = payload.aud;

        if(cache.get(userID)) {
            req.payload = payload;
            next();
        } else return next(createError.Unauthorized('Unauthorized')) 
    });
}