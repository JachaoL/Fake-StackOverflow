//import {sof_model} from '../models/model'
import axios from 'axios'
import {useState, useEffect} from 'react'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

//props include question id and a callback
export default function Display_answers(props){
    /*let questions : sof_model.get_all_qstns();
    var answerIds : questions[props.id].ansIds;

    let answers : new Array();
    for(let i : 0; i < sof_model.get_all_answers().length; i++) {
        for(let j : 0; j < answerIds.length; j++) {
            if(sof_model.get_all_answers()[i].aid :: answerIds[j]) {
                answers.push(sof_model.get_all_answers()[i])
            }
        }
    }
    answers.reverse();*/
    //we have all our answers now
    const [myAnswers, setAnswers] = useState({
        //list: sof_model.get_all_qstns(),
        answers: [],
        title: "1",
        text: "1",
        views: "1", 
        asked_by: "1", 
        ask_date_time: "1", 
        words: [],
        comments: [],
        commentsAnswers: [],
        current_user: []
    });

    let display_ID_first = {};

    useEffect(() => {
        
        new Promise((resolve, reject) => { 

            if(props.display_first){
                display_ID_first = {id: props.display_first}
            }
            
            console.log("TELL ME I GET HERE")
            axios.get('http://localhost:8000/get_user', { withCredentials: true }).then( user => {
                axios.get(`http://localhost:8000/get_question/${props.id}`).then((response) => {
                    axios.get('http://localhost:8000/answer_list/'+props.id, { withCredentials: true }, {params: {normalParam: display_ID_first}}).then((answer_list) => {
                        axios.get('http://localhost:8000/question/comments/'+props.id).then((comments_list) => {
                            console.log(answer_list.data.answer_list);
                            console.log(answer_list.data.answersComments)
                            console.log(comments_list.data);
                            console.log(response.data.title)
                            console.log("THIS IS THE EXTRACTED USER ANSWER LIST: ",user)
                            setAnswers({
                                
                            answers: answer_list.data.answer_list.reverse(),
                            
                            title : response.data.title,
                            text : response.data.text,
                            views : response.data.views,
        
                            asked_by : response.data.asked_by,
                            ask_date_time : response.data.ask_date_time,
                            words : response.data.text.split(' '),
                            comments: comments_list.data.reverse(),
                            commentsAnswers: answer_list.data.answersComments.reverse(),

                            
                            current_user: user.data.answers_posted
                            })
                            
                            console.log(response.askDate)
                            resolve(response.data)
                        }) 
                    })
                })
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        })
    },[props.p_state, props.id])

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
        width: '750px',
        top: "90px",
        left: "50%",
        transform: "translateX(-375px)"
    }
    let hyperlinkPattern = /\[(.*?)\]\((https?:\/\/\S+)\)/g;
    
    function handleAnswerClick() {
        //console.log("this is the value of the handle click: " + parseInt(questions[props.id]['qid'].substring(1))* -1)
        console.log("This is the type of the callback we will be using: " + typeof props.callback)
        props.callback("new_answer_creator/" + props.id)
        //props.callback(parseInt(questions[props.id]['qid'].substring(1))* -1, props.id)
    }


    //id is answer id props.display_first is userid
    function edit_answer(id){
        return function(){
            props.callback("answer_editor/" + id + "/" + props.id  + "/" + props.display_first)
        }
    }


/* {myAnswers.current_user.answers_posted.includes(answer._id) ? <div><button style = {{cursor: "pointer", position: "relative", top: "-80px", left:'1080px', fontSize: "13px", fontFamily: "sans-serif",
                        backgroundColor: "#0b96ff", color: "white", borderColor: "#0b96ff", borderRadius: "4px",
                        width: "100px", height: "40px", boxShadow:"0px -1px 1px 1px #7fbfff"}}>Edit Answer</button></div> : <></>}
*/

    return (
        <div>
            <div style={table_style}>
                {myAnswers.answers.length === 1 ? myAnswers.answers.length + " answer" : myAnswers.answers.length + " answers"}
                <div style = {{position: "absolute", top: "-5px", left: "50%", width: "600px", transform: "translateX(-220px)", fontWeight: "700", fontSize: "17px"}}>
                    {myAnswers.title}
                </div>

                <div style = {{position: "absolute", top: "60px", left: "50%", transform: "translateX(-375px)"}}>
                    {myAnswers.views === 1 ? myAnswers.views + " view" : myAnswers.views + " views"}
                </div>

                <div style = {{position: "absolute", left: "50%", top: "50px", width: "630px", fontWeight: "400", transform: "translateX(-220px)"}}>
                    {
                        myAnswers.words.map((word, index) => {
                            if(word.match(hyperlinkPattern)) {
                                return <a href = {word.substring(word.indexOf("](")+2, word.indexOf(")"))} key={"anchor_"+ props.id + "_"+ word + index}> {word.substring(word.indexOf("[")+1,word.indexOf("]")) } </a>
                            }
                            else {
                                return <span key={props.id + "__" + word + index}>
                                    {" "+word}
                                </span>
                            }
                        })
                    }
                </div>
                <div style = {{position: "absolute", left: "50%", top: "120px", fontSize: "15px", width: "100px", transform: "translateX(450px)"}}>
                    {myAnswers.asked_by} <br></br> {get_the_time(myAnswers.ask_date_time)}
                    <div style = {{position: "absolute", left: "50%", top: "60px", borderWidth: "1px 0px 0px", borderStyle: "solid", borderColor:"rgb(215, 215, 215)", width: "940px", transform: "translateX(-920px)"}}>
                    </div>
                    
                    <ArrowCircleUpIcon id = {props.id} style = {{color: '#FF7F50', position: 'fixed', left: '160px', top: '-100px'}}> </ArrowCircleUpIcon>
                        <div style={{position: 'fixed' , left: '160px', top: '-70px'}}> vote# </div>
                    <ArrowCircleDownIcon id = {props.id} style = {{color: '#6495ED', position: 'fixed', left: '160px', top: '-50px'}}> </ArrowCircleDownIcon>
                    <br>
                    </br>
                    
                    <div>
                        {myAnswers.comments.map((comment, index) => {

                            const words3 = comment.text.split(" ");
                            const html_string2 = `
                                <div key = {part of string${comment._id} ${index}} style = 'font-size: 11px; position: relative; left: 180%; top: 50px; font-weight: 400; width: 400px; transform: translateX(-700px); height: auto;'>
                                    ${
                                        words3.map((word3) => {
                                            if(word3.match(hyperlinkPattern)) {
                                                return `<a href= ${word3.substring(word3.indexOf("](")+2, word3.indexOf(")"))}
                                                        target="_blank"> 
                                                        ${word3.substring(word3.indexOf("[")+1,word3.indexOf("]")) } 
                                                        </a>`
                                            }
                                            else {
                                                return `<span >
                                                                ${word3 + ' '}
                                                            </span>`
                                            }
                                        }).join('')
                                    }
                                    <div style = 'position: relative; top: -30px; border-width: 0px 0px 0px 1px; border-style: solid; border-color:rgb(215,215,215); left: 75%; height: 50px; transform: translateX(-320px)'>
                                    </div>
                                    <div style = 'position: relative; font-size: 11px; font-weight: 400; left: 15%; top: -70px; width: 100px; transform: translateX(440px)'>
                                        ${comment.comment_by} <br style = 'width: 20px;'> ${"answered "+ new Date(comment.comment_date_time).toString().substring(0, new Date(comment.comment_date_time).toString().indexOf("GMT"))}</br>
                                        </div>
                                        
                                        <div style = 'position: relative; top: -30px; border-width: 1px 0px 0px 0px; border-style: solid; border-color:rgb(215, 215, 215); left: 35%; width: 940px; transform: translateX(-490px)'> </div>
                                        
                                </div>
                            `
                            return ( <div key = {"comment number" + index+comment._id}>
                                <div key={"page for comment: id"+index + comment._id} dangerouslySetInnerHTML={{__html: html_string2}}></div>
                                <ArrowCircleUpIcon id = {comment._id + "upvote"} style = {{color: '#FF7F50', position: 'fixed', left: '160px', top: '80px'}}> </ArrowCircleUpIcon>
                                <div key={"SOME FHSGHSG" + index} style={{position: 'fixed' , left: '160px', top: '103px'}}> vote# </div>
                                <ArrowCircleDownIcon id = {comment._id + "downvote"} style = {{color: '#6495ED', position: 'fixed', left: '160px', top: '120px'}}> </ArrowCircleDownIcon>
                            </div>)

                        })}
                    </div>
                    <div>
                        {myAnswers.answers.map( (answer, index) => {


                            console.log(answer._id)
                            console.log(answer)
                            const words2 = answer.text.split(' ');
                            return ( <div key={"page for answer: id" +index + answer._id}>
                                <div style={{ fontSize: '15px', position: 'relative', left: '50%', top: '30px', fontWeight: 400, width: '770px', transform: 'translateX(-850px)' }}>
                                    <>
                                        {words2.map((word2) => {
                                        if (word2.match(hyperlinkPattern)) {
                                            return (
                                            <a key={word2.id + index + "anchor link"} href={word2.substring(word2.indexOf('](') + 2, word2.indexOf(')'))}>
                                                {word2.substring(word2.indexOf('[') + 1, word2.indexOf(']'))}
                                            </a>
                                            );
                                        } else {
                                            return (
                                            <span key={word2.id + index + "sameline"}>
                                                {word2 + ' '}
                                            </span>
                                            );
                                        }
                                        })}
                                    </>
                                    </div>
                                    <br></br>
                                    <br></br>
                                <div style = {{position: 'relative', fontSize: '15px', fontWeight: 400, left: '50%', top: '-20px', width: '130px', transform: 'translateX(-100px)'}}>
                                            {answer.ans_by} 
                                            <br/> {"answered "+ new Date(answer.ans_date_time).toString().substring(0, new Date(answer.ans_date_time).toString().indexOf("GMT"))}
                                </div>
                                <ArrowCircleUpIcon id = {answer._id} style = {{color: '#FF7F50', position: 'relative', left: '160px', top: '-80px'}}/>
                                <div style={{position: 'relative' , left: '160px', top: '-80px'}}> vote# </div>
                                <ArrowCircleDownIcon id = {answer._id} style = {{color: '#6495ED', position: 'relative', left: '160px', top: '-80px'}}/>
                                <div style = {{position: 'relative', top: '-50px', borderWidth: '1px 0px 0px', borderStyle: 'solid', borderColor:'rgb(215, 215, 215)', left: '10%', width: '940px', transform: 'translateX(-880px)'}}> 
                                {(myAnswers.current_user.includes(answer._id))? <div><button style = {{cursor: "pointer", position: "relative", top: "-80px", left:'1080px', fontSize: "13px", fontFamily: "sans-serif",
                        backgroundColor: "#0b96ff", color: "white", borderColor: "#0b96ff", borderRadius: "4px",
                        width: "100px", height: "40px", boxShadow:"0px -1px 1px 1px #7fbfff"}} onClick = {edit_answer(answer._id)}>Edit Answer</button></div> : <></>}


                                </div>
                                <div>
                                {myAnswers.commentsAnswers.map((comments, index2) => {
                                    const commentElements = [];
                                    comments.forEach((comment) => {
                                    if(answer.comments.includes(comment._id)) {
                                        const words4 = comment.text.split(' ');
                                        console.log(words4);
                                        commentElements.push(
                                        <div key={comment._id + index2} style={{fontSize: '11px', position: 'relative', left: '180%', top: '-10px', fontWeight: 400, width: '400px', transform: 'translateX(-700px)'}}>
                                            {
                                                words4.map((word4, index) => {
                                                    if(word4.match(hyperlinkPattern)) {
                                                        return (<a key={word4.id +"anchor linking" + index +index2} href={word4.substring(word4.indexOf("](")+2, word4.indexOf(")"))}> 
                                                            {word4.substring(word4.indexOf("[")+1,word4.indexOf("]"))} 
                                                        </a>)
                                                    }
                                                    else {
                                                        return (<span key={word4.id + "samelinereturn" + index}>
                                                            {word4 + ' '}
                                                        </span>)
                                                    }
                                                })
                                            }
                                            <div key={"SODHGS" + index} style={{position: 'relative', top: '-30px', borderWidth: '0px 0px 0px 1px', borderStyle: 'solid', borderColor:'rgb(215,215,215)', left: '75%', height: '50px', transform: 'translateX(-320px)'}}>
                                            </div>
                                            <div key={"O*EGS&G*D*H" + index} style={{position: 'relative', fontSize: '11px', fontWeight: 400, left: '15%', top: '-70px', width: '100px', transform: 'translateX(440px)'}}>
                                                {comment.comment_by} 
                                                <br/> {"answered "+ new Date(comment.comment_date_time).toString().substring(0, new Date(comment.comment_date_time).toString().indexOf("GMT"))}
                                            </div>
                                            
                                        <ArrowCircleUpIcon id={comment._id} style = {{color: '#FF7F50', position: 'fixed', left: '681px', top: '-30px'}}/>
                                        <div key={'A DESCRIPTIVE KEY INDDED' + index} style={{position: 'fixed' , left: '681px', top: '-5px'}}> vote# </div>
                                        <ArrowCircleDownIcon id = {comment._id} style = {{color: '#6495ED', position: 'fixed', left: '681px', top: '10px'}}/>
                                            <div key={'THIS is indeed a key ' + index} style={{position: 'relative', top: '-20px', borderWidth: '1px 0px 0px 0px', borderStyle: 'solid', borderColor:'rgb(215, 215, 215)', left: '35%', width: '940px', transform: 'translateX(-490px)'}}>
                                            </div>
                                            </div>
                                            );              
                                        }
                                    });
                                    return commentElements;
                                })}
                                </div>
                            {
                                props.user !=='guest' ? 
                                <input style = {{position: 'relative', top: '-40px', left: '180%', width: '400px', transform: 'translateX(-700px)', borderRadius: '4px'}} type = 'text' id = 'new_comment' placeholder = 'New Comment...'>
                                </input> : <div></div>
                            }
                            <div>
                            </div>
                            </div>)
                        })}

                    </div>
                    <br>
                    </br>
                    {props.user === 'guest' ? <div></div> : <div><button onClick={handleAnswerClick}> Answer Question</button></div>}
                    
                </div>

            </div>

        </div>
    )
}