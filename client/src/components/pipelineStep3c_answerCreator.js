//some stuff largely similar to question creator. If that works this works.
//question number comes from the question page. We should have it as it will be passed in as a prop.
//clicking on a question will return questionid+6 as the displaytype.

//http://localhost:8000 REMOVED FROM THE POST

import {useState, useEffect} from 'react';
//import {sof_model} from "../models/model";
import axios from 'axios'

export default function Answer_creator(props){
    //console.log('HELLO'+props.id)
    let id = props.id;
    //let qid = "q"+id;
    //console.log(qid + "this should be qid for answer creator");
    const [a2_text, change_a2_text] = useState("")

    const [a2_status, change_a2_status] = useState("")

    const title = {
        position: 'absolute',
        zIndex: '2005',
        fontFamily: 'Helvetica Neue',
        fontSize: '37px',
        fontWeight: 'bold',
        top: '50px',
        left: '50%',
        transform: 'translateX(-310px)'
    }

    const box2 = {position: 'absolute',
        width: '670px',
        height: '280px',
        left: '50%',
        top: '205px',
        transform: 'translateX(-310px)'
    }


    const a2_title = {
        top: '203px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const a2_body = {
        top: '230px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const a2_textBox = {
        height: '200px',
        top: '260px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const a2_required_warning = {
        top: '453px',
        left: '50%',
        transform: 'translateX(-290px)'
    }


    const warning = {
        color: 'red',
        fontSize: '12px',
        zIndex: '2005',
        position: 'absolute',
        top: '477px',
        left: '50%',
        transform: 'translateX(230px)'
    }


    const post_answer_button = {
        top: '540px',
        left: '50%',
        transform: 'translateX(-310px)',
        zIndex: '1300'
    }

    const delete_answer_button = {
        top: '540px',
        left: '50%',
        transform: 'translateX(-180px)',
        zIndex: '1300'
    }

    const answer2 = (event) => {
        change_a2_text(event.target.value)
    }

    function post_answer(){

        let a2 = a2_text.trim()

        let a2_errors = ""

        // trying to hyperlink



        if(a2 === ""){
            a2_errors += "Problem description is required.\t"
        }
        let hyperlinkPattern = /\[(.*?)\]\((https?:\/\/\S+)\)/g;
        let hyperlinkPattern2 = /\[(.*?)\]\((.*?)\)/g;
        let hyperlinks = a2.match(hyperlinkPattern);
        let hyperlinks2 = a2.match(hyperlinkPattern2);
        if(hyperlinks) {

            hyperlinks.forEach(hyperlink => {
                let link = hyperlink.substring(hyperlink.indexOf("](")+2);
                if (!link.startsWith("http://") && !link.startsWith("https://")) {
                    a2_errors += "Invalid hyperlink. Please make sure the link starts with http:// or https:// \t"
                }
            })

        }
        else if(hyperlinks2){
            a2_errors += "Invalid hyperlink. Please make sure the link is valid. \t"
        }

        if(a2_errors){
            change_a2_status(a2_errors)
            return;
        }

        change_a2_status("")

        let text = a2
        //let date = Date.now();

        //sof_model.add_answer(text,ansBy,date,qid)
        console.log("Before answer post")
        //url here should be for questions
        //then: `/posts/question/${this._id}` is url.
        // as result 16,... is id

        let newAnswer = {text: text, for_question: id}
        if(props.answer_editing){
            newAnswer = {text: text, id: props.answer_editing}
            axios.post('http://localhost:8000/edit_answer', newAnswer, { withCredentials: true })
            .then(res => {
                console.log(res + " WE ARE INSIDE ANSWER POST");
                console.log(res.data);
                console.log("After answer post")
                //props.callback(id+5)
                props.callback("posts/answer/" + props.qid)
            })
        }else{

        axios.post('http://localhost:8000/new_answer', newAnswer, { withCredentials: true })
            .then(res => {
                console.log(res + " WE ARE INSIDE ANSWER POST");
                console.log(res.data);
                console.log("After answer post")
                //props.callback(id+5)
                props.callback("posts/answer/" + id)
            })
        }
    }


    useEffect(() => {
        if(props.answer_editing){
            axios.get(`http://localhost:8000/get_answer/${props.answer_editing}`, { withCredentials: true }).then(result =>{
                /*for( let z = 0; z< result.data.length; z++){
                    console.log("GET IN NEWEST IS ENTERED -- THIS IS RESULT: " + result.data[z]['title'])
                }*/
                change_a2_text(result.data.text)
                
    
            }).catch(error => {
                console.error(error)
            })
        }    
    }, [props.p_state]);


    function remove_answer(){
        let question = {id: props.answer_editing, user: props.user, qid: props.qid}

        console.log("AN ATTEMPT AT AN ID: ", props.user)

        axios.post('http://localhost:8000/delete_answer', question, { withCredentials: true })
            .then(() => {
                props.callback("posts/answer/" + props.qid)
            }).catch(err => console.log("THIS IS THE ERROR ON WHY WE SKIPPED MIDDLE: " + err))
    }



    //we will put all styling here do not want return to be too bloated.
    return(
        <div>
            <p style={title}>Answer a public question</p>


            <div className="make_a_question_style_box" id="make_a_question_box_2" style={box2}></div>



            <p className="make_a_question_style_Question_Title"
               style={a2_title}>
                Answer Text*</p>
            <p id="required2" className="required_fields"
               style={a2_required_warning}>{a2_status}</p>
            <textarea className="make_a_question_style_text_box" value={a2_text} onChange={answer2}
                      style={a2_textBox} name="field2"
                      placeholder="e.g. Insert some good description here." id = "new_question_problem"/>
            <p style={{display: "none"}}>{a2_text}</p>
            <p className="make_a_question_style_Question_body"
               style={a2_body}>
                Please answer the question comprehensively.</p>

            <p style={warning}>* Indicates Required Fields</p>

            {props.answer_editing ? (
                <>
                    <button
                        id="Post_Question"
                        type="button"
                        className="standard_button_blue"
                        style={post_answer_button}
                        onClick={post_answer}
                    >
                        Save Edit
                    </button>

                    <button
                        id="Delete_Question"
                        type="button"
                        className="standard_button_blue"
                        style={delete_answer_button}
                        onClick={remove_answer}
                    >
                        Delete Answer
                    </button>
                </>
                ) : (
                    <button
                        id="Post_Question"
                        type="button"
                        className="standard_button_blue"
                        style={post_answer_button}
                        onClick={post_answer}
                    >
                        Post Answer
                    </button>
                )}

        </div>
    );
}