"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("routes/auth"));
const connectToDb = () => {
    mongoose_1.default.connect(`mongodb+srv:${process.env.DB_USERNAME}//:<${process.env.DB_PASSWORD}>@cluster0-i1uux.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('connected to db');
    });
};
const registerRoutes = () => {
    const app = express_1.default();
    // Register Routes
    app.use('/api/user', auth_1.default);
};
const boot = () => {
    connectToDb();
    registerRoutes();
};
exports.default = boot;
