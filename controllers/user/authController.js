import Joi from "joi";
import createError from 'http-errors';

async function registerResponseHandler(controllerFunc, req, res, next) {
    try {
        const result = await controllerFunc(req);

        res.status(result.status || 200).json({ success: true, response: result });
    } catch (error) {
        if(error.isJoi) error.status = 422;
        next(error);
    }
}

async function loginResponseHandler(controllerFunc, req, res, next) {
    try {
        const result = await controllerFunc(req);

        res.status(result.status || 200).json({ success: true, response: result });
    } catch (error) {
        if(error.isJoi)
            error = createError.BadRequest('Invalid Username/Password Combination');
        next(error);
    }
}

async function refreshTokenResponseHandler(controllerFunc, req, res, next) {
    try {
        const result = await controllerFunc(req);

        res.status(result.status || 200).json({ success: true, response: result });
    } catch (error) {
        next(error);
    }
}

async function logoutResponseHandler(controllerFunc, req, res, next) {
    try {
        const result = await controllerFunc(req);

        res.status(result.status || 200).json({ success: true, response: result});
    } catch (error) {
        next(error);
    }
};


export function makeAuthController({ registerUser, loginUser, refreshToken, logoutUser }) {
    return {
        registerUser: async (req, res, next) => registerResponseHandler(async (req) => {
            return await registerUser(req.body);
        }, req, res, next),
        loginUser: async (req, res, next) => loginResponseHandler(async (req) => {
            return await loginUser(req.body);
        }, req, res, next),
        refreshToken: async (req, res, next) => refreshTokenResponseHandler(async (req) => {
            return await refreshToken(req.body);
        }, req, res, next),
        logoutUser: async (req, res, next) => logoutResponseHandler(async (req) => {
            return await logoutUser(req.body);
        }, req, res, next)
    }
}