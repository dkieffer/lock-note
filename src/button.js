import React from 'react';

function Button(props) {
    let className = 'button ';
    if (props.position) {
        className += props.position;
    }
    
    return(
        <button className={className} onClick={props.function}>
            {props.label}
        </button>
    )
}

export default Button