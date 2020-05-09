import express, { Application } from 'express';
import db from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from 'routes';
import passport from 'passport';
import auth from 'config/auth';
import path from 'path';
import { LoggerStream } from 'utils/logger';

const connectToDb = () => {
    process.env.DB_CONNECT &&
        db.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log('connected to db');
        });
};

const boot = (app: Application) => {
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

    app.use(express.static(path.join(__dirname, 'public')));
    // process.env.SECRET &&
    //     app.use(session({ secret: process.env.SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
    app.use(passport.initialize());
    auth(passport);

    /** Mount the routes **/
    app.use(routes);

    /** Connect to DB **/
    connectToDb();
};

export default boot;
