import React from 'react';
import './App.css';
import NotesListItem from './notesListItem.js';
import NoteArea from './NoteArea';
import Button from './button';
import DropDown from './dropdown';
import OutsideWatcher from './OutsideWatcher';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      dropDownOpen: false,
      noteList: null,
      noteIndex: this.loadNoteIndex(),
      currentNoteID: 0, // the note id
      currentNoteIndex: null, // the index of current note in the noteList array 
      indexTicker: this.loadIndexTicker(),
      currentNoteData: null,
      smallScreen: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.loadNote = this.loadNote.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.saveNote = this.saveNote.bind(this);
    this.createNewNote = this.createNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this)
  } 

  componentDidMount() {
    console.log('componentDidMount');
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
      this.setState({
        ['note'+i]: JSON.parse(localStorage.getItem(this.state.noteIndex[i]))
      });
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
    event.target.focus();
    this.saveNote(this.state.currentNoteData.title, event.target.value, this.state.currentNoteID);
    this.setState({
      currentNoteData: {
        ...this.state.currentNoteData,
        content: event.target.value
      },
      dropDownOpen: false
    });
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
    localStorage.setItem(id, noteJSON);
  }

  loadNote(id) {
    console.log('load note ' + id);
    var note = JSON.parse(localStorage.getItem(id));
    var noteIndex = this.state.noteIndex.findIndex(noteIDs => noteIDs === id);
    this.setState({
      currentNoteID: id,
      currentNoteIndex: noteIndex,
      currentNoteData: note
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
            createNewNote={this.createNewNote}
            currentNoteID={this.state.currentNoteID}
            saveNote={this.saveNote}
            dropDownOpen={this.state.dropDownOpen}
          />
        </OutsideWatcher>

        <div className={className}>
          <Button label="Close" function={this.toggleMenu} />
          <ul className="note-list">
            {noteListItems}
          </ul>
        </div>

        <NoteArea
          currentNoteData={this.state.currentNoteData}
          handleChange={this.handleChange}
          handleTitleChange={this.handleTitleChange}
          noteKey={this.state.currentNoteIndex}
        />
      </div>
    );
  }
}

export default App;
