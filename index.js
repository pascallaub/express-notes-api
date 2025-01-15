const express = require('express');
const app = express();
const port = import.meta.env.NOTES_APP_PORT;

app.use(express.json());

let notes = [
    {
        id: 1,
        note: "My new Note",
        autor: "Max Mustermann",
        date: "2025-01-15"
    }
]

app.get('/notes', (req, res) => {
    res.json(notes);
});

app.get('/notes/:id', (req, res) => {
    const note = notes.find(note => note.id === req.params.id);
    res.json(note);
});

app.put('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find(note => note.id == id);
    note.note = req.body.note;
    note.autor = req.body.autor;
    note.date = req.body.date;
    res.json(note);
});

app.post('/notes', (req, res) => {
    const note = {
        id: notes.length + 1,
        note: req.body.note,
        autor: req.body.autor,
        date: req.body.date
    };
    notes.push(note);
    res.json(note);
});

app.delete('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    notes = notes.filter(note => note.id != id);
    res.json({ id: id });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});