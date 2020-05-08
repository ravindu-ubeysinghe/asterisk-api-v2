import User from 'models/user/user.model';
import { CreateUserRequest } from 'models/user/user.dataContracts';

export const getUsers = async () => {
    try {
        return await User.find({});
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const getUserById = async (id: string) => {
    try {
        return await User.find({ _id: id });
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const createUser = async (data: CreateUserRequest) => {
    const user = new User({ ...data });
    try {
        return await user.save();
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};
