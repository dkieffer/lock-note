import React from 'react';
import Button from '../button';

function SignIn(props) {
    let className = 'view';
    if(props.activeView === 'SignIn') {
        className += ' -active'
    }
    
    return(
        <div className={className}>
            <Button label={'Cancel'} function={props.setActiveView} args={'Main'} />
            <h1>Sign In</h1>
            <p>Sign in to Lock Note to encrypt your notes.</p>
            <label htmlFor="username">Username</label>
            <input type="text" id="username"></input>
            <label htmlFor="password">Password</label>
            <input type="text" id="password"></input>
            <button>Submit</button>
            <p>Don't have an account? Create one.</p>
        </div>
    )
}

export default SignIn