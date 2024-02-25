// Controllers for the workout app

import 'dotenv/config';
import express from 'express';
import * as models from './models/index.js';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());  // REST needs JSON MIME type.

// CREATE controller ******************************************
app.post('/createJournal', (req, res) => {
    console.log('TESTING CREATE');
    console.log(req.body);
    models.journals.createJournal(
        req.body[0].workoutName,
        req.body[0].notes,
        new Date().toLocaleString()
    ).then(newJournal => {
        console.log(req.body)
        Object.values(req.body).slice(1).forEach(exercise => {
            models.journalExercise.createExercise(
                exercise.exercise,
                exercise.exerciseType,
                exercise.sets,
                exercise.reps,
                exercise.rest,
                exercise.load
            ).then(exerciseCreated => {
                console.log(exerciseCreated);
                console.log(newJournal._id);
                models.journals.Journal.findByIdAndUpdate(
                    newJournal._id.toString(),
                    {$push: {exercises: exerciseCreated}},
                    {new: true, useFindAndModify: false},
                    () => console.log("updated journal", newJournal._id)
                )
            })
        })
        res.status(200).json(newJournal);
    })
});

app.get('/getJournals', (req, res) => {
    console.log('TESTING GET JOURNALS');
    models.journals.retrieveJournals().then(journals => {
        console.log(journals);
        res.status(200).json(journals);
    })
})

app.delete(`/deleteJournal/:id`, (req, res) => {
    console.log("GIVEN", req.params);
    models.journals.deleteJournalById(req.params.id).then((deletedCount) => {
        if (deletedCount === 1) {
            console.log(`Based on its ID, ${deletedCount} journal was deleted.`);
            res.status(200).send({Success: 'Success: journal deleted'});
        } else {
            res.status(404).json({Error: 'Not found: journal associated provided id was not found'});
        }
    }).catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Bad Request: issue with request made to server'});
    });
})

app.post('/addQuote', (req, res) => {
    console.log('TESTING CREATE QUOTE');
    console.log(req.body);
    req.body.forEach(item => {
        models.quotes.createQuote(item.quote, item.author).then(newQuote => {
            console.log("created: ", newQuote)
        }).catch(err => {
            console.log(err)
        });
    }).then(() => {
        res.status(200);
    }).catch(err => {
        res.status(400).json({Error: 'Bad Request: issue with request made to server'});
    })
})

app.get('/getQuote', (req, res) => {
    console.log('TESTING GET QUOTE');
    models.quotes.retrieveRandomQuote().then(quotes => {
        console.log(quotes);
        res.status(200).json(quotes);
    }).catch(err => {
        console.log(err);
        res.status(400).json({Error: 'Bad Request: issue with request made'})
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});



