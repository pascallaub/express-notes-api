import { io } from "socket.io-client";

const socket = io('http://localhost:8080');

const notesContainer = document.getElementById('notes-container');
const addNoteForm = document.getElementById('add-note-form');

function renderNote(note) {
  const noteDiv = document.createElement('div');
  noteDiv.id = `note-${note.id}`;
  noteDiv.innerHTML = `
    <h3>${note.note}</h3>
    <p>${note.autor}</p>
    <p>${note.date}</p>
    <button onclick="deleteNote(${note.id})">Delete</button>
    <hr>
  `;
  notesContainer.appendChild(noteDiv);
}

fetch('http://localhost:8080/notes')
  .then(res => res.json())
  .then(notes => {
    notes.forEach(note => renderNote(note));
  })
  .catch(err => console.error(err));
  
socket.on('noteAdded', note => {
  console.log('noteAdded', note);
  renderNote(note);
});

socket.on('noteUpdated', (note) => {
  console.log('noteUpdated', note);
  const noteDiv = document.getElementById(`note-${note.id}`);
  noteDiv.innerHTML = `
    <h3>${note.note}</h3>
    <p>Autor: ${note.autor}</p>
    <p>Datum: ${note.date}</p>
    <button onclick="deleteNote(${note.id})">Delete</button>
    <hr>
  `;
});

socket.on('noteDeleted', (note) => {
  console.log('noteDeleted', note);
  const noteDiv = document.getElementById(`note-${note.id}`);
  if (noteDiv) {
    noteDiv.remove();
  }
});

addNoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const note = e.target.note.value;
  const autor = e.target.autor.value;
  const date = e.target.date.value;

  fetch('http://localhost:8080/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note, autor, date }),
  })
    .then(res => res.json())
    .then(newNote => {
      console.log('newNote', newNote);
      e.target.reset();
    })
    .catch(err => console.error(err));
});

window.deleteNote = function (id) {
  fetch(`http://localhost:8080/notes/${id}`, {
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(deletedNote => {
      console.log('deletedNote', deletedNote);
    })
    .catch(err => console.error(err));
};

notesContainer.addEventListener('click', (e) => {
  if (e.target && e.target.matches('button.delete-button')) {
    const id = e.target.getAttribute('data-id');
    deleteNote(id);
  }
});