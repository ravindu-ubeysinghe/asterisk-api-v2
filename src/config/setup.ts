import express, { Application } from 'express';
import db from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from 'routes';
import { LoggerStream } from 'utils/logger';

const connectToDb = () => {
    db.connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-i1uux.mongodb.net/test?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log('connected to db');
        },
    );
};

const boot = (app: Application) => {
    /** Invoke dotenv **/
    dotenv.config();

    /** DB **/
    connectToDb();

    /** Middleware **/

    // Deal with JSON only
    app.use(express.json());

    // Use morgan
    app.use(morgan('combined', { stream: new LoggerStream() }));

    /**  Mount the routes **/
    app.use(routes);
};

export default boot;
