import { Request, Response, NextFunction } from 'express';
import jwtSimple from 'jwt-simple';
import UserService from 'services/user.service';
import response from 'utils/response';
import logger from 'utils/logger';
import { isValid, differenceInMinutes } from 'date-fns';
import { _401_UNAUTHORIZED } from 'constants/user';

const userService = new UserService();

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const tokenFromHeader = req.headers.authorization;
    if (!tokenFromHeader || !process.env.SECRET) return response.error(res, 401, _401_UNAUTHORIZED);

    try {
        const decoded = jwtSimple.decode(tokenFromHeader, process.env.SECRET);
        if (!decoded) return response.error(res, 401, _401_UNAUTHORIZED);
        try {
            const user = await userService.getById(decoded.user);
            // Check if the token provided is still valid by comparing it with the token saved in the database
            if (user && user?.token === tokenFromHeader) {
                req.user = { id: user._id, role: user.role };
                await reIssueTokenIfExpired(res, decoded.exp, decoded.user);
                return next();
            }

            return response.error(res, 401, _401_UNAUTHORIZED);
        } catch (err) {
            logger.error(err);
            return response.error(res, 401, err);
        }
    } catch (err) {
        logger.error(err);
        return response.error(res, 401, err);
    }
};

const reIssueTokenIfExpired = async (res: Response, exp: number, id: string) => {
    if (isValid(exp) && differenceInMinutes(exp, new Date()) < parseInt(process.env.SECRET_CLOSE_TO_EXPIRY || '10')) {
        try {
            const token = await userService.generateJWT(id);
            res.set('Authorization', token);
        } catch (err) {
            logger.error('Token renewal' + err);
        }
    }

    // TODO: Implement a two token system
    // NewToken: the new token issued from here at the first instance where the condition is met
    // OldToken: the old token to be used by requests that may have been invoked prior to the frontend token is changed
    // OldToken will be usable until it expires, at which point it will be deleted from the database
    // This way there will be overlay between the two tokens where both NewToken and OldToken are usable
    // which will be the same as process.env.SECRET_CLOSE_TO_EXPIRY
};

export default isAuthenticated;
