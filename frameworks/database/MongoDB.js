import mongoose from "mongoose";
import 'dotenv/config';

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_NAME,
}).catch(err => console.log(err.message));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB...');
});

mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB...');
});