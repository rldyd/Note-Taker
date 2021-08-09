const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
const {notes} = require('./db/db.json');

//parsing incoming data
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

var notesArray = [];

//HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//Notes
app.get('/notes', (req, res) =>
{
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//GET /api/notes
app.get('/api/notes', (req, res) =>{
    return res.json(notesArray);
});

//POST notes
app.post('/api/notes', (req,res) =>
{
    let note = req.body;

    //Jorge's code start
    note.id = notesArray.length.toString()+Math.floor(Math.random() * 999,999,999); //provide random id
    //Jorge's code end
    
    notesArray.push(note);
    console.log(note);

    fs.writeFile('db/db.json', JSON.stringify(notesArray), (err) => {
        if(err)
        {
            console.log(err);
        }
    });
    res.json(notesArray);
});

//Delete notes
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('db/db.json', (err, data) =>
    {
        let info = JSON.parse(data);
        let id = req.params.id;
        console.log(info.id);

        notesArray = notesArray.filter((info) => {
            return info.id !== id;
        });

        console.log(notesArray);

        fs.writeFile('db/db.json', JSON.stringify(notesArray), (err) =>{
            if(err) {
                throw err;
            }
        });
        res.json(notesArray);
    });
});

app.listen(PORT, () => {
    console.log(`Server Listing on port ${PORT}`);
});