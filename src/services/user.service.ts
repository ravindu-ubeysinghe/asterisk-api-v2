import { Document } from 'mongoose';
import Service from './Service';
import User, { IUserDocument, UserType } from 'models/user.model';
import logger from 'utils/logger';
import isEmpty from 'lodash/isEmpty';

class UserService implements Service<IUserDocument> {
    get = async (): Promise<IUserDocument[]> => {
        try {
            return await User.find({});
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    };
    getById = async (id: string): Promise<IUserDocument | null> => {
        try {
            return await User.findOne({ _id: id });
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
}

export default UserService;
