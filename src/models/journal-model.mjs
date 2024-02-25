/*
// Models for Journal entry

// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
    if(err){
        res.status(500).json({ Error: 'Could not connect to database' });
    } else  {
        console.log('Success: Unique and specific success message.');
    }
});

// SCHEMA: Define the collection's schema.
const journalSchema = mongoose.Schema({
    workoutName:    { type: String, required: true },
    exercise:     { type: String, required: true },
    exerciseType: { type: String, required: true },
    sets: {type: number, required: true },
    reps:    { type: Number, required: true },
    rest:    { type: Number, required: true },
    load:    { type: Number, required: true },
    notes:    { type: String, required: false },
    dateLogged:    { type: Date, default: Date.now, required: true }
});

// Compile the model from the schema
// by defining the collection name "Journal".
const journals = mongoose.model('Journal', journalSchema);


// CREATE model *****************************************
const createJournal = async (workoutName, exercise, exerciseType, sets, reps, rest, load, notes, dateLogged) => {
    const journal = new journals({
        workoutName: workoutName,
        exercise: exercise,
        exerciseType: exerciseType,
        sets: sets,
        reps: reps,
        rest: rest,
        load: load,
        notes: notes,
        dateLogged: dateLogged
    });
    return journal.save();
}*/
