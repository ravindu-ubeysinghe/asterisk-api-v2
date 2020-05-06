import express, { Application } from 'express';
import db from 'mongoose';

import authRoutes from 'routes/auth';

const connectToDb = () => {
    db.connect(
        `mongodb+srv:${process.env.DB_USERNAME}//:<${process.env.DB_PASSWORD}>@cluster0-i1uux.mongodb.net/test?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log('connected to db');
        },
    );
};

const registerRoutes = () => {
    const app: Application = express();
    // Register Routes
    app.use('/api/user', authRoutes);
};

const boot = () => {
    connectToDb();
    registerRoutes();
};

export default boot;
