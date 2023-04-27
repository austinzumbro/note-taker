# Note Taker

## Description

This week, I'm getting into the basics of Express.js routing and methods.  The plan is to set up a basic note-taking system.

| **Scenario**                                                                                                                                                                                                                                                                                                                                                                     |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _As someone with a lot on my mind, I'd like to be able to take notes. I would like my notes to have a title and a body of text.  When I save a note, I'd like it to be appended to a json file. When I delete a note, I'd like it to be removed from that json file. When I click on a note, I'd like it to display properly on the page._ |

And here it is in action:  
[Deployed on Heroku](https://azumbro-note-taker.herokuapp.com/)  
[Gif of the working app]

---

## Usage

- Once the app loads, hit "Get Started" to begin.
- A list of notes appears along the left side.
- Click directly on a note to view its contents
- Click on the trash icon to delete a note
- To create a new note, hit the "+" icon in the upper right
    - Enter your Note Title
    - Enter your Note Text
    - Click the disk icon that appears to save your note

---

## My Approach

## Routing

Because the routing requirements for this project were very manageable, I chose to include all the routes directly in the `server.js` file. 
> **Note for my future self**  
> It would be good practice to go back in and adjust everything over to a modular routing system.

---

### GET Requests

There are only four of them:
1. When the client requests the root directory, send `index.html`
2. When the client requests `/notes`, send `notes.html`
3. When the client requests a route not on this list, send `index.html`

4. When the client requests `/api/notes`, read the `db.json` file to a string, parse that string to an object, and send it over.  

> **Note**  
> I originally wrote this as a straight `res.sendFile` with a path to the `db.json` - which worked fine in this case - but after reading a little bit more, I wound up switching it out for `fs.promises.readFile().then( JSON.parse(data) )`.
> 
> Intuitively, it seems like extra work to read the file out to a string and then convert it back to an object to send over. But poking around on Stack Exchange it looks like there are two issues with sending over the .json file directly.
>
> 1. fs.promises.readFile moves you into a world of asynchronous action, which isn't all that important in this case, but would probably matter in a larger application environment.
> 2. Sending the file directly sets it up to be cached by the browser, which may cause data to persist in unexpected ways.

---  

### POST and DELETE Requests

The ability to save a new note elicits the need for a POST request. The ability to delete a note implies a DELETE request.  

The DELETE request was a little more interesting to write, in that it gave me an opportunity to interact with the `req.params` object.

```javascript
app.delete('/api/notes/:id', (req, res) => {

    let deleteID = req.params.id;

    console.log(deleteID);
}
```

---

## Reading and Writing to File

We regularly need to read the current state of the database out of our JSON file, parse it, modify it, and write it back to file.  

I started writing these sequences out as nested functions, but I hated how it looked, so I went back and reworked it using asynchronous methods.  

```javascript
const readFile = async (path) => await fs.promises.readFile(path, "utf8");

const writeFile = async (path, data) => await fs.promises.writeFile(path, data);
```

This made it much more pleasant to read, as in the DELETE response:

```javascript
readFile(path.join(__dirname, "./db/db.json"))
    .then((text) => {
        // parse the text into an array
        const notes = JSON.parse(text);
        // filter that array by the id of the note you
        // want to delete
        const newNotes = notes.filter(obj => obj.id != deleteID);
        // reassign the id numbers
        newNotes.forEach((obj, index) => {
            obj.id = index + 1;
        });
        // stringify the array and return it
        return JSON.stringify(newNotes, null, 4);
    })
    .then((notes) => {
        // write the new file with the updated string
        writeFile(path.join(__dirname, "./db/db.json"), notes)
    })
    .then(() => {
        // report success
        console.info('Note successfully deleted.');
        res.send("Note successfully deleted.");
    })
    // report failure
    .catch((err) => console.error(err))
```

---
## Assigning IDs

Instead of using `uuid`, a node module I've since discovered that can generate ids for you, I opted to simply assign all the note ids relative to their position in the array.

If we were working with a large dataset, this wouldn't be the best approach, because I'm rewriting the ids every time the database is updated.  You can see it above in the DELETE response, and here it is in the POST response:

```javascript
readFile(path.join(__dirname, "./db/db.json"))
    .then((text) => {
        // parse the text into an array
        const notes = JSON.parse(text);

        // push the new note on the array
        notes.push(newNote);

        // iterate over the array and rewrite all
        // note ids based on their respective positions
        notes.forEach((obj, index) => {
            obj.id = index + 1;
        });

        return JSON.stringify(notes, null, 4);
```

---
## Learnings / Reflections

- Working with the server environment is so fun!  It feels like I'm really getting into the real meat of things now. 
- Data persistance is going to open up a whole new world of stuff I can make. 
- I'll be looking at setting up a relational database next, probably working with MySQL since I'm more familiar with that.
- I need to learn more about asynchronicity and how it plays in larger, more complicated production context.  I have kind of a surface-level understanding, but a deeper sense of the nuance would help me feel more confident.