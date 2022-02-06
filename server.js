// Import required dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
// Import 'db.json' file
let dbData = require('./db/db.json');
const uuid = require('./helpers/uuid');
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
app.get('/api/notes', (req, res) => res.json(dbData));

// POST request to add a review
app.post('/api/notes', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid(),
      };  
          // Add a new note
          dbData.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFileSync('./db/db.json', JSON.stringify(dbData, null, 4));
          res.status(201).json(dbData);
    } else {
        res.status(500).json('Error in posting review');
    }; 
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  for (let i = 0; i < dbData.length; i++) {
    if (id === dbData[i].id) {
      dbData.splice(i, 1);
    }    
  }
  fs.writeFileSync('./db/db.json', JSON.stringify(dbData, null, 4))
  res.status(201).json(dbData);
});
app.listen(PORT, () => 
    console.log(`listening on port ${PORT}`)
);