//FOR AXIOS http://localhost:8000 WAS REMOVED IN GET AND POST IF IT DOESNT WORK THAT IS WHY


import {useState, useEffect} from 'react';
//import {sof_model} from "../models/model";
import axios from 'axios'
export default function Question_creator(props){
    //let allTags = [];
    
    /*axios.get('http://localhost:8000/new_question').then(res => {
        allTags = res.data;
    })*/
    //for text
    
    const [q1_text, change_q1_text] = useState("")
    const [q2_text, change_q2_text] = useState("")
    const [q3_text, change_q3_text] = useState("")


    //0 doesnt display errors. 1 displays errors.
    const [q1_status, change_q1_status] = useState("")
    const [q2_status, change_q2_status] = useState("")
    const [q3_status, change_q3_status] = useState("")
    const [r_status, change_r_status] = useState("")


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
    const box1 = {position: 'absolute',
        width: '670px',
        height: '110px',
        left: '50%',
        top: '200px',
        transform: 'translateX(-310px)'
    }
    const box2 = {position: 'absolute',
        width: '670px',
        height: '280px',
        left: '50%',
        top: '325px',
        transform: 'translateX(-310px)'
    }
    const box3 = {position: 'absolute',
        width: '670px',
        height: '110px',
        left: '50%',
        top: '620px',
        transform: 'translateX(-310px)'
    }


    const q1_title = {
        top: '203px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q1_body = {
        top: '228px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q1_textBox = {
        height: '30px',
        top: '260px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q1_required_warning = {
        top: '283px',
        left: '50%',
        transform: 'translateX(-290px)'
    }

    const q2_title = {
        top: '328px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q2_body = {
        top: '355px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q2_textBox = {
        height: '200px',
        top: '385px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q2_required_warning = {
        top: '578px',
        left: '50%',
        transform: 'translateX(-290px)'
    }

    const q3_title = {
        top: '620px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q3_body = {
        top: '647px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q3_textBox = {
        height: '30px',
        top: '677px',
        left: '50%',
        transform: 'translateX(-290px)'
    }
    const q3_required_warning = {
        top: '700px',
        left: '50%',
        transform: 'translateX(-290px)'
    }


    const warning = {
        color: 'red',
        fontSize: '12px',
        zIndex: '2005',
        position: 'absolute',
        top: '782px',
        left: '50%',
        transform: 'translateX(230px)'
    }

    const r_warning = {
        color: 'red',
        fontSize: '12px',
        zIndex: '2005',
        position: 'absolute',
        top: '775px',
        left: '50%',
        transform: 'translateX(-230px)'
    }

    const post_question_button = {
        top: '795px',
        left: '50%',
        transform: 'translateX(-310px)'
    }

    const remove_question_button = {
        top: '795px',
        left: '50%',
        transform: 'translateX(-180px)'
    }

    const answer1 = (event) => {
        change_q1_text(event.target.value)
    }

    const answer2 = (event) => {
        change_q2_text(event.target.value)
    }

    const answer3 = (event) => {
        change_q3_text(event.target.value)
    }



    function remove_question(){

        let question = {id: props.id, user: props.this_user}
        console.log("Hello!")

        axios.post('http://localhost:8000/delete_question', question, { withCredentials: true })
            .then(res => {
                console.log("WE ARE INSIDE OUR POST REQUEST");
                console.log(res.data);
                console.log("After Answer Post")
                props.callback()
            }).catch(err => console.log("THIS IS THE ERROR ON WHY WE SKIPPED MIDDLE: " + err))

    }


    //Add link errors.
    function post_question(){

        let q1 = q1_text.trim()
        let q2 = q2_text.trim()
        let q3 = q3_text.trim()


        let q1_errors = ""
        let q2_errors = ""
        let q3_errors = ""
        // trying to hyperlink

        if(q1.length > 50){
            q1_errors += "Question title exceeded maximum length. " + q1.length + " is greater than 50!\t"
        }else if(q1 === ""){
            q1_errors += "Question title is required.\t"
        }

        if(q2.length > 140){
            q2_errors += "Question text exceeded maximum length. " + q1.length + " is greater than 140!\t"
        }if(q2 === ""){
            q2_errors += "Problem description is required.\t"
        }
        let hyperlinkPattern = /\[(.*?)\]\((https?:\/\/\S+)\)/g;
        let hyperlinkPattern2 = /\[(.*?)\]\((.*?)\)/g;
        let hyperlinks = q2.match(hyperlinkPattern);
        let hyperlinks2 = q2.match(hyperlinkPattern2);
        if(hyperlinks) {

            hyperlinks.forEach(hyperlink => {
                let link = hyperlink.substring(hyperlink.indexOf("](")+2);
                if (!link.startsWith("http://") && !link.startsWith("https://")) {
                    q2_errors += "Invalid hyperlink. Please make sure the link starts with http:// or https:// \t"
                }
            })

        }
        else if(hyperlinks2){
            q2_errors += "Invalid hyperlink. Please make sure the link is valid. \t"
        }


        let words = q3.split(" ")
        if(words.length === 1 && words[0] === ""){
            q3_errors += "At least one tag is required.\t";
        } else if(words.length >5){
            q3_errors += "The maximum tags number has been exceeded. " + words.length + " is greater than 5!\t"
        }else {
            let places = [];
            for (let i = 0; i < words.length; i++) {
                if (words[i].length > 10) {
                    places.push(i);
                }
            }
            if(places.length > 0){
                q3_errors += places[places.length-1] + " have exceeded the maximum length for a tag (10).\t"
            }
        }



        if(q1_errors || q2_errors || q3_errors){
            change_q1_status(q1_errors)
            change_q2_status(q2_errors)
            change_q3_status(q3_errors)
            return;
        }

        change_q1_status("");
        change_q2_status("")
        change_q3_status("")
        change_r_status("")

        let title = q1
        let text = q2
        let returned_tags = q3.toLowerCase().split(" ")
        



        //let date = Date.now();
        console.log("THIS IS RIGHT BEFORE CLIENT TAG PRINTING")
        for(let i =0 ; i< returned_tags.length; i++){
            console.log("This is what our client gets for tags: "  + returned_tags[i])
          }

        //sof_model.add_question(title,text,tags,askedBy,date)
        console.log("Before Answer Post")
        let newQuestion = {title: title, text: text, tags: returned_tags, id: props.id}

        if(props.id){
            axios.post('http://localhost:8000/edit_question', newQuestion, { withCredentials: true })
            .then(res => {
                console.log("WE ARE INSIDE OUR POST REQUEST");
                console.log(res.data);
                console.log("After Answer Post")
                props.callback()
            }).catch(err => {
                change_r_status(err.response.data.error)
            })
        }else{

            axios.post('http://localhost:8000/new_question', newQuestion, { withCredentials: true })
                .then(res => {
                    console.log("WE ARE INSIDE OUR POST REQUEST");
                    console.log(res.data);
                    console.log("After Answer Post")
                    props.callback()
                }).catch(err => change_r_status(err.response.data.error))
        }
    }

    
    useEffect(() => {
        if(props.id){
            axios.get(`http://localhost:8000/get_question/${props.id}`, { withCredentials: true }).then(result =>{
                /*for( let z = 0; z< result.data.length; z++){
                    console.log("GET IN NEWEST IS ENTERED -- THIS IS RESULT: " + result.data[z]['title'])
                }*/
                change_q1_text(result.data.title)
                change_q2_text(result.data.text)
                      
                // Access the tag names and store them in a new array
                const tagNames = result.data.tags.map(tag => tag.name);
      

                change_q3_text(tagNames.join(" "))
    
            }).catch(error => {
                console.error(error)
            })
        }    
    }, [props.p_state]);
    

    //we will put all styling here do not want return to be too bloated.
    return(
        <div>
            <p style={title}>Ask a public question</p>

            <div className="make_a_question_style_box" id="make_a_question_box_1" style={box1}></div>
            <div className="make_a_question_style_box" id="make_a_question_box_2" style={box2}></div>
            <div className="make_a_question_style_box" id="make_a_question_box_3" style={box3}></div>


            <p className="make_a_question_style_Question_Title"
               style={q1_title}>
                Question Title*</p>
            <p className="make_a_question_style_Question_body"
               style={q1_body}>
                Be Specific and imagine you&apos;re asking a question to another person. Limit to 100 characters.</p>
            <input className="make_a_question_style_text_box" type="text" value={q1_text} onChange={answer1}
                   style={q1_textBox} name="field1"
                   placeholder="e.g. Insert some good question here." id = "new_question_title"/>
            <p style={{display: "none"}}>{q1_text}</p>
            <p id="required1" className="required_fields"
               style={q1_required_warning}>{q1_status}</p>


            <p className="make_a_question_style_Question_Title"
               style={q2_title}>
                What did you try and what were you expecting?*</p>
            <p id="required2" className="required_fields"
               style={q2_required_warning}>{q2_status}</p>
            <textarea className="make_a_question_style_text_box" value={q2_text} onChange={answer2}
                      style={q2_textBox} name="field2"
                      placeholder="e.g. Insert some good description here." id = "new_question_problem"/>
            <p style={{display: "none"}}>{q2_text}</p>
            <p className="make_a_question_style_Question_body"
               style={q2_body}>
                Introduce the problem and expand on what you put in the title.</p>



            <p className="make_a_question_style_Question_Title"
               style={q3_title}>Tags*</p>
            <p className="make_a_question_style_Question_body"
               style={q3_body}>
                Add up to 5 tags to describe what your question is about.</p>
            <input className="make_a_question_style_text_box" type="text" value={q3_text} onChange={answer3}
                   style={q3_textBox} name="field3"
                   placeholder="e.g. Some tags here." id = "new_question_tags"/>
            <p style={{display: "none"}}>{q3_text}</p>
            <p id="required3" className="required_fields"
               style={q3_required_warning}>{q3_status}</p>



            <p style={warning}>* Indicates Required Fields</p>

            {props.id ? (
                <>
                    <button
                        id="Post_Question"
                        type="button"
                        className="standard_button_blue"
                        style={post_question_button}
                        onClick={post_question}
                    >
                        Save Edit
                    </button>

                    <button
                        id="Delete_Question"
                        type="button"
                        className="standard_button_blue"
                        style={remove_question_button}
                        onClick={remove_question}
                    >
                        Delete post
                    </button>
                </>
                ) : (
                    <button
                        id="Post_Question"
                        type="button"
                        className="standard_button_blue"
                        style={post_question_button}
                        onClick={post_question}
                    >
                        Post Question
                    </button>
                )}

            <p id="required3" className="required_fields"
               style={r_warning}>{r_status}</p>
        </div>
    );
}