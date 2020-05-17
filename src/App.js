import React from 'react';
import './App.css';
import NotesListItem from './notesListItem.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      noteList: null,
      currentNote: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.loadNote = this.loadNote.bind(this);
  } 

  componentDidMount() {
    console.log('hey der hey');
    this.setState({
      noteList: this.loadNoteList()
    }, this.loadNote(0));
  }

  loadNoteList() {
    var noteIndex
    if(localStorage.getItem('noteIndex')) {
      noteIndex = JSON.parse(localStorage.getItem('noteIndex'));
    } else {
      this.saveNote('', 0);
      noteIndex = [0];
      var noteIndexJSON = JSON.stringify(noteIndex);
      localStorage.setItem('noteIndex', noteIndexJSON);
    }
    var notes = JSON.parse(localStorage.getItem('noteIndex'));
    return notes
  }

  updateNoteIndex(id) {
    var noteList = this.state.noteList;
    noteList.push(id)
    this.setState({
      noteList: noteList
    });
    var noteListJSON = JSON.stringify(noteList);
    localStorage.setItem('noteIndex', noteListJSON);

  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
    console.log(event.target.value);
    this.saveNote(event.target.value, this.state.currentNote);
  }

  saveNote(content, id) {
    var note = {
      id: id,
      title: 'New Note',
      createdDate: "May 16th, 2020",
      modifiedDate: + new Date(),
      content: content
    }
    var noteJSON = JSON.stringify(note);
    localStorage.setItem(id, noteJSON);
    console.log(noteJSON);
  }

  loadNote(id) {
    console.log('load note ' + id);
    var note = JSON.parse(localStorage.getItem(id));
    this.setState({
      value: note.content,
      currentNote: id
    });
  }

  createNewNote() {
    var newIndex = this.state.noteList.length + 1;
    this.saveNote('Write something…', newIndex);
    this.updateNoteIndex(newIndex);
  }


  render() {
    let noteListItems = [];
    if (this.state.noteList !== null) {
      for (var i = 0; i < this.state.noteList.length; i++) {
        noteListItems.push(<NotesListItem
          loadNote={this.loadNote}
          id={this.state.noteList[i]}
          key={this.state.noteList[i]}
          selectedNote={this.state.currentNote}
        />);
      }
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="app-title">Lock Note</h1>
        </header>
        <main>
          <ul className="note-list">
            {noteListItems}
          </ul>
          <button onClick={() => this.createNewNote()}>New Note</button>
          <textarea value={this.state.value} className="note" onChange={this.handleChange}></textarea>
        </main>
      </div>
    );
  }
}

export default App;
