import express, { Router, Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import isEmpty from 'lodash/isEmpty';
import isAuthenticated from 'middleware/isAuthenticated';
import isSuperAdmin from 'middleware/isSuperAdmin';
import UserService from 'services/user.service';
import { UserType } from 'models/user.model';
import response from 'utils/response';
import { filterOutFields } from 'utils/mongodb';
import {
    _400_USER_ALREADY_EXISTS,
    _400_USER_DOES_NOT_EXIST,
    _400_INVALID_LOGIN,
    _403_NO_ACCESS,
    _404_NOT_FOUND,
} from 'constants/user';

const router: Router = express.Router();
const userService: UserService = new UserService();

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
        if (!user) return response.error(res, 400, _400_USER_DOES_NOT_EXIST);

        const validLogin = typeof user !== 'boolean' ? bcrypt.compareSync(password, user.password) : false;
        if (!validLogin) return response.error(res, 401, _400_INVALID_LOGIN);

        // Generate JWT
        const token = typeof user !== 'boolean' ? await userService.generateJWT(user._id) : undefined;
        res.set('Authorization', token);
        return response.success(res, 200, { user: typeof user !== 'boolean' && user._id });
    },
);

/**
 * Route: /api/users/logout
 * Logs out a user
 */

router.post('/logout', isAuthenticated, async (req: Request, res: Response) => {
    const { id }: any = req.user;
    try {
        await userService.invalidateJWT(id);
        return response.success(res, 200);
    } catch (err) {
        return response.error(res, 500, err.message);
    }
});

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
            role,
            address: { streetOne, streetTwo, city, postcode, state, country },
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return response.error(res, 400, JSON.stringify(errors));

        const userAlreadyExists = await userService.getByQuery({ email, phone });
        if (userAlreadyExists) return response.error(res, 400, _400_USER_ALREADY_EXISTS);

        // TODO: Shouldn't be able to register with role 'SuperAdmin'

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
            role: role,
        };

        try {
            const createdUser = await userService.create(userData);
            return response.success(res, 200, { user: { _id: createdUser._id } });
        } catch (err) {
            return response.error(res, 500, err.message);
        }
    },
);

/**
 * Route: /api/users/
 * Get all users
 */
router.get('/', isAuthenticated, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        const users = filterOutFields(await userService.get(), ['password', 'token']);
        if (isEmpty(users)) return response.success(res, 404, _404_NOT_FOUND);
        response.success(res, 200, users);
    } catch (err) {
        response.error(res, 500, err.message);
    }
});

/**
 * Route: /api/users/id
 * Get a specific user
 */
router.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
    // Checking if the user requesting === the user requested unless they are an admin
    const { id, role }: any = req.user;
    if (role !== 'Admin' && id != req.params.id) return response.error(res, 403, _403_NO_ACCESS);
    try {
        const user = await userService.getById(req.params.id);
        if (!user) return response.error(res, 404, _404_NOT_FOUND);
        const userFiltered = filterOutFields(user, ['password', 'token']);
        response.success(res, 200, userFiltered);
    } catch (err) {
        response.error(res, 500, err.message);
    }
});

/**
 * Route: /api/users/id
 * Delete all users (Only SuperAdmins are allowed)
 */
router.delete('/{id}', isAuthenticated, async (req: Request, res: Response) => {
    try {
        await userService.delete(req.params.id);
        response.success(res, 200);
    } catch (err) {
        response.error(res, 500, err.message);
    }
});

/**
 * Route: /api/users/
 * Delete all users (Only SuperAdmins are allowed)
 */
router.delete('/', isAuthenticated, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        await userService.deleteAll();
        response.success(res, 200);
    } catch (err) {
        response.error(res, 500, err.message);
    }
});

export default router;
