import type { Response } from 'express';

export const sendResponse = <T>(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data?: T,
    error?: any
) => {
    return res.status(statusCode).json({
        success,
        message,
        timestamp: new Date().toISOString(),
        ...(data !== undefined && { data }),
        ...(error !== undefined && { error })
    });
};

export const sendSuccess = <T>(res: Response, message: string, data?: T, statusCode: number = 200) => {
    return sendResponse(res, statusCode, true, message, data);
};

export const sendError = (res: Response, message: string, statusCode: number = 500, error?: any) => {
    return sendResponse(res, statusCode, false, message, undefined, error);
};
