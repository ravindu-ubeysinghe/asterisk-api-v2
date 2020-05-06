import { Request, Response } from 'express';
import db from 'mongoose';
import User from 'models/User/User';
import CreateUserRequest from 'models/User/DataContracts/CreateUserRequest';

export const createUser = (data: CreateUserRequest) => {
    return 'created successfully';
};
