import { Response } from 'express';
import { GENERIC_ERROR } from 'constants/index';

const response = () => {};

/**
 * Formats and sends a success response
 * @param res
 * @param status
 * @param data
 */
const success = (res: Response, status: number = 200, data?: any): void => {
    res.status(status).json({ isSuccess: true, status, data: data || {} });
};

/**
 * Formats and sends an error response
 * @param res
 * @param status
 * @param message
 */
const error = (res: Response, status: number = 200, error?: string): void => {
    res.status(status).json({ isSuccess: false, status, error: error || GENERIC_ERROR });
};

response.error = error;
response.success = success;

export default response;
