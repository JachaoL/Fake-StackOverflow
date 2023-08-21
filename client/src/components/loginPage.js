import React, { useState} from 'react';
import axios from 'axios';
import BeginPipeline from "./pipelineStep1_searchBar";
export default function loginPage(props) { 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("") 
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
    
    
    function handleSubmit(event) {
        event.preventDefault();
        let emailer = email.trim();
        let passworder = password.trim();

        let emailErrorers = "";
        let passwordErrorers = "";

        if(emailer === "") {
            emailErrorers += "Email is required"
        }
        if(passworder === "") {
            passwordErrorers += "Password is required"
        }
        if(emailErrorers || passwordErrorers) {
            setEmailError(emailErrorers);
            setPasswordError(passwordErrorers);
            return;
        }
        setEmailError("");
        setPasswordError("");
        let newUser = {email: emailer, password: passworder}
        axios.default.withCredentials = true;

        axios.post('http://localhost:8000/login', newUser, {withCredentials: true}).then(res => {
            console.log(res.data);
            setSubmitted(true);
        }).catch(err => {
            if(err.response.status === 401) {
                console.log("THIS IS AN ERROR MESSAGE")
                console.log(err.response.data.error)
                setLoginError(err.response.data.error)
            }})

    }

    function logout(){
        props.logout(null);
    }
    
    if(submitted) {
        return <BeginPipeline logout={props.logout}/>
    }
    return (
        <div style = {heading}>
            Log In
            <form onSubmit={handleSubmit} style = {{marginTop: "20px"}}>
                
                <label>
                    Email 
                    <input id = "email" type = "text" value = {email} onChange = {answer1}>
                    </input>
                    <p style = {{color: 'red', fontSize: "11px"}}>
                        {emailError}
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
                <input type = "submit" />
            </form>
            <p style = {{color: 'red', fontSize: "11px"}}>
            {loginError}  
            </p>

            <button className = {'standard_button_blue'} id = {'logout_button'} style = {back} onClick={logout}>Back</button>


        </div>
    )
}