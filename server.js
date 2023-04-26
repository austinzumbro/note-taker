const express = require("express");
const path = require('path');
const fs = require('fs').promises;
const readFile = async (path) => await fs.readFile(path, "utf8");
const writeFile = async (path, data) => await fs.writeFile(path, data);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// Serve up index.html as the homescreen
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

// Serve up notes.html when this url is requested
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

// Serve up the db.json file when this url is requested
app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './db/db.json'))
);

// Listen for a post to this address
app.post('/api/notes', (req, res) => {
    // Destructure the request body into variables
    const { title, text } = req.body;
    // If the requisite values are received...
    if (title && text) {
        // ...then create a newNote object.
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