import express, { Router, Request, Response } from 'express';
import { createUser } from 'services/UserService';
import CreateUserRequest from 'models/User/DataContracts/CreateUserRequest';

const router: Router = express.Router();

router.post('/register', (req: Request, res: Response) => {
    console.log('here');
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
    res.send(createUser(userData));
});

export default router;
