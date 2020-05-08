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

    static getUserById = async (id: String) => {
        try {
            return await User.findOne({ _id: id });
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    static getUserByEmailOrPhone = async (email: String, phone: String) => {
        try {
            return await User.findOne({ $or: [{ email: email }, { phone: phone }] });
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
