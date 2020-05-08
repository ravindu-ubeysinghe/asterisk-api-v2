import express, { Router, Request, Response } from 'express';
import { createUser, getUsers, getUserById } from 'services/user.service';
import { CreateUserRequest } from 'models/user/user.dataContracts';
import response from 'utils/response';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        response.success(res, 200, users);
    } catch (err) {
        // TODO: Add proper logging after
        response.error(res, 500, err.message);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await getUserById(req.params.id);
        response.success(res, 200, user);
    } catch (err) {
        // TODO: Add proper logging after
        response.error(res, 500, err.message);
    }
});

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
        const createdUser = await createUser(userData);
        response.success(res, 200, createdUser);
    } catch (err) {
        response.error(res, 500, err.message);
    }
});

export default router;
