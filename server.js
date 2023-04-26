const express = require("express");
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const PORT = 3001;
const app = express();

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
    // Destructure request body into variables
    const { title, text } = req.body;
    // If the correct values were received...
    if (title && text) {
        // then create a new note object
        const newNote = {
            title,
            text
        }
        // get the current database out of json
        fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
                fs.writeFile(
                    path.join(__dirname, "./db/db.json"),
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) => {
                        if (writeErr) {
                            throw writeErr;
                        } else {
                            console.info('Note successfully saved.');
                            res.send("Note successfully saved.");
                        }
                    }
                );
            }
        });
    } else {
        // otherwise, respond with an error
        res.status(500).json('Error occurred while saving the note.');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);