//fixed header components

//I think search bar has to be a pipeline step before categories
//search bar can be moved from here if it is needed. I think you will have to move it.

//plan right now is:
/*
*                                               new_answer_page
*                                                ^
*  list_creation/searching --> categories --> title --> sorting --> question_table
*             ^---------tags----' '-----------^ ,^                            |
*              new_question_creator^           '--------click_on_answer------'
* */

import {useState} from 'react';

import Next_step from './pipelineStep2_categories';


//tags calls this page to change set_next_prop
export default function TitlePage(props) {
    //console.log(props.user)
    const [next_prop, set_next_prop] = useState({});

    const searchbar = {
        position: 'fixed',
        top: '8px',
        left: '50%',
        transform: 'translateX(-210px)',
        width: '685px',
        height: '30px',
        borderRadius: '4px',
        borderWidth: '0px',
        boxShadow: '0px 0px 1px 1px #c0c0c0',
        zIndex: '7000'
    }

    function handleOnKeyDown(event) {
        let keyCode = event.keyCode ? event.keyCode : event.which;
        let filter = event.target.value;

        if(keyCode === 13) {
            set_next_prop({
                type: 0,
                filter: filter,
            })
            console.log("This is filter: " + filter)
            //Create_list(filter={filter} search_type={"1"});
        }
    }

    //<Next_step {...next_prop}/>



    return(
        <div>

            <input type={'text'} id={'search_input'} style={searchbar} placeholder={'Search...'} onKeyDown = {handleOnKeyDown}></input>
            <Next_step {...{...next_prop, callback: set_next_prop, parent_state: next_prop, logout: props.logout}} user = {props.user}/>

        </div>
    );
}