import {useEffect, useState} from "react";
//import {sof_model} from '../models/model'
//import Next_step from './pipelineStep5_title'
import Next_step from './pipelineStep4_list'
import axios from 'axios'

//sorts list based on the button clicked. Also implements the button

export default function SortingButtons(props) {
    //0 is newest, 1 is active, 2 is unanswered


    const [list_display, change_list] = useState([])
    const [state_changer, change] = useState(0)

    //console.log("Entering sorting this is the list we have: " + props.list)
    //console.log("This is to verify. The ^ should be equal: " + list_display)




    const [newest, newest_style] = useState({
        zIndex: '2000',
        cursor:'pointer',
        position: 'absolute',
        top: '130px',
        left: '50%',
        transform: 'translateX(45px)',
        fontFamily: 'sansSerif',
        color: '#4d5257',
        backgroundColor: '#e4e6e8',
        borderRadius: '4px 0px 0px 4px',
        borderWidth: '0px',
        width: '67px',
        height: '30px',
        boxShadow: '0px 0px 1px 1px #989898'
    })

    const [active, active_style] = useState({
        zIndex: '2000',
        cursor:'pointer',
        position: 'absolute',
        top: '130px',
        left: '50%',
        transform: 'translateX(113px)',
        fontFamily: 'sansSerif',
        backgroundColor: '#fafafa',
        color: '#919191',
        borderWidth: '0px',
        width: '56px',
        height: '30px',
        boxShadow: '0px 0px 1px 1px #989898'
    })

    const [unanswered, unanswered_style] = useState({
        zIndex: '2000',
        cursor:'pointer',
        position: 'absolute',
        top: '130px',
        left: '50%',
        transform: 'translateX(170px)',
        fontFamily: 'sansSerif',
        color: '#919191',
        background: '#fafafa',
        borderRadius: '0px 4px 4px 0px',
        borderWidth: '0px',
        width: '80px',
        height: '30px',
        boxShadow: '0px 0px 1px 1px #989898'
    })

    function newest_click(){

        newest_style({
            ...newest,
            color: '#4d5257',
            background: '#e4e6e8'
        })

        active_style({
            ...active,
            color: '#919191',
            background: '#fafafa'
        })

        unanswered_style({
            ...unanswered,
            color: '#919191',
            background: '#fafafa'
        })


        axios.get('http://localhost:8000/questions_sorted_newest', { withCredentials: true }).then(result =>{
            /*for( let z = 0; z< result.data.length; z++){
                console.log("GET IN NEWEST IS ENTERED -- THIS IS RESULT: " + result.data[z]['title'])
            }*/
                
            change_list(result.data)
            change((state_changer+1)%5)
        }).catch(error => {
            console.error(error)
        })
        //change_list([...props.list]);
    }

    function active_click(){

        newest_style({
            ...newest,
            color: '#919191',
            background: '#fafafa'
        })

        active_style({
            ...active,
            color: '#4d5257',
            background: '#e4e6e8'
        })

        unanswered_style({
            ...unanswered,
            color: '#919191',
            background: '#fafafa'
        })


        axios.get('http://localhost:8000/questions_sorted_active',{withCredentials: true}).then(result =>{
            change_list(result.data)
            change((state_changer+1)%5)
        }).catch(error => {
            console.error(error)
        })

        /*let some_list = [...props.list]

        some_list = JSON.parse(JSON.stringify(some_list)).sort(function (a, b) {
            return sof_model.get_most_recent_answer_date(a["qid"]) - sof_model.get_most_recent_answer_date(b["qid"]);
        })*/

        //change_list(some_list.reverse())
    }

    function unanswered_click(){

        newest_style({
            ...newest,
            color: '#919191',
            background: '#fafafa'
        })

        active_style({
            ...active,
            color: '#919191',
            background: '#fafafa'
        })

        unanswered_style({
            ...unanswered,
            color: '#4d5257',
            background: '#e4e6e8'
        })


        axios.get('http://localhost:8000/questions_sorted_unanswered',{withCredentials: true}).then(result =>{
            change_list(result.data)
            change((state_changer+1)%5)
        }).catch(error => {
            console.error(error)
        })

        /*let some_list = []
        for(let i = 0; i< props.list.length; i++){
            if(props.list[i]['ansIds'].length == 0){
                some_list.push(props.list[i]);
            }
        }*/
        //change_list(some_list)
    }

    useEffect(() => {
        
        newest_style({
            ...newest,
            color: '#4d5257',
            background: '#e4e6e8'
        })

        active_style({
            ...active,
            color: '#919191',
            background: '#fafafa'
        })

        unanswered_style({
            ...unanswered,
            color: '#919191',
            background: '#fafafa'
        })


        axios.get('http://localhost:8000/questions_sorted_newest', { withCredentials: true }).then(result =>{
            /*for( let z = 0; z< result.data.length; z++){
                console.log("GET IN NEWEST IS ENTERED -- THIS IS RESULT: " + result.data[z]['title'])
            }*/
                
            change_list(result.data)
            change((state_changer+1)%5)
        }).catch(error => {
            console.error(error)
        })
        
    }, [props.p_state]);

    //
    //Next_step questions_to_make={list_display} call_back={props.callback} type={props.type} tag={props.tag}/>

    console.log("THIS IS OUR LIST IN SORTING: " + list_display)

    return(
        <div>
            <button id="Newest_Sort" type = "button"
                    style={newest} onClick={newest_click}>Newest</button>

            <button id="Active_Sort" type = "button"
                    style={active} onClick={active_click}>Active</button>

            <button id="Unanswered_Sort" type = "button"
                    style={unanswered} onClick={unanswered_click}>Unanswered</button>

            <Next_step {...props} list={list_display} s_state={state_changer}/>
        </div>
    );

}