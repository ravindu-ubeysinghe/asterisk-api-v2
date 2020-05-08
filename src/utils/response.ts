import { Response } from 'express';
import { GENERIC_ERROR } from 'constants/index';

const response = () => {};

/**
 * Formats and sends a success response
 * @param res
 * @param status
 * @param data
 */
const success = (res: Response, status: number = 200, data: any): void => {
    res.status(status).json({ isSuccess: true, status, data });
};

/**
 * Formats and sends an error response
 * @param res
 * @param status
 * @param message
 */
const error = (res: Response, status: number = 200, message?: String): void => {
    res.status(status).json({ isSuccess: false, status, message: message || GENERIC_ERROR });
};

response.error = error;
response.success = success;

export default response;
