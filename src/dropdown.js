import React from 'react';

function DropDown(props) {
    let className = 'drop-down';
    if (props.dropDownOpen) {
        className += ' -active';
    }
    
    return(
        <div className={className}>
            <button className="dropDown__button" onClick={() => props.deleteNote(props.currentNoteID)}>Delete Note</button>
        </div>
    )
}

export default DropDown