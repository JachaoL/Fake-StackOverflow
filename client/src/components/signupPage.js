import React, { useState } from 'react';
import axios from 'axios';
import LoginPage from './loginPage';
export default function signupPage(props) { 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("") 
    const [usernameError, setUsernameError] = useState("")
    const [submitted, setSubmitted] = useState(false);
    const [loginError, setLoginError] = useState("");

    const heading = {
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

    const back = {
        position: 'fixed',
        top: '7px',
        left: '50%',
        height: '33px',
        transform: 'translateX(525px)',
        zIndex: '7000'
    }

    const answer1 = (event) => {
        setEmail(event.target.value)
    }
    
    const answer2 = (event) => {
        setPassword(event.target.value)
    }
    
    const answer3 = (event) => {
        setUsername(event.target.value)
    }
    
    
    function handleSubmit(event) {
        event.preventDefault();
        let emailer = email.trim();
        let passworder = password.trim();
        let usernamer = username.trim();

        let emailErrorers = "";
        let passwordErrorers = "";
        let usernameErrorers = "";

        if(emailer === "") {
            emailErrorers += "Email is required"
        }
        if(passworder === "") {
            passwordErrorers += "Password is required"
        }
        if(usernamer === "") {
            usernameErrorers += "Username is required"
        }
        if(emailErrorers || passwordErrorers || usernameErrorers) {
            setEmailError(emailErrorers);
            setPasswordError(passwordErrorers);
            setUsernameError(usernameErrorers);
            return;
        }
        setEmailError("");
        setPasswordError("");
        setUsernameError("");
        let newUser = {name: usernamer, email: emailer, password: passworder}
        
        axios.post('http://localhost:8000/add_user', newUser).then(res => {
            console.log(res.data);
            setSubmitted(true);
        }).catch(err =>setLoginError(err.response.data.error))

    }

    function logout(){
        props.logout(null);
    }

    if(submitted) {
        return <LoginPage />
    }
    return (
        <div style = {heading}>
            Sign Up 
            <form onSubmit={handleSubmit} style = {{marginTop: "20px"}}>
                
                <label>
                    Username 
                    <input id = "username" type = "text" value = {username} onChange = {answer3}>
                    </input>
                    <p style = {{color: 'red', fontSize: "11px"}}>
                        {usernameError}
                    </p>
                </label>
                <label>
                    Password 
                    <input id = "password" type = "text" value = {password} onChange = {answer2}>
                    </input>
                    <p style = {{color: 'red', fontSize: "11px"}}>
                        {passwordError}
                    </p>
                </label>
                <label>
                    Email 
                    <input id = "email" type = "text" value = {email} onChange = {answer1}>
                    </input>
                    <p style = {{color: 'red', fontSize: "11px"}}>
                        {emailError}
                    </p>
                </label>
                <input type = "submit" />
            </form>
            <p style = {{color: 'red', fontSize: "11px"}}>
                {loginError}
            </p>

            <button className = {'standard_button_blue'} id = {'logout_button'} style = {back} onClick={logout}>Back</button>

        </div>
    )
}