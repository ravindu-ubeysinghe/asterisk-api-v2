import express, { Router, Request, Response } from 'express';
import { createUser } from 'services/user.service';
import { CreateUserRequest } from 'models/user/user.dataContracts';

const router: Router = express.Router();

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

    try {
        await res.status(200).send(createUser(userData));
    } catch (err) {
        // TODO: Add proper logging after
        console.log(err);
        res.status(500).send(err);
    }
    // res.send(createUser(userData));
});

export default router;
