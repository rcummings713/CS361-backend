//Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
import res from "express/lib/response.js";
import {JournalExercise} from "./journalExercise.js";

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

const WorkoutTemplate = mongoose.model('WorkoutTemplate',
    new mongoose.Schema({
        templateName: String,
        description: String,
        dateCreated: String,
        exercises: []
    }));

const createTemplate = async (templateName, description, dateCreated) => {
    const workoutTemplate = new WorkoutTemplate({
        templateName: templateName,
        description: description,
        dateCreated: dateCreated
    });
    await workoutTemplate.save();
    return workoutTemplate;
}

// Retrieve all documents and return a promise.
const retrieveTemplates = async () => {
    const query = WorkoutTemplate.find();
    return query.exec();
}

const deleteTemplateById = async (id) => {
    const workoutTemplate = await WorkoutTemplate.findById({_id: id})
    console.log("Template FOUND", workoutTemplate.exercises);
    let countDeleted = -1;
    if (workoutTemplate) {
        if (workoutTemplate.exercises) {
            console.log("This works!")
            let items = workoutTemplate.exercises
            for (const exercise of items) {
                console.log("ID", exercise._id.toString(), exercise);
                const finish = await JournalExercise.findByIdAndDelete({_id: exercise._id});
                console.log("FINISH", finish);
            }
        }
        const result = await WorkoutTemplate.findByIdAndDelete({_id: id})
        countDeleted = 1;
    }
    return countDeleted;
}
export {WorkoutTemplate, createTemplate, retrieveTemplates, deleteTemplateById};