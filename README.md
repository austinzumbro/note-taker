# Note Taker

## Description

This week, I'm getting into the basics of Express.js routing and methods.  The plan is to set up a basic note-taking system.

| **Scenario**                                                                                                                                                                                                                                                                                                                                                                     |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _As someone with a lot on my mind, I'd like to be able to take notes. I would like my notes to have a title and a body of text.  When I save a note, I'd like it to be appended to a json file. When I delete a note, I'd like it to be removed from that json file. When I click on a note, I'd like it to display properly on the page._ |

And here it is in action:  
[Deployed on Heroku]  
[Gif of the working app]

---

## My Approach

### Routing

Because the routing requirements for this project were very manageable, I chose to include all the routes directly in the `server.js` file. 
> Note for myself: it would be good practice to go back in and adjust everything over to a modular routing system

GET requests are very straightforward in this case, and I only had three of them:
1. When the client requests the root directory, send `index.html`
2. When the client requests `/notes`, send `notes.html`
3. When the client requests `/api/notes`, send `db.json`, the json file where the notes are saved.


