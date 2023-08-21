//import {sof_model} from '../models/model'
import {useState, useEffect} from 'react'
import render_tags from "./pipelineStep6Helper_tagNames";
import axios from 'axios'

import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

export default function Display_profile(props){
    

    const [render, setRender] = useState({
        //list: sof_model.get_all_qstns(),
        username: "x",
        reputation: 0,
        date: 1, 
        questions: [], 
        answers: [], 
        tags: []
    });

    //takes on 3 different states, question, answers, tags. Chooses which one of the three to render in the table.
    const [current_display, set_display] = useState("questions");

    const [index, setIndex] = useState(0)

    const [id_payload, set_payload] = useState({});

    const [tag_list1, set_tag_list1] = useState({})

    const [tag_list2, set_tag_list2] = useState({})

    useEffect(() => {

        console.log("Use Effect is ran!")
        
        new Promise((resolve, reject) => { 
            
            console.log("TELL ME I GET HERE")
            
            axios.post('http://localhost:8000/user_profile', id_payload, {withCredentials: true}).then((response) => {
                if(!response.data.other_users){
                    setRender({
                        username: response.data.username,
                        reputation: response.data.reputation,
                        date: response.data.date,
                        questions: response.data.questions,
                        answers: response.data.answers,
                        tags: response.data.tags
                    })
                }else{
                    setRender({
                        username: response.data.username,
                        reputation: response.data.reputation,
                        date: response.data.date,
                        questions: response.data.questions,
                        answers: response.data.answers,
                        tags: response.data.tags,
                        other_users: response.data.other_users
                    })
                }
                console.log("this is ran!")

                let tags = {};

                console.log("props.questions_to_make is THIS: " + props.questions_to_make)

                let promises = response.data.questions.map((question) => {
                    return render_tags(question).then((result) => {
                    tags[question._id] = result;
                
                    }).catch((error) => {
                        console.error(error);
                    });
                })

                Promise.all(promises).then( () => {
                    set_tag_list1(tags)
                }).catch( (error) => {
                    console.error(error)
                })

                tags = {};
                promises = response.data.answers.map((question) => {
                    return render_tags(question).then((result) => {
                        tags[question._id] = result;
                
                   }).catch((error) => {
                        console.error(error);
                    });
                })

                Promise.all(promises).then( () => {
                    set_tag_list2(tags)
                }).catch( (error) => {
                    console.error(error)
                })



                }).catch((error) => {
                    console.error(error);
                    reject(error);
                });
            
        })

    },[props.p_state, id_payload])

    function get_the_time(the_other_date){
        the_other_date = new Date(the_other_date)
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
        width: '1000px',
        top: "90px",
        left: "50%",
        transform: "translateX(-375px)"
    }

    const title_style = {
        fontSize: '21px',
    }

    const gridContainer = {
        display: 'grid',
        gridTemplateColumns: "300px 300px 300px",
        height: "20px",
        width: "700px",
        top: "200px",
    }

    const next = {
        left: '55%',
        transform: 'translateX(180px)'
    }
    const prev = {
        left: '45%',
        transform: 'translateX(50px)',
    }

    function handleNextClickQuestions() {
        if(index+5 > render.questions.length) {
            setIndex(0)
        }
        else {
            setIndex(index => index+5)
        }
    }

    function handleNextClickAnswers() {
        if(index+5 > render.answers.length) {
            setIndex(0)
        }
        else {
            setIndex(index => index+5)
        }
    }
    
    function handlePrevClick() {
        if(index > 0){
            setIndex(index => index-5)
        }
    }
    
    
    //let hyperlinkPattern = /\[(.*?)\]\((https?:\/\/\S+)\)/g;
    function setToQuestions() {
        set_display("questions")
        setIndex(0)
    }

    function setToAnswers(){
        set_display("answers")
        setIndex(0)
    }

    function setToTags() {
        set_display("tags")
        setIndex(0)
    }
    
    
    let currentQuestions = render.questions.slice(index, index+5);
    let currentAnswers = render.answers.slice(index, index+5);
    return (
        <div>
            <div style={table_style}>
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-400px)', fontSize: '27px' }}>
                    {render.username + " Profile"}
                </div>
    
                <table style={{width: '700px'}}>
                    <tbody key={"body1"}>
                        <tr>
                            <td style={title_style}><br /><br /><br />Time as a member:
                                <span style={{ fontSize: '16px' }}> {get_the_time(render.date)} </span>
                            </td>
                        </tr>
                        <tr>
                            <td style={title_style}><br /><br /><br />Reputation:
                                <span style={{ fontSize: '16px' }}> {render.reputation} </span>
                            </td>
                        </tr>
                    </tbody>
                </table>


                <table style={{width: '700px'}}>
                    <tbody key={"body1"}>{
                        render.other_users ?//render other users
                        (<> <tr>

                        <td style={title_style}><br /><br /><br /><br />Manage Users</td>
                    </tr>
                    {render.other_users === 0 ? (<tr><td>No Other Users</td></tr>) :

                        (
                            render.other_users.map((user) => {
                                var glob_id = user._id;

                                window.answers_page = function (id) {
                                    console.log("This is the User id: " + id)
                                    //sof_model.increment_view(id)

                                    //WE HAVE TO REIMPLEMENT THIS
                                    set_payload({id: id})
                                }

                                //NEEDS TO BE CHANGED TO DO USERS
                                const html_string = `
                                    <a onclick="answers_page('${glob_id}'); return false;" 
                                    href="#" class="q_link">${user["name"]}</a>
                                    <br/><br/><br/>
                                    <div class='single_lined_text'>
                                        <span>
                                            Email: ${user.email} 
                                        </span>
                                        
                                        <p style='color:black; font-size: 13px;'>
                                            User joined ${get_the_time(new Date(user['date_joined']))}
                                        </p>
                                    </div>`;

                                return (
                                    <tr key={"row otherusers" + user['_id']}>
                                        <td className={'question_box1 question_box_question_body'} key={"cell2 otherusers" +
                                            user['_id']} dangerouslySetInnerHTML={{ __html: html_string }}
                                        />
                                    </tr>
                                    
                                );
                            })
                        )}</>)
                :
                //do nothing
                <></>
        }
        </tbody>
    </table>

    <table style={{width: '700px'}}>
        <tbody key={"body1"}>
         <tr>
            <td>
        <br/><br /><br /><br /><br />

        <div style={{ display: 'inline-block' }}>
            <button type="button" className="standard_button_blue" style={{ position: 'relative' }} onClick={setToAnswers}>
                Show Answers
            </button>
        </div>

    </td>

    <td>
        <br/><br /><br /><br /><br />
        <div style={{ display: 'inline-block', transform: 'translateX(-100px)' }}>
            <button type="button" className="standard_button_blue" style={{ position: 'relative'}} onClick={setToTags}>
                Show Tags
            </button>
        </div>
    </td>
        
    <td>
        <br/><br /><br /><br /><br />
        <div style={{ display: 'inline-block', transform: 'translateX(-205px)'}}>
            <button type="button" className="standard_button_blue" style={{ position: 'relative' }} onClick={setToQuestions}>
                Show Questions
            </button>
        </div>
    </td>
    </tr>
    </tbody>
</table>

    <table style={{width: '700px'}}>
        <tbody key={"body1"}>
            {current_display === "questions" ? (
   /*************************QUESTION POSTED RENDER************************/
   <>    
        <tr>
            <td style={title_style}><br/>Questions</td>
        </tr>
        {render.questions.length === 0 ? (
            <tr>
                <td style={{ fontSize: '16px' }}>No questions asked.</td>
            </tr>
        ) : (
            currentQuestions.map((question) => {
                var glob_id = question._id;

                window.edit_question = function (id) {
                    console.log("This is the question id we clicked on: " + glob_id)
                    //sof_model.increment_view(id)
                    id = id.substring(0, 24)
                    let this_user = id_payload.id;
                    if(this_user === undefined){
                        this_user = ""
                    }
                    props.call_back("posts/edit_question/" + id + "/" + this_user)
                }

                const html_string = `
                                    <a onclick="edit_question('${glob_id}'); return false;" 
                                    href="#" class="q_link">${question["title"]}</a>
                                    <br/><br/><br/>
                                    <div class='single_lined_text'>
                                        <span>
                                            ${tag_list1[question._id]}
                                        </span>
                                        <p style='color:black; font-size: 12px;'>
                                            ${question['asked_by']} asked ${get_the_time(new Date(question['ask_date_time']))}
                                        </p>
                                    </div>`;

                                return (
                                    <tr key={"row questions" + question['_id']}>
                                        <td className={'question_box1  question_info'} key={"cell1 questions" + question['_id']}
                                            dangerouslySetInnerHTML={{ __html: `${question['answers'].length} 
                                            answers<br class = stat_br/>${question['views']} views` }}
                                        />

                                        <td className={'question_box1 question_box_question_body'} key={"cell2 questions" +
                                            question['_id']} dangerouslySetInnerHTML={{ __html: html_string }}
                                        />

                                        <td>
                                            <ArrowCircleUpIcon style={{ color: '#FF7F50', paddingTop: '10px' }}></ArrowCircleUpIcon>

                                            <div> vote# </div>
                                            <ArrowCircleDownIcon style={{ color: '#6495ED', paddingTop: '10px' }}></ArrowCircleDownIcon>
                                        </td>
                                    </tr>
                                );
                    })
                )}
        <tr>
            <td>{index === 0 ? <div></div> :
                <div><button className={'standard_button_blue'} id={'next_button'} style={prev} onClick={handlePrevClick}>Prev</button></div>
            }
            <button className={'standard_button_blue'} id={'next_button'} style={next} onClick={handleNextClickQuestions}>Next</button>
            </td>
        </tr></>
                ) :
                current_display === "answers" ? (
                    <>
                        <tr>
                            <td style={title_style}><br/>Questions Answered</td>
                        </tr>
                        {currentAnswers.length === 0 ? (
                            <tr>
                                <td style={{ fontSize: '16px' }}>No questions answered.</td>
                            </tr>
                        ) : (
                            render.answers.map((question) => {
                                var glob_id = question._id;

                                window.answers_page = function (qid) {
                                    console.log("I am executed!")
                                    console.log("THE LINK IS WORKING!")
                                    console.log("This is the question id: " + glob_id)
                                    //sof_model.increment_view(id)

                                    //WE HAVE TO REIMPLEMENT THIS
                                    let user_id = ""
                                    if (id_payload.id) {
                                        user_id = id_payload.id
                                    }
                                    props.call_back("posts/answer_edit/" + qid + "/" + user_id)
                                }

                                const html_string = `
                                    <a onclick="answers_page('${glob_id}'); return false;" 
                                    href="#" class="q_link">${question["title"]}</a>
                                    <br/><br/><br/>
                                    <div class='single_lined_text'>
                                        <span>
                                            ${tag_list2[question._id]}
                                        </span>
                                        <p style='color:black; font-size: 12px;'>
                                            ${question['asked_by']} asked ${get_the_time(new Date(question['ask_date_time']))}
                                        </p>
                                    </div>`;

                                return (
                                    <tr key={"row answers" + question['_id']}>
                                        <td className={'question_box1  question_info'} key={"cell1 answers" + question['_id']}
                                            dangerouslySetInnerHTML={{ __html: `${question['answers'].length} 
                                            answers<br class = stat_br/>${question['views']} views` }}
                                        />

                                        <td className={'question_box1 question_box_question_body'} key={"cell2 answers" +
                                            question['_id']} dangerouslySetInnerHTML={{ __html: html_string }}
                                        />

                                        <td>
                                            <ArrowCircleUpIcon style={{ color: '#FF7F50', paddingTop: '10px' }}></ArrowCircleUpIcon>

                                            <div> vote# </div>
                                            <ArrowCircleDownIcon style={{ color: '#6495ED', paddingTop: '10px' }}></ArrowCircleDownIcon>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        <tr>
                            <td>{index === 0 ? <div></div> :
                                <div><button className={'standard_button_blue'} id={'next_button'} style={prev} onClick={handlePrevClick}>Prev</button></div>
                            }
                                <button className={'standard_button_blue'} id={'next_button'} style={next} onClick={handleNextClickAnswers}>Next</button>
                            </td>
                        </tr>
                    </>
                ) :

                    /*************************TAGS CREATED RENDER************************/
                    <>
                        <tr>
                            <td style={title_style}><br/>Tags</td>
                        </tr>
                        {
                            render.tags.length === 0 ?
                                (<tr><td>No tags</td></tr>) :
                                (
                                    <tr>
                                        <div style={gridContainer}>
                                            {render.tags.map((item) => {
                                                var glob_tag = item.name;

                                                window.showQuestions = function (tag) {
                                                    console.log(tag)
                                                   
                                                    props.callback({ type: 1, filter: "[" + tag + "]", tag: tag })
                                                }
                                                const html_string = `
                                                <div key = "THIS IS THE ITEM: ${item.name}" style = 'margin-bottom: 50px; margin-left: 70px; margin-right: 10px; margin-top: -5px; width: 255px; height: 130px; text-align: center;
                                                padding-top: 40px; font-size: 17px; border: #919191 dashed; font-weight: 400 '>
                                                <a onclick="showQuestions('${glob_tag}'); return false;" href="#" class="q_link">${item.name}</a>
                                                <br/><br/>
                                                ${item['count'] == 1 ? "1 question" : item['count'] + " questions"}
                                                </div>`

                                            return (<div key={"Tag of tag: " + item.name + item._id} dangerouslySetInnerHTML={{ __html: html_string }}></div>)

                                            //SOMEHOW ALLOW THE TAGS TO BE EDITTED MAYBE A TEXTBOX OR SOMETHING
                                        })}
                                    </div>
                                </tr>
                            )
                    }
                </>
            //import code from tags
        }


    </tbody>
</table>
</div>
</div>
);
}