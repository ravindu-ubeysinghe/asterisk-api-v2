import express, { Application } from 'express';

import startup from 'config/startup';

const app: Application = express();

startup(app);

app.listen(process.env.PORT || 5000, () => console.log('Server is running'));
