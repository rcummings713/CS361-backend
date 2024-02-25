import mongoose from "mongoose";
import {Journal} from "./journal.js";
import {journalExercise} from "./index.js";

const JournalExercise = mongoose.model('JournalExercise',
    new mongoose.Schema({
        exercise: String,
        exerciseType: String,
        sets: Number,
        reps: Number,
        rest: Number,
        load: Number
    })
);

const createExercise = async (exercise, exerciseType, sets, reps, rest, load) => {
    const journalExercise = new JournalExercise({
        exercise: exercise,
        exerciseType: exerciseType,
        sets: sets,
        reps: reps,
        rest: rest,
        load: load
    });
    await journalExercise.save();
    return journalExercise;
}

export {JournalExercise, createExercise};