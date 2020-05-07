import { Request, Response } from 'express';
import db from 'mongoose';
import User from 'models/user/user.model';
import { CreateUserRequest } from 'models/user/user.dataContracts';

export const createUser = async (data: CreateUserRequest) => {
    const user = new User(data);
    try {
        return await user.save();
    } catch (err) {
        throw new Error(err.message);
    }
};
