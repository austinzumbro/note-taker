const express = require("express");
const path = require('path');
const fs = require('fs').promises;
const util = require('util');
const readFile = async (path) => await fs.readFile(path, "utf8");
const writeFile = async (path, data) => await fs.writeFile(path, data);

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './db/db.json'))
);

app.post('/api/notes', (req, res) => {
    // Destructure request body into variables
    const { title, text } = req.body;
    // If the correct values were received...
    if (title && text) {
        // then create a new note object
        const newNote = {
            title,
            text
        }

        readFile(path.join(__dirname, "./db/db.json"))
            .then((text) => {
                const notes = JSON.parse(text);
                notes.push(newNote);
                notes.forEach((obj, index) => {
                    obj.id = index + 1;
                });
                return JSON.stringify(notes, null, 4);
            })
            .then((notes) => {
                writeFile(path.join(__dirname, "./db/db.json"), notes)
            })
            .then(() => {
                console.info('Note successfully saved.');
                res.send("Note successfully saved.");
            })
            .catch((err) => console.error(err))

    } else {
        // otherwise, respond with an error
        res.status(500).json('Error occurred while saving the note.');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    let deleteID = req.params.id;
    console.log(deleteID);

    readFile(path.join(__dirname, "./db/db.json"))
        .then((text) => {
            const notes = JSON.parse(text);
            console.log("original notes", notes);
            console.log("delete id", deleteID);
            const newNotes = notes.filter(obj => obj.id != deleteID);
            console.log("new notes", newNotes);
            newNotes.forEach((obj, index) => {
                obj.id = index + 1;
            });
            return JSON.stringify(newNotes, null, 4);
        })
        .then((notes) => {
            writeFile(path.join(__dirname, "./db/db.json"), notes)
        })
        .then(() => {
            console.info('Note successfully deleted.');
            res.send("Note successfully deleted.");
        })
        .catch((err) => console.error(err))
})

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);