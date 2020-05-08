import User from 'models/user/user.model';
import { CreateUserRequest } from 'models/user/user.dataContracts';
import logger from 'utils/logger';

class UserService {
    static getUsers = async () => {
        try {
            return await User.find({});
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    static getUserById = async (id: string) => {
        try {
            return await User.find({ _id: id });
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    static createUser = async (data: CreateUserRequest) => {
        const user = new User({ ...data });
        try {
            return await user.save();
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };
}

export default UserService;
