import {useState, useEffect} from 'react';
import Next_step_a from './pipelineStep3a_sorting';
import Next_step_b from './pipelineStep3b_questionCreator';
import Next_step_c from "./pipelineStep3c_answerCreator";
import Next_step_d from './pipelineStep3d_answers';
import Next_step_e from "./pipelineStep3e_tags";
import Next_step_f from "./pipelineStep3f_profile";

import axios from 'axios'



export default function CategoryButtons(props) {
    const [state_changer, change_state] = useState(0);

    //0
    const [display_type, update_type] = useState("questions_page");
    //state 0 is questions. State 1 is tags. (State 2 is search(?), do not know if searching should be here)

    const [question_style, set_question_style] = useState({
        top: '88px',
        left: '50%',
        transform: 'translateX(-655px)',
        background: '#f2f2f3',
        boxShadow: '5px 0px 1px -1px #f48424'
    })

    const [tag_style, set_tag_style] = useState({
        top: '146px',
        left: '50%',
        transform: 'translateX(-655px)',
        paddingLeft:'68px',
        paddingRight: '125px'
    })

    const ask_question = {
        top: '66px',
        left: '60%',
        transform: 'translateX(220px)'
    }
    
    const divider_line = {
        zIndex: '2500',
        borderLeft: '1px solid #d7d7d7',
        height: '100%',
        position: 'fixed',
        top: '46px',
        left: '50%',
        transform: 'translateX(-425px)'
    }

    const profile = {
        position: 'fixed',
        top: '7px',
        left: '50%',
        height: '33px',
        transform: 'translateX(505px)',
        zIndex: '7000'
    }

    const log_out = {
        position: 'fixed',
        top: '7px',
        left: '50%',
        height: '33px',
        transform: 'translateX(625px)',
        zIndex: '7000'
    }

    function question_click(){

        //update colors
        set_question_style({
            top: '88px',
            left: '50%',
            transform: 'translateX(-655px)',
            background: '#f2f2f3',
            boxShadow: '5px 0px 1px -1px #f48424'
        })

        set_tag_style({
            top: '146px',
            left: '50%',
            transform: 'translateX(-655px)',
            paddingLeft:'68px',
            paddingRight: '125px',
            background: 'transparent',
            boxShadow: ''
        })

        console.log("this is state_changer: " + state_changer)

        change_state((state_changer+1)%10)

        //0
        update_type("questions_page")
    }

    function tag_click(){

        //update colors
        set_question_style({
            top: '88px',
            left: '50%',
            transform: 'translateX(-655px)',
            background: 'transparent',
            boxShadow: ''
        })

        set_tag_style({
            top: '146px',
            left: '50%',
            transform: 'translateX(-655px)',
            paddingLeft:'68px',
            paddingRight: '125px',
            background: '#f2f2f3',
            boxShadow: '5px 0px 1px -1px #f48424'
        })

        //1
        update_type("tags_page")
    }

    //searching is type 2 and type 3
    //doenst work
    /*if(props.filter){
        props.type === 0? update_type(2) : update_type(3);
    }*/
    //searching for character through bar is type 2. Searching by clicking on a tag is type 3

    function ask_q_click(){
        set_question_style({
            top: '88px',
            left: '50%',
            transform: 'translateX(-655px)',
            background: 'transparent',
            boxShadow: ''
        })

        set_tag_style({
            top: '146px',
            left: '50%',
            transform: 'translateX(-655px)',
            paddingLeft:'68px',
            paddingRight: '125px',
            background: 'transparent',
            boxShadow: ''
        })

        //4
        update_type("new_question")
    }


    function profile_click(){
        change_state((state_changer+1)%10)

        //0
        update_type("profile_page")
    }

    function logout(){
        axios.post("http://localhost:8000/logout").then(() => {
            props.logout(null);
        })

    }

    //update current model

    useEffect(() =>{
        console.log(props.filter);
        props.filter != undefined?
        //2 : 3
            props.type === 0? update_type("search") : update_type("tags_search")
            : update_type("questions_page")

        change_state((state_changer+1)%2)

        //update colors
        set_question_style({
            top: '88px',
            left: '50%',
            transform: 'translateX(-655px)',
            background: '#f2f2f3',
            boxShadow: '5px 0px 1px -1px #f48424'
        })

        set_tag_style({
            top: '146px',
            left: '50%',
            transform: 'translateX(-655px)',
            paddingLeft:'68px',
            paddingRight: '125px',
            background: 'transparent',
            boxShadow: ''
        })

    }, [props.parent_state]);

    //<Next_step_e callback={props.callback}/>
    //not sure about next_step implementation. What I was thinking is maybe knowing the type can be useful?
    //for example if its tags we can redirect it somewhere.

    //<Next_step_d id = {display_type.substring(13)} callback = {update_type}/>
    console.log("This is the update type: " + display_type)
    return(
        <div id={'category_items'}>
            
            <button className={'category-button'} id={'questions_button'} style={question_style} onClick={question_click}>Questions</button>

            <button className={'category-button'} id={'tags_button'} style={tag_style} onClick={tag_click}>Tags</button>

            <div style={divider_line}></div>
            
            {props.user === 'guest' ? <div></div> : <div>
                <button className={'standard_button_blue'} id={"ask_new_question"} style={ask_question} onClick={ask_q_click}>Ask Question</button>
                <button className = {'standard_button_blue'} id = {'profile_button'} style = {profile} onClick={profile_click}>Profile</button>
                </div>}
            
            <button className = {'standard_button_blue'} id = {'logout_button'} style = {log_out} onClick={logout}>Log Out</button>

            {display_type === "tags_page"? <Next_step_e callback={props.callback}/>  :
                display_type === "search"? <Next_step_a type={display_type}
                                                 callback={update_type}
                                                 filter={props.filter}
                                                 p_state={state_changer}/> :
                    display_type === "tags_search"? <Next_step_a type = {display_type}
                                                    callback = {update_type}
                                                    filter = {props.filter}
                                                    p_state = {state_changer}
                                                    tag = {props.tag}/>:
                        display_type === "new_question"? <Next_step_b callback={question_click} p_state={state_changer}/> :
                        display_type === "profile_page"? <Next_step_f call_back = {update_type} p_state={state_changer}/>:
                        display_type.substring(0,18) === "posts/answer_edit/"? <Next_step_d id={display_type.substring(18, display_type.indexOf('/', (18)+1))} callback = {update_type} user = {props.user} 
                                                                                            display_first={display_type.substring(display_type.indexOf('/', (18)+1))} user_type={props.user}/>:
                        display_type.substring(0,20) === "posts/edit_question/"? <Next_step_b callback={question_click} id={display_type.substring(20, display_type.indexOf('/', (20)))} p_state={state_changer}
                                                                                            this_user={display_type.substring(display_type.indexOf('/', (20))+1)}/> :

                        //COMES FROM ANSWER PAGE. WILL BE FORMATTED AS: answer_editor/question_id/answer_id
                        display_type.substring(0,14) === "answer_editor/"? < Next_step_c callback = {update_type} answer_editing = {display_type.substring(14, display_type.indexOf('/', (14)))} qid={display_type.substring(display_type.indexOf('/', (14))+1,display_type.indexOf('/',display_type.indexOf('/', 14+1)+1))}
                                                                                user_id={display_type.substring(display_type.lastIndexOf('/')+1)}/> :
                        //CHANGE CALLBACK TO SUBSTRING
                        display_type.substring(0,19) === "new_answer_creator/"? < Next_step_c callback = {update_type} id = {display_type.substring(19)}/> :
                                display_type.substring(0,13) === "posts/answer/"? <Next_step_d id = {display_type.substring(13)} callback = {update_type} user = {props.user}/> : 
                                    <Next_step_a type={display_type} callback={update_type} p_state = {state_changer} user_type={props.user}/>}
        </div>
    );
}