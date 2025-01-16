const express = require('express');
const app = express();
const dotenv = require('dotenv');

app.use(express.json());
dotenv.config();
const port = process.env.NOTES_APP_PORT;

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
    const note = notes.find(note => note.id === parseInt(req.params.id));
    res.json(note);
});

app.put('/notes/:id', (req, res) => {
    const note = notes.find(note => note.id === parseInt(req.params.id));

    if (!note) {
        return res.status(404).json({ message: "Note not found!" });
    }

    const { note: updatedNote, autor, date } = req.body;
    if (!updatedNote || !autor || !date) {
        return res.status(400).json({ message: "All fields (note, autor, date) required" });
    }

    note.note = updatedNote;
    note.autor = autor;
    note.date = date;

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
    const noteIndex = notes.findIndex(note => note.id === parseInt(req.params.id));
    if (noteIndex === -1) {
        return res.status(404).json({ message: "Note not found" });
    }
    const deletedNote = notes.splice(noteIndex, 1)[0];
    res.json(deletedNote);
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});