import express from 'express';
import mongoose from 'mongoose';

import authRoutes from 'routes/auth';

const connectToDb = () => {
    mongoose.connect(
        `mongodb+srv:${process.env.DB_USERNAME}//:<${process.env.DB_PASSWORD}>@cluster0-i1uux.mongodb.net/test?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log('connected to db');
        },
    );
};

const registerRoutes = () => {
    const app = express();
    // Register Routes
    app.use('/api/user', authRoutes);
};

const boot = () => {
    connectToDb();
    registerRoutes();
};

export default boot;
