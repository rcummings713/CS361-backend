FitJournal API

Fit Journal is an application that allows users to log workouts. In addition, it provides workouts through its API.

This service provides three different workout programs. Each is a week of workouts that can be repeated until desired results are met.

Endurance: cardio focused program Build Muscle: resistance training focused program Hybrid: mix between cardio and resistance training

Request Data

Data can be requested through a GET method. This method requires a variable "programName" and one of the program types above. The request is made to the below URL

https://fitjournal-api-ca964984ffd7.herokuapp.com/getWorkoutProgram?programName=Hybrid

Receive Data

Data is received in a JSON format. Provided is the name of the program and the exercises for each day of the week. Below is a sample response for the Endurance program.

[{"programName":"Endurance","monday":[{"exercise":"Endurance Running - 3 miles","exerciseType":"Cardio Running","_id":"65dd08c01830737631ba27cd"}],"tuesday":[],"wednesday":[{"exercise":"Hill Sprints","exerciseType":"Cardio Sprints","sets":8,"reps":1,"rest":1,"_id":"65dd08c01830737631ba27ce"}],"thursday":[{"exercise":"Endurance Running - 6 miles","exerciseType":"Cardio Running","_id":"65dd08c01830737631ba27cf"}],"friday":[],"saturday":[{"exercise":"Walk - 1 miles","exerciseType":"Cardio Walking","_id":"65dd08c01830737631ba27d0"}],"sunday":[],"__v":0}]

UML Diagram

  +---------------------+       +-------------------------+
  |        Client       |       | Fit Journal Microservice|
  +---------------------+       +-------------------------+
          |                            |
          | GET /getWorkoutProgram?programName=  |
          |            {programName}   |
          |---------------------------->|
          |                            |
          |                            |
          |                            |
          |        {programName}       |
          |           (Endurance,     |
          |             Hybrid, or    |
          |           Build Muscle)   |
          |                            |
          |                            |
          |                            |
          |       Successful Response |
          |<----------------------------|
          |        {Workout Program}   |
          |                            |
          |                            |
          |       Error Response       |
          |<----------------------------|
          |       (Server Error or    |
          |        Missing Param Data) |
  +---------------------+       +-------------------------+


