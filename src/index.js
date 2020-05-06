import express from 'express';
import authRoutes from 'routes/auth';
import mongoose from 'mongoose';

const app = express();

// Register Routes
app.use('/api/user', authRoutes);

// Connect to Mongo db
mongoose.connect(
    `mongodb+srv:${process.env.DB_USERNAME}//:<${process.env.DB_PASSWORD}>@cluster0-i1uux.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('connected to db');
    },
);

app.listen(5000, () => console.log('Server is running'));
