import { Application } from 'express';
import db from 'mongoose';

import routes from 'routes';

const connectToDb = () => {
    db.connect(
        `mongodb+srv:${process.env.DB_USERNAME}//:<${process.env.DB_PASSWORD}>@cluster0-i1uux.mongodb.net/test?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log('connected to db');
        },
    );
};

const boot = (app: Application) => {
    connectToDb();
    app.use(routes);
};

export default boot;
