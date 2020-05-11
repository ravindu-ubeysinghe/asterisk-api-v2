import express, { Application } from 'express';
import db from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from 'routes';
import { LoggerStream } from 'utils/logger';

const connectToDb = () => {
    process.env.DB_CONNECT &&
        db.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log('connected to db');
        });
};

const startup = (app: Application) => {
    /** Invoke dotenv **/
    dotenv.config();

    /** Middleware **/
    // Enable CORS
    app.use(cors());

    // Use morgan
    app.use(morgan('combined', { stream: new LoggerStream() }));

    // Deal with JSON only
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    /** Mount the routes **/
    app.use(routes);

    /** Connect to DB **/
    connectToDb();
};

export default startup;
