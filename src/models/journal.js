//Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
import res from "express/lib/response.js";
import {JournalExercise} from "./journalExercise.js";

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

const Journal = mongoose.model('Journal',
    new mongoose.Schema({
        workoutName: String,
        notes: String,
        dateLogged: String,
        exercises: []
    }));

const createJournal = async (workoutName, notes, dateLogged) => {
    const journal = new Journal({
        workoutName: workoutName,
        notes: notes,
        dateLogged: dateLogged
    });
    await journal.save();
    return journal;
}

// Retrieve all documents and return a promise.
const retrieveJournals = async () => {
    const query = Journal.find();
    return query.exec();
}

const deleteJournalById = async (id) => {
    const journal = await Journal.findById({_id: id})
    console.log("JOURNAL FOUND", journal.exercises);
    let countDeleted = -1;
    if (journal) {
        if (journal.exercises) {
            console.log("This works!")
            let items = journal.exercises
            for (const exercise of items) {
                console.log("ID", exercise._id.toString(), exercise);
                const finish = await JournalExercise.findByIdAndDelete({_id: exercise._id});
                console.log("FINISH", finish);
            }
        }
        const result = await Journal.findByIdAndDelete({_id: id})
        countDeleted = 1;
    }
    return countDeleted;
}
export {Journal, createJournal, retrieveJournals, deleteJournalById};