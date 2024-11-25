import createError from 'http-errors';

export async function notFoundError(req, res, next) {
    next(createError.NotFound());
}

export async function errorHandling(err, req, res, next) {
    res.status(err.status || 500).json({
        success: false,
        error: {
            status: err.status || 500,
            message: err.message,
        }
    });
}