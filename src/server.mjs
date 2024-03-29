// Controllers for the workout app

import 'dotenv/config';
import express from 'express';
import * as models from './models/index.js';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());  // REST needs JSON MIME type.

//Cors Configuration - Start
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested, Content-Type, Accept Authorization"
    )
    if (req.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "POST, PUT, PATCH, GET, DELETE"
        )
        return res.status(200).json({})
    }
    next()
})
//Cors Configuration - End


// CREATE controller ******************************************
app.get("/", (req, res) => {
    res.send("<h1>Api is listening</h1>")
})
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

app.post('/addProgram', (req, res) => {
        let {programName, monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body
        console.log(monday)
        models.workoutProgram.createWorkoutProgram(programName, monday, tuesday, wednesday, thursday, friday, saturday, sunday
        ).then((result) => {
            console.log("final", result);
            res.status(200).json(result);
        }).catch(err => {
            res.status(400).json({Error: 'Bad Request: issue with request made to server'});
        })
    }
)

app.get('/getWorkoutProgram', (req, res) => {
    try {
        console.log('TESTING GET PROGRAMS');
        console.log(req.query.programName);
        const programs = ["Endurance", "Build Muscle", "Hybrid"]
        if (!req.query.programName) {
            res.status(400).json({Error: 'Bad Request: missing parameter'});
        } else if (!programs.includes(req.query.programName)) {
            res.status(400).json({Error: 'Bad Request: parameter provided is not a program!'});
        } else {
            models.workoutProgram.retrieveProgramByName(req.query.programName).then(programs => {
                const returnJSON = JSON.stringify(programs);
                // res.status(200).json(returnJSON);
                res.header("Content-Type", 'application/json');
                res.status(200).send(returnJSON);
            })
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({Error: 'Bad Request: issue with request made to server'});
    }
})

app.post('/createUser', (req, res) => {
    console.log('TESTING CREATE USER');
    console.log(req.body);
    const {firstName, lastName, email, userName, password} = req.body;
    console.log(firstName, lastName, email, userName, password);
    try {
        models.user.createUser(
            firstName,
            lastName,
            email,
            userName,
            password
        ).then(newUser => {
            console.log(newUser);
            res.status(200).json({Success: 'User created successfully'});
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({Error: 'Bad Request: issue with request made to server'});
    }
})

app.post('/getUser', (req, res) => {
    console.log('FINDING USER')
    const {userName, password} = req.body;
    console.log(userName, password);
    try {
        models.user.findUser(userName, password).then(existingUser => {
            console.log(existingUser);
            if (existingUser) {
                console.log("Credentials are valid.");
                console.log(existingUser)
                // Return any additional information if needed
                res.status(200).send(JSON.stringify(existingUser));
            } else {
                console.log("Invalid credentials.");
                res.status(400).json({Error: 'Invalid User'});
            }
        })
    } catch (error) {
        console.error("Error checking credentials:", error);
        res.status(400).json({Error: 'Bad Request: issue with request made to server'})
    }
})

app.post('/createWorkoutTemplate', (req, res) => {
    console.log('TESTING CREATE WORKOUT TEMPLATE');
    console.log(req.body);
    models.workoutTemplate.createTemplate(
        req.body[0].templateName,
        req.body[0].description,
        new Date().toLocaleString()
    ).then(newTemplate => {
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
                console.log(newTemplate._id);
                models.workoutTemplate.WorkoutTemplate.findByIdAndUpdate(
                    newTemplate._id.toString(),
                    {$push: {exercises: exerciseCreated}},
                    {new: true, useFindAndModify: false},
                    () => console.log("updated template", newTemplate._id)
                )
            })
        })
        res.status(200).json(newTemplate);
    })
});

app.get('/getWorkoutTemplates', (req, res) => {
    console.log('TESTING GET TEMPLATES');
    models.workoutTemplate.retrieveTemplates().then(templates => {
        console.log(templates);
        res.status(200).json(templates);
    })
})

app.delete(`/deleteWorkoutTemplate/:id`, (req, res) => {
    console.log("GIVEN", req.params);
    models.workoutTemplate.deleteTemplateById(req.params.id).then((deletedCount) => {
        if (deletedCount === 1) {
            console.log(`Based on its ID, ${deletedCount} journal was deleted.`);
            res.status(200).send({Success: 'Success: template deleted'});
        } else {
            res.status(404).json({Error: 'Not found: template associated provided id was not found'});
        }
    }).catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Bad Request: issue with request made to server'});
    });
})

app.listen(process.env.PORT || 4200, () => {
    console.log(`Server listening...`);
});



