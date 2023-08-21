//I do not know what step this pipeline is.
//import {sof_model} from "../models/model";
import {useEffect, useState} from "react"
import render_tags from "./pipelineStep6Helper_tagNames";
import axios from 'axios'

import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
//extract function id by subtracting by 4


//callback is some function that is a reference to the changeState of title.
export default function Questions(props){


    //questions_to_make = JSON.parse(JSON.stringify(questions_to_make))

    //console.log("Hello. This is step6. These are the list items we have received: " + questions_to_make)
    const [index, setIndex] = useState(0)
    const [tag_list, set_tag_list] = useState({})

    useEffect(() => {
       let tags = {};

       
        console.log("props.questions_to_make is THIS: " + props.questions_to_make)

        const promises = props.questions_to_make.map((question) => {
            return render_tags(question).then((result) => {
                tags[question._id] = result;
                
            }).catch((error) => {
                console.error(error);
            });
        })

        Promise.all(promises).then( () => {
            set_tag_list(tags)
        }).catch( (error) => {
            console.error(error)
        })
       
    }, [props.questions_to_make]);



    function get_the_time(the_other_date){
        //time different in seconds
        let time_differential = Math.floor((Date.now() - the_other_date)/1000);

        if(time_differential < 60){
            return time_differential + " seconds ago";
        }else if(time_differential < 3600){
            return Math.floor(time_differential/60) + " minutes ago";
        }else if(time_differential < 86400){
            return Math.floor(time_differential/60/60) + " hours ago";
        }else if(time_differential < 31536000){
            let string_date = the_other_date.toString().split(" ");
            return string_date[1] + " " + string_date[2] + " " +
                string_date[3] + " at " + string_date[3].substring(0,5);
        }else{
            return Math.floor(time_differential/31536000) + " years ago";
        }
    }



    const table_style = {
        position: 'absolute',
        border: '0 solid #d7d7d7',
        borderTopWidth: '1px',
        width: '750px'
    }
    const next = {
        left: '55%',
        transform: 'translateX(180px)'
    }
    const prev = {
        left: '45%',
    }
    function handleNextClick() {
        if(index+5 > props.questions_to_make.length) {
            setIndex(0)
        }
        else {
            setIndex(index => index+5)
        }
    }
    
    function handlePrevClick() {
        setIndex(index => index-5)
    }
    //console.log(table);

    /*return(<div>
        <table className={'question_box2'} style={table_style}>
            {table}
        </table>
    </div>)*/

    /*function helper(num){
        console.log("yep");
        return random_fun()
    }*/
    //let list_to_use = questions_to_make.reverse();

    /*function answers_page(id){
        call_back(parseInt(id.substring(1)) + 5)
    }*/
    let currentQuestions = props.questions_to_make.slice(index, index+5);

    console.log("props.questions_to_make is THIS RIGHT BEFORE THE RETURN: " + props.questions_to_make)
    return (

        <div>

            <table className={'question_box2'} style={table_style}>
                <tbody key={"main_body"}>
                    
                
                {
                    
                    currentQuestions.map( (question) => {
                    
                    //let str = question['qid'];    
                    var glob_id = question._id
                    var views = question.views;
                    window.answers_page = function (id, views){
                        console.log("I am executed!")
                        console.log("This is the question id: " + glob_id)
                        //sof_model.increment_view(id)

                        //WE HAVE TO REIMPLEMENT THIS
                        
                        views++;
                        id = id.substring(0,24)
                        try{
                            console.log(`Making PUT request to URL: http://localhost:8000/questions/${id}/views`);
                            const response = axios.put(`http://localhost:8000/questions/${id}/views`, {views: views}).then(() =>{
                                
                                console.log(response.data)
                                
                                console.log("I GET HERE")
                                
                                props.call_back("posts/answer/" + id)
                            }) 
                        }   
                        catch(error) {
                            console.error('Error updating question views:', error);
                        }
                        
                    }

                    /*function answers_page(id){
                        call_back(parseInt(id.substring(1)) + 5)
                    }*/

                    //STRING STARTS HERE
                            const html_string = `
                        <a onclick="answers_page('${glob_id}, ${views}'); return false;" 
                        href="#" class="q_link">${question["title"]}</a>
                        <br/><br/><br/>
                        <div class='single_lined_text'>
                            <span>
                                ${tag_list[question._id]}
                            </span>
                            
                            <p style='color:black; font-size: 12px;'>
                            ${question['asked_by']} asked ${get_the_time(new Date(question['ask_date_time']))}</p>
                        </div>`//STRING ENDS HERE



                    return (<tr key={"row " + question['_id']}>
                        <td className={'question_box1  question_info'} key={"cell1 " + question['_id']}
                            dangerouslySetInnerHTML={{__html: `${question['answers'].length} 
                            answers<br class = stat_br/>${question['views']} views`}}/>

                        <td className={'question_box1 question_box_question_body'} key={"cell2 " +
                            question['_id']} dangerouslySetInnerHTML={{__html: html_string}}/>
                        
                        <td><ArrowCircleUpIcon style = {{color: '#FF7F50', paddingTop: '10px'}}> </ArrowCircleUpIcon>
                        
                            <div> vote# </div>
                            <ArrowCircleDownIcon style = {{color: '#6495ED', paddingTop: '10px'}}> </ArrowCircleDownIcon>
                        </td>
                    </tr>)
                })}
                <tr><td>{index === 0 ? <div></div> : <div><button className = {'standard_button_blue'} id = {'next_button'} style = {prev} onClick = {handlePrevClick}>Prev</button></div>}
                <button className = {'standard_button_blue'} id = {'next_button'} style = {next} onClick = {handleNextClick}>Next</button></td></tr>
                </tbody>
                
            </table>
            
        </div>
    )

    /*
    *
    * */
    //{table}
    //next step is wrong. The next step is actually title where we pass in answer page
}