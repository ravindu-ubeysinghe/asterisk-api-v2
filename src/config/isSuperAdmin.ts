import { Request, Response, NextFunction } from 'express';
import response from 'utils/response';
import { NO_ACCESS } from 'constants/user';
import UserService from 'services/user.service';

const userService = new UserService();

const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { id, role }: any = req.user || {};
    if (!id || !role) return response.error(res, 403, NO_ACCESS);

    const user = await userService.getById(id);
    if (user && user.role === process.env.SUPER_USER_ACCESS && role === process.env.SUPER_USER_ACCESS) {
        return next();
    }

    return response.error(res, 403, NO_ACCESS);
};

export default isSuperAdmin;
