import express, { Application, Request, Response } from 'express';

import UserController from 'controllers/UserController';

const app: Application = express();

app.use('/api/user', UserController);

app.all('*', (req: Request, res: Response) => {
    res.status(404).send('Not Found');
});

export default app;
