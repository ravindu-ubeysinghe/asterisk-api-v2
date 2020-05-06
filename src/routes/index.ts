import express, { Application, Request, Response } from 'express';

import userRoutes from './user';

const app: Application = express();

app.use('/api/user', userRoutes);

app.all('*', (req: Request, res: Response) => {
    res.status(404).send('Not Found');
});

export default app;
