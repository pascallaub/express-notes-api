const express = require('express');
const htpp = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

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
    const { note, autor, date } = req.body;

    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
        return res.status(404).send('Note not found');
    }

    notes[noteIndex] = { id, note, autor, date };
    
    io.emit('noteUpdated', notes[noteIndex]);
});

app.post('/notes', (req, res) => {
    const { note, autor, date } = req.body;
    const newNote = {
        id: notes.length + 1,
        note,
        autor,
        date
    };
    notes.push(newNote);
    io.emit('noteAdded', newNote);
    res.status(201).json(newNote);
});

app.delete('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
        return res.status(404).send('Note not found');
    }

    const deletedNote = notes.splice(noteIndex, 1)[0];

    io.emit('noteDeleted', deletedNote);
    res.status(200).json(deletedNote);
});

const server = htpp.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});

io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});