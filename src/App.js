import React from 'react';
import './App.css';
import NotesListItem from './notesListItem.js';
import NoteArea from './NoteArea';
import Button from './button';
import DropDown from './dropdown';
import OutsideWatcher from './OutsideWatcher';
import SignIn from './views/SignIn';
var CryptoJS = require("crypto-js");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeView: 'main',
      menuOpen: false,
      dropDownOpen: false,
      noteList: null,
      noteIndex: this.loadNoteIndex(),
      currentNoteID: 0, // the note id
      currentNoteIndex: null, // the index of current note in the noteList array 
      indexTicker: this.loadIndexTicker(),
      currentNoteData: null,
      smallScreen: false,
      contentTimerID: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.loadNote = this.loadNote.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.saveNote = this.saveNote.bind(this);
    this.createNewNote = this.createNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.startSaveTimer = this.startSaveTimer.bind(this);
    this.removeSaveTimer = this.removeSaveTimer.bind(this);
    this.setActiveView = this.setActiveView.bind(this);
  } 

  componentDidMount() {
    this.loadNoteData();
    if (this.state.noteIndex.length > 0) {
      this.loadNote(this.state.noteIndex[0]);
    } else {
      this.createNewNote();
    }

    let viewportWidth = window.innerWidth;
    let smallScreen = false;
    if (viewportWidth < 640) {
      smallScreen = true;
    }
    this.setState((state) => ({
      smallScreen: smallScreen
    }))
  }

  setActiveView(view) {
    console.log('setActiveView');
    console.log(view);
    this.setState({
      activeView: view
    });
  }

  toggleMenu() {
    console.log('toggle menu');
    this.setState({
      menuOpen: !this.state.menuOpen,
      dropDownOpen: false
    })
  }

  toggleDropDown() {
    console.log('toggle dropdown');
    this.setState({
      dropDownOpen: !this.state.dropDownOpen
    })
  }

  loadNoteIndex() {
    var noteIndex;
    if (localStorage.getItem('noteIndex') !== null) {
      noteIndex = JSON.parse(localStorage.getItem('noteIndex'));
    } else {
      noteIndex = [];
      localStorage.setItem('noteIndex', JSON.stringify(noteIndex));
      // this.createNewNote();
    }
    return noteIndex;
  }

  loadNoteData() {
    for (var i = 0; i < this.state.noteIndex.length; i++) {
      let noteData = this.decrypt(this.state.noteIndex[i]);
      if (noteData === null) {
        window.alert('Your password is incorrect.')
      }
      this.setState({
        ['note'+i]: noteData
      }, console.log(this.state['note'+i]));
    }
  }

  decrypt(noteID) {
    console.log('decrypt!');
    var encryptedNote = localStorage.getItem(noteID);
    var bytes = CryptoJS.AES.decrypt(encryptedNote, 'password');
    try {
      var string = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null
    }

    try {
      var decryptedData = JSON.parse(string);
      return decryptedData;
    } catch (error) {
      return null
    }
    
  }

  loadIndexTicker() {
    var indexTicker;
    if(localStorage.getItem('indexTicker')) {
      indexTicker = JSON.parse(localStorage.getItem('indexTicker'));
    } else {
      indexTicker = 0;
      var indexTickerJSON = JSON.stringify(indexTicker);
      localStorage.setItem('indexTicker', indexTickerJSON);
    }
    return indexTicker;
  }

  updateNoteIndex(id) {
    let noteList;
    if (this.state.noteIndex !== null) {
      noteList = this.state.noteIndex;
      noteList.push(id)
    } else {
      noteList = [id];
    }
    this.setState({
      noteIndex: noteList
    });
    var noteListJSON = JSON.stringify(noteList);
    localStorage.setItem('noteIndex', noteListJSON);

  }

  handleChange(event) {
    // event.target.focus();
    // this.saveNote(this.state.currentNoteData.title, event.target.value, this.state.currentNoteID);
    this.setState({
      currentNoteData: {
        ...this.state.currentNoteData,
        content: event.target.value
      },
      dropDownOpen: false
    });
  }

  startSaveTimer(event, name) {
    var originalContent = event.target.value;
    if (name === 'contentTimer') {
      var contentTimer = window.setInterval(() => {
        if (originalContent !== this.state.currentNoteData.content) {
          console.log('trigger a save babies');
          originalContent = this.state.currentNoteData.content;
          this.saveNote(this.state.currentNoteData.title, this.state.currentNoteData.content, this.state.currentNoteID);
        }
      }, 30000);

      this.setState({
        contentTimerID: contentTimer
      })
    }
  }

  removeSaveTimer(name) {
    if (name === 'contentTimer') { 
      window.clearInterval(this.state.contentTimerID);
    }
  }

  handleTitleChange(event, key) {
    this.saveNote(event.target.value, this.state.currentNoteData.content, this.state.currentNoteID);
    this.setState({
      currentNoteData: {
        ...this.state.currentNoteData,
        title: event.target.value
      },
      ['note' + key]: {
        ...this.state['note' + key],
        title: event.target.value
      },
      dropDownOpen: false
    }, () => console.log(this.state));
  }

  saveNote(title, content, id) {
    var note = {
      id: id,
      title: title,
      createdDate: "May 16th, 2020",
      modifiedDate: + new Date(),
      content: content
    }
    var noteJSON = JSON.stringify(note);
    var noteEncrypted = CryptoJS.AES.encrypt(noteJSON, 'password').toString();
    localStorage.setItem(id, noteEncrypted);
  }

  loadNote(id) {
    // console.log('load note ' + id);
    var noteEncrypted = localStorage.getItem(id);
    // var noteDecryptedBytes = CryptoJS.AES.decrypt(noteEncrypted, 'password');
    // var decryptedData = JSON.parse(noteDecryptedBytes.toString(CryptoJS.enc.Utf8));
    var decryptedData = this.decrypt(id);

    // var note = JSON.parse(localStorage.getItem(id));

    var noteIndex = this.state.noteIndex.findIndex(noteIDs => noteIDs === id);
    this.setState({
      currentNoteID: id,
      currentNoteIndex: noteIndex,
      currentNoteData: decryptedData
    });

    if (this.state.smallScreen && this.state.menuOpen) {
      this.toggleMenu();
    }
  }

  createNewNote() {
    var newIndexTicker = JSON.parse(localStorage.getItem('indexTicker')) + 1;
    localStorage.setItem('indexTicker', JSON.stringify(newIndexTicker));
    this.saveNote('Note ' + newIndexTicker, '', newIndexTicker);

    this.setState({
      currentNoteID: newIndexTicker,
      currentNoteIndex: this.state.noteIndex.length,
      ['note' + this.state.noteIndex.length]: {
        title: 'Note ' + newIndexTicker
      },
      dropDownOpen: false
    }, () => {
      this.updateNoteIndex(newIndexTicker);
      this.loadNote(newIndexTicker);
      console.log(this.state);
    })
  }

  deleteNote(id) {
    localStorage.removeItem(id);
    for (var i = 0; i < this.state.noteIndex.length; i++) {
      if (this.state.noteIndex[i] === id) {
        var newNoteList = this.state.noteIndex.slice();
        newNoteList.splice(i, 1);
        console.log(newNoteList);
        localStorage.setItem('noteIndex', JSON.stringify(newNoteList));

        if (newNoteList.length === 0) {
          console.log('its zero');
          this.createNewNote();
        } else {
          this.setState({
            noteIndex: newNoteList,
            currentNoteID: this.state.noteIndex[i - 1],
            currentNoteIndex: i - 1,
            dropDownOpen: false
          });
          this.loadNote(this.state.noteIndex[i - 1]);
        }
        
        break
      }
    }
  }

  render() {
    let noteListItems = [];
    if (this.state.noteIndex !== null && this.state.currentNoteData !== null) {
      for (var i = 0; i < this.state.noteIndex.length; i++) {
        let title = '';
        if (this.state['note' + i]) {
          title = this.state['note' + i].title
        }
        noteListItems.push(<NotesListItem
          loadNote={this.loadNote}
          id={this.state.noteIndex[i]}
          title={title}
          activeTitle={this.state.currentNoteData.title}
          key={i}
          selectedNote={this.state.currentNoteID}
        />);
      }
    }

    let className = 'menu';
    if (this.state.menuOpen) {
      className += ' active'
    }

    return (
      <div className="App">
        <Button label="Notes" function={this.toggleMenu} position={'top-left'}/>
        <Button label="Options" function={this.toggleDropDown} position={'top-right'}/>
        <OutsideWatcher function={this.toggleDropDown} listen={this.state.dropDownOpen}>
          <DropDown
            deleteNote={this.deleteNote}
            currentNoteID={this.state.currentNoteID}
            saveNote={this.saveNote}
            dropDownOpen={this.state.dropDownOpen}
          />
        </OutsideWatcher>

        <div className={className}>
          <Button label="Close" function={this.toggleMenu} />
          <h1>Lock Note</h1>
          <ul className="note-list">
            {noteListItems}
          </ul>
          <Button label="New Note" function={this.createNewNote} />
          <Button label="Sign In" function={this.setActiveView} args={'SignIn'}/>

        </div>

        <NoteArea
          currentNoteData={this.state.currentNoteData}
          handleChange={this.handleChange}
          handleTitleChange={this.handleTitleChange}
          noteKey={this.state.currentNoteIndex}
          startSaveTimer={this.startSaveTimer}
          removeSaveTimer={this.removeSaveTimer}
        />

        <SignIn activeView={this.state.activeView} setActiveView={this.setActiveView} />
      </div>
    );
  }
}

export default App;
