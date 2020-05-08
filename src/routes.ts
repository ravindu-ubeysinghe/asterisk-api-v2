import express, { Application, Request, Response } from 'express';
import UserController from 'controllers/user.controller';
import response from 'utils/response';

const app: Application = express();

app.get('/health', (req: Request, res: Response) => {
    response.success(res, 200);
});

app.use('/api/users', UserController);

app.all('*', (req: Request, res: Response) => {
    response.error(res, 404, 'Not Found');
});

export default app;
