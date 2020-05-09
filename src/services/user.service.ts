import { addDays } from 'date-fns';
import jwt from 'jsonwebtoken';
import Service from './Service';
import User, { IUserDocument, UserType } from 'models/user.model';
import logger from 'utils/logger';
import isEmpty from 'lodash/isEmpty';
import { userInfo } from 'os';

class UserService implements Service<IUserDocument> {
    get = async (): Promise<IUserDocument[]> => {
        try {
            return await User.find({}).select('-password');
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    getById = async (id: string): Promise<IUserDocument | null> => {
        try {
            return await User.findOne({ _id: id }).select('-password');
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    getByQuery = async (query: Object): Promise<IUserDocument | boolean | null> => {
        let queryArr: Array<object> = [];
        for (let [key, value] of Object.entries(query)) {
            queryArr = [...queryArr, { [key]: value }];
        }

        if (isEmpty(queryArr)) return false;

        try {
            return await User.findOne({ $or: queryArr });
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    create = async (object: UserType): Promise<IUserDocument> => {
        const user = new User({ ...object });
        try {
            return await user.save();
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await User.deleteOne({ _id: id });
            return true;
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    deleteAll = async (): Promise<boolean> => {
        try {
            await User.deleteMany({});
            return true;
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };

    getJWT = (id: string) => {
        const today = new Date();
        const expiration = addDays(today, 1);

        const JWT =
            process.env.SECRET &&
            jwt.sign(
                {
                    user: id,
                },
                process.env.SECRET,
                {
                    expiresIn: '10h',
                },
            );

        return {
            _id: id,
            token: JWT,
        };
    };
}

export default UserService;
