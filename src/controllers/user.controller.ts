import express, { Router, Request, Response, NextFunction } from 'express';
import UserService from 'services/user.service';
import { CreateUserRequest } from 'models/user/user.dataContracts';
import { check, validationResult } from 'express-validator';
import response from 'utils/response';
import logger from 'utils/logger';

const router: Router = express.Router();

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
router.post(
    '/register',
    [
        check('name').notEmpty(),
        check('email').notEmpty().isEmail(),
        check('password').isLength({ min: 6, max: 20 }),
        check('phone').isLength({ min: 8, max: 15 }).isNumeric(),
        check('address.streetOne').notEmpty(),
        check('address.streetTwo').optional(),
        check('address.city').notEmpty(),
        check('address.postcode').notEmpty(),
        check('address.state').notEmpty(),
        check('address.country').notEmpty(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            name,
            email,
            password,
            phone,
            address: { streetOne, streetTwo, city, postcode, state, country },
        } = req.body;

        const userData: CreateUserRequest = {
            name: name,
            email: email,
            password: password,
            phone: phone,
            address: {
                streetOne: streetOne,
                streetTwo: streetTwo,
                city: city,
                postcode: postcode,
                state: state,
                country: country,
            },
        };

        const errors = validationResult(req);
        if (errors) return response.error(res, 400, JSON.stringify(errors));

        try {
            const createdUser = await UserService.createUser(userData);
            response.success(res, 200, createdUser);
        } catch (err) {
            logger.error(err);
            response.error(res, 500, err.message);
        }
    },
);

export default router;
