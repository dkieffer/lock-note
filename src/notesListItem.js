import React from 'react';

function NotesListItem(props) {
    let className = '';
    if (props.selectedNote === props.id) {
        className += ' active';
    }
    return(
    <li><button className={className} onClick={() => props.loadNote(props.id)}>Note {props.id}</button></li>
    )
}

export default NotesListItem