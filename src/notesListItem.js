import React from 'react';

function NotesListItem(props) {
    let className = '';
    let title = props.title;
    if (props.selectedNote === props.id) {
        className += ' active';
    }

    return(
        <li><button className={className} onClick={() => props.loadNote(props.id)}>{title}</button></li>
    )
}

export default NotesListItem