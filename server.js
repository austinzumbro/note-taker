const express = require("express");
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const PORT = 3001;
const app = express();

const getDB = () => {
    readFile(path.join(__dirname, "./db/db.json"), "utf8")
        .then((file) => {
            return JSON.parse(file);
        })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.error(err);
        });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './db/db.json'))
);

app.post('/api/notes', (req, res) => {
    // Pull in the current state of the db.json
    const db = getDB()
    // destructure request body into variables
    const { title, text } = req.body;
    // if the correct values were received...
    if (title && text) {
        // then create a new note object
        const newNote = {
            title,
            text
        }
        // append that object to the database
        db.push(newNote);
        // rewrite the database file
        fs.writeFile(
            path.join(__dirname, "./db/db.json"),
            JSON.stringify(db, null, 4),
            (writeErr) =>
                writeErr
                    ? console.error(writeErr)
                    : console.info('Note successfully saved.')
        );
    } else {
        // otherwise, respond with an error
        res.status(500).json('Error occurred while saving the note.');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);