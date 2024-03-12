//Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
import res from "express/lib/response.js";

// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_URI,
    {useNewUrlParser: true}
);
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
    if (err) {
        res.status(500).json({Error: 'Could not connect to database'});
    } else {
        console.log('Success: Unique and specific success message.');
    }
});

const User = mongoose.model('User',
    new mongoose.Schema({
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true},
        userName: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    }));

const createUser = async (firstName, lastName, email, userName, password) => {
    const user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        userName: userName,
        password: password
    });
    await user.save();
    return user;
}

const findUser = async (userName, password) => {
    return await User.findOne({userName: userName, password: password});
}

export {createUser, findUser, User};