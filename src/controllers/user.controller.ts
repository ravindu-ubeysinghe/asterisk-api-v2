import express, { Router, Request, Response } from 'express';
import UserService from 'services/user.service';
import { CreateUserRequest } from 'models/user/user.dataContracts';
import response from 'utils/response';
import logger from 'utils/logger';

const router: Router = express.Router();

// TODO: Add proper logging after

/**
 * Route: /api/users/
 * Get all users
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await UserService.getUsers();
        response.success(res, 200, users);
    } catch (err) {
        logger.error(err);
        response.error(res, 500, err.message);
    }
});

/**
 * Route: /api/users/id
 * Get a specific user
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        response.success(res, 200, user);
    } catch (err) {
        logger.error(err);
        response.error(res, 500, err.message);
    }
});

/**
 * Route: /api/users/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
    const userData: CreateUserRequest = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        address: {
            streetOne: req.body.address.streetOne,
            streetTwo: req.body.address.streetTwo,
            city: req.body.address.city,
            postcode: req.body.address.postcode,
            state: req.body.address.state,
            country: req.body.address.country,
        },
    };

    // TODO: Add validator middleware

    try {
        const createdUser = await UserService.createUser(userData);
        response.success(res, 200, createdUser);
    } catch (err) {
        logger.error(err);
        response.error(res, 500, err.message);
    }
});

export default router;
