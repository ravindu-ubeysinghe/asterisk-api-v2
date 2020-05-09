import express, { Router, Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import passport from 'passport';
import UserService from 'services/user.service';
import { UserType } from 'models/user.model';
import response from 'utils/response';
import logger from 'utils/logger';
import { USER_ALREADY_EXISTS, USER_DOES_NOT_EXIST, INVALID_LOGIN } from 'constants/user';

const router: Router = express.Router();
const userService: UserService = new UserService();

/**
 * Route: /api/users/
 * Get all users
 */
router.get('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        const users = await userService.get();
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
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        const user = await userService.getById(req.params.id);
        response.success(res, 200, user);
    } catch (err) {
        logger.error(err);
        response.error(res, 500, err.message);
    }
});

/**
 * Route: /api/users/login
 * Logins in a user
 */
router.post(
    '/login',
    [check('email').exists().isEmail(), check('password').isLength({ min: 6, max: 20 })],
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return response.error(res, 400, JSON.stringify(errors));

        const user = await userService.getByQuery({ email });
        if (!user) return response.error(res, 400, USER_DOES_NOT_EXIST);

        const validLogin = typeof user !== 'boolean' ? bcrypt.compareSync(password, user.password) : false;
        if (!validLogin) return response.error(res, 401, INVALID_LOGIN);

        // Generate JWT
        const token = typeof user !== 'boolean' && userService.getJWT(user._id);
        return response.success(res, 200, { user: token });
    },
);

/**
 * Route: /api/users/register
 * Register a new user
 */
router.post(
    '/register',
    [
        check('name').exists(),
        check('email').exists().isEmail(),
        check('password').isLength({ min: 6, max: 20 }),
        check('phone').isLength({ min: 8, max: 15 }).isNumeric(),
        check('address.streetOne').exists(),
        check('address.streetTwo').optional(),
        check('address.city').exists(),
        check('address.postcode').exists(),
        check('address.state').exists(),
        check('address.country').exists(),
    ],
    async (req: Request, res: Response) => {
        const {
            name,
            email,
            password,
            phone,
            address: { streetOne, streetTwo, city, postcode, state, country },
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return response.error(res, 400, JSON.stringify(errors));

        const userAlreadyExists = await userService.getByQuery({ email, phone });
        if (userAlreadyExists) return response.error(res, 400, USER_ALREADY_EXISTS);

        const userData: UserType = {
            name: name,
            email: email,
            password: bcrypt.hashSync(password, 10),
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

        try {
            const createdUser = await userService.create(userData);
            return response.success(res, 200, { user: { _id: createdUser._id } });
        } catch (err) {
            logger.error(err);
            return response.error(res, 500, err.message);
        }
    },
);

export default router;
