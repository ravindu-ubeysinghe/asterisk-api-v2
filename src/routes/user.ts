import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.post('/register', (req: Request, res: Response) => {
    res.send('Register');
});

router.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

export default router;
