import express, { Application } from 'express';

import boot from 'config/setup';

const app: Application = express();

boot(app);

app.listen(process.env.PORT || 5000, () => console.log('Server is running'));
