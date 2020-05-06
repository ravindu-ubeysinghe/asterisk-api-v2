import express from 'express';

import boot from 'config/setup';

boot();

const app = express();
app.listen(process.env.PORT || 5000, () => console.log('Server is running'));
