//Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
import res from "express/lib/response.js";

// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
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

const Quote = mongoose.model('Quote',
    new mongoose.Schema({
        quote: String,
        author: String,
    }));

const createQuote = async (quote, author) => {
    const quotes = new Quote({
        quote: quote,
        author: author,
    });
    await quotes.save();
    return quotes;
}

// Retrieve all documents and return a promise.
const retrieveRandomQuote = async () => {
    const query = Quote.aggregate([{$sample: {size: 1}}])
    return query.exec();
}

export {Quote, createQuote, retrieveRandomQuote};