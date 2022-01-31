// Import required dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
// Import 'db.json' file
const dbData = require('./db/db.json');
const uuid = require('./helpers/uuid');
const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
app.get('/api/notes', (req, res) => res.json(dbData));

// POST request to add a review
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        noteId: uuid(),
      };
  
      // Obtain existing reviews
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new review
          parsedNotes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
      const response = {
          status: 'success',
          body: newNote,
        };
        
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    };  
});

app.listen(PORT, () => 
    console.log(`listening on port ${PORT}`)
);