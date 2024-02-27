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

const Exercises = new mongoose.Schema({
    exercise: String,
    exerciseType: String,
    sets: Number,
    reps: Number,
    rest: Number,
    load: Number
})

const WorkoutProgram = mongoose.model('WorkoutProgram',
    new mongoose.Schema({
        programName: String,
        monday: [Exercises],
        tuesday: [Exercises],
        wednesday: [Exercises],
        thursday: [Exercises],
        friday: [Exercises],
        saturday: [Exercises],
        sunday: [Exercises],
    }));

const createWorkoutProgram = async (programName, monday, tuesday, wednesday, thursday, friday, saturday, sunday) => {
    const workoutProgram = new WorkoutProgram({
        programName: programName,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday
    });
    console.log(workoutProgram);
    await workoutProgram.save();
    return workoutProgram;
}

const retrieveProgramByName = async (program) => {
    const query = WorkoutProgram.find({programName: program}, {_id: 0});
    return query.exec();
}

export {WorkoutProgram, createWorkoutProgram, retrieveProgramByName}