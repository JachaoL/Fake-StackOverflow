//import {sof_model} from "../models/model";
import axios from 'axios'
import {useEffect, useState} from 'react';
export default function tags(props){

    const [all_tags, set_tags] = useState([]);

    useEffect(() => {

        axios.get('http://localhost:8000/tags_count').then(response => {
            
            set_tags(response.data);
        
        }).catch(error => {
            console.error(error)
        })
    }, [])

    
    //let arr = sof_model.questionNumber();

    const gridContainer = {
        display: 'grid',
        gridTemplateColumns: "300px 300px 300px",
        height: "20px",
        width: "400px",
        position: "absolute",
        left: "50%",
        top: "100px",
        transform: "translateX(-100px)",
    }

    const allTags = {
        position: "absolute",
        left: "32%",
        top: "80px",
        fontSize: "30px",
        fontWeight: "700"
    }

    const tag_num1 = {
        position: "absolute",
        left: "20%",
        transform: 'translateX(60px)',
        top: "50px",
        fontSize: "20px",
        fontWeight: "normal"
    }

    const tag_num2 = {
        position: "absolute",
        left: "20%",
        top: "50px",
        fontSize: "20px",
        fontWeight: "normal"
    }

    const same_line = {
        display: "flex",
    }

    //console.log("this is the type of callback: " + typeof props.callback);

    return (
        <div style = {allTags}> Tags

            <div style={same_line}>
                <div style={tag_num1}>{all_tags.length}</div>
                <div style={tag_num2}>Shown</div>
            </div>

            <div style = {gridContainer}>
                {all_tags.map((item) => {

                    var glob_tag = item.name;

                    window.showQuestions = function(tag) {
                        console.log(tag)
                        props.callback({type: 1, filter: "["+tag+"]", tag: tag})
                    }

                    const html_string = `
                <div key = "THIS IS THE ITEM: ${item.name}" style = 'margin-bottom: 50px; margin-left: 70px; margin-right: 10px; margin-top: -5px; width: 255px; height: 130px; text-align: center;
                padding-top: 40px; font-size: 17px; border: #919191 dashed; font-weight: 400 '>
                <a onclick="showQuestions('${glob_tag}'); return false;" href="#" class="q_link">${item.name}</a>
                <br/><br/>
                ${item['count']== 1 ? "1 question" : item['count'] + " questions"}
                </div>`


                    return ( <div key={"Tag of tag: " + item.name + item._id} dangerouslySetInnerHTML={{__html: html_string}}></div>)

                })}
            </div>
        </div>
    )
}
