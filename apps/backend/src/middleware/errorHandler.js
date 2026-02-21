import { logger } from '../config/logger.js';

export function errorHandler(err, req, res, _next) {
    logger.error(`${err.message}\n${err.stack}`);
    const status = err.statusCode || err.status || 500;
    return res.status(status).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}

/** Utility to create HTTP errors cleanly from any service layer. */
export function createError(message, statusCode = 500) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}
