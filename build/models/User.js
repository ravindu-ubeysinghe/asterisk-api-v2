"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    phone: {
        type: Number,
        required: true,
        min: 6,
        max: 255,
    },
    address: {
        streetOne: {
            type: String,
            required: true,
        },
        streetTwo: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        postcode: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    dateRegistered: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model('user', userSchema);
