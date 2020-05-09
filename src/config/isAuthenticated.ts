import { Request, Response, NextFunction } from 'express';
import jwtSimple from 'jwt-simple';
import UserService from 'services/user.service';
import response from 'utils/response';
import logger from 'utils/logger';
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

export default isAuthenticated;
