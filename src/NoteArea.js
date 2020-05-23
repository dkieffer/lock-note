import React from 'react';

function NoteArea(props) {
    let title, content;
    if (props.currentNoteData !== null) {
        title = props.currentNoteData.title;
        content = props.currentNoteData.content;
    }
    
    return(
        <div className="note-area">
            <textarea value={title} className="note-title" onChange={(event) => props.handleTitleChange(event, props.noteKey)}></textarea>
            <textarea value={content} className="note" onChange={props.handleChange} placeholder="Write something…" onFocus={(event) => props.startSaveTimer(event, 'contentTimer')} onBlur={() => props.removeSaveTimer('contentTimer')}></textarea>
        </div>
    )
}

export default NoteArea