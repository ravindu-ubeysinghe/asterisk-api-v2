import db, { Document } from 'mongoose';

export type UserType = {
    name: string;
    email: string;
    password: string;
    phone: Number;
    address: {
        streetOne: string;
        streetTwo?: string;
        city: string;
        postcode: string;
        state: string;
        country: string;
    };
    dateRegistered?: Date;
};

export interface IUserDocument extends Document, UserType {}

const userSchema = new db.Schema({
    name: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 255,
    },
    email: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 1024,
    },
    phone: {
        type: Number,
        required: true,
        minLength: 8,
        maxLength: 15,
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

export default db.model<IUserDocument>('user', userSchema);
