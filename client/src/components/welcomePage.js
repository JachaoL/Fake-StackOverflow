import React, { useState } from 'react';
import SignupPage from './signupPage.js'
import LoginPage from './loginPage.js'
import BeginPipeline from './pipelineStep1_searchBar.js'
export default function welcomePage() {
    //make formatting later or sumn
    const [action, setAction] = useState(null);

    const container = {
        position: 'absolute',
        fontFamily: 'Helvetica Neue',
        top: '60px',
        left: '40%',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px',
        border: '2px solid gray',
        borderRadius: '10px'
    }
    const buttons = {
        display: 'block',
        marginBottom: '20px'
    }
    const handleSignupClick = () => {
        setAction('signup')
    };

    const handleLoginClick = () => {
        setAction('login')
    };

    const handleGuestClick = () => {
        setAction('guest')
    };
    const renderComponent = () => {
        if (action === 'signup') {
            return <SignupPage user = {'user'} logout={setAction}/>;
        } else if (action === 'login') {
            return <LoginPage user = {'user'} logout={setAction}/>;
        } else if (action === 'guest') {
            return <BeginPipeline user = {'guest'} logout={setAction}/>;
        } else {
            return (
            <div style = {container} key = {'welcome page component'}>
            <h1>
                Welcome to Fake Stack Overflow
            </h1>
            <div>
                
            <button style = {buttons} onClick = {handleSignupClick}>
                Register as a new user
            </button>
            </div>
            <div>

            <button style = {buttons} onClick = {handleLoginClick}>
                Login as an existing user
            </button>
            </div>
            <div>

            <button style = {buttons} onClick = {handleGuestClick}>
                Continue as a guest
            </button>
            </div>
        </div>
        )
        }

    }
    return (
        <div key = "welcome page div">
            {renderComponent()}
        </div>
    )
}