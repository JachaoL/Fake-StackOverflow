import {useEffect, useState} from "react"
//import {sof_model} from '../models/model'
//import Next_step from './pipelineStep4_sorting'
import Next_step from './pipelineStep5_title'
import axios from 'axios'




export default function Create_list(props) {

    //console.log("THIS IS THE STEP 4 WE SHOULD ENTER")
    //console.log("THIS IS THE LIST WE CURRENTLY HAVE: " + props.list)
    
    const [my_props, set_props] = useState({
        //list: sof_model.get_all_qstns(),
        
        list: props.list,
        type: props.type,
        callback: props.callback,
        tag: props.tag
    });




    //let questions = []

/*

new Promise((resolve, reject) => {
                axios.get('http://localhost:8000/questions')
                  .then((response) => {
                    questions = response.data
                    console.log("Get request in lista has been completed.");
                    resolve(response.data);
                  })
                  .catch((error) => {
                    console.error(error);
                    reject(error);
                  });
              });
*/
useEffect(() => {
}, [props.p_state]);

useEffect(() => {
  new Promise((resolve, reject) => {
    axios
      .get('http://localhost:8000/tags')
      .then((result_for_tags) => {
        //console.log('Get request in lista has been completed.');
        //const questions = response.data;
        console.log("THIS IS RIGHT BEFORE QUESTIONS ASSIGNMENT!")
        const questions = props.list
        console.log("THIS IS QUESTIONS: " + questions)
        let searchList = [];
        if (props.type !== "questions_page" && props.filter) {

            console.log("entered searching?????!!!")
            var txtInput = props.filter.toUpperCase();

            var searchArray = [];
            var regexp = "/s+";
            searchArray = txtInput.replaceAll("[", " [").replaceAll("]", "] ")
                .replaceAll(/\s\s+/g, ' ').trim().split(" ");

            for(let kj = 0; kj < searchArray.length; kj++){
                console.log("This is what search array has: " + searchArray[kj])
            }

            
            for (let j = 0; j < searchArray.length; j++) {
                var tag_id;
                let tag_list = result_for_tags.data;

                 //if the filter has a bracket, that means its a tag
                if (searchArray[j].indexOf("[") == 0 && searchArray[j].indexOf("]") == searchArray[j].length-1){
                    for (let z = 0; z < tag_list.length; z++){
                        if(tag_list[z]['name'].toUpperCase() === searchArray[j].toUpperCase().replace("[", "")
                        .replace("]", "").trim()){
                            tag_id = tag_list[z]["_id"];
                            break;
                        }
                    }
                    //console.log("THIS IS THE TAGID: " + tag_id)
                }


                for (let i = 0; i < questions.length; i++) {
                    var a = questions[i];
                    console.log(a)
                    var title = a["title"]; 
                    console.log("This is the supposed title: " + a["title"])
                    var txt = a["text"];
                    if (searchArray[j].indexOf("[") == 0 && searchArray[j].indexOf("]") == searchArray[j].length-1) //if the filter has a bracket, that means its a tag
                    {
                        
                        if(questions[i]['tags'].includes(tag_id) && !searchList.includes(questions[i])){
                            searchList.push(a);
                        }
                        

                        /*var b = a["tagIds"];  // the list of tag id's for the current question
                        for (let k = 0; k < tags.length; k++) {
                            //search through the tags of the question for the right filter
                            var c = tags[k];
                            var name = c["name"];
                            name = name.toUpperCase()
                            let filterer = searchArray[j].toUpperCase().replace("[", "")
                                .replace("]", "").trim();
                            filterer = filterer;
                            var id = c["tid"];
                            if (name === filterer && b.includes(id) && !searchList.includes(a)) {
                                searchList.push(a);
                                break;
                            }
                        }*/
                    } else { //if it doesn't have a bracket
                        let filterer = searchArray[j]; // the input
                        filterer = " " + filterer.toUpperCase() + " ";
                        let titler = " " + title.replace(/[.,/#!$^*;:{}=\-~()]/g,"") + " ";
                        titler = titler.toUpperCase();
                        let txter = " " + txt + " ";
                        txter = txter.toUpperCase();
                        let match = false;
                        regexp = /[a-zA-Z]/;
                        while (match === false && titler.indexOf(filterer) != -1) {
                            let index = titler.indexOf(filterer);
                            let firstChar = titler.charAt(index);
                            let secondChar = titler.charAt(index + filterer.length - 1);

                            if (regexp.test(firstChar) === false) {
                                if (regexp.test(secondChar) === false) {
                                    match = true;
                                    if (!searchList.includes(a)) {
                                        searchList.push(a);
                                    }
                                    break;
                                }
                            }
                            titler = titler.substring(index + filterer.length + 1);
                        }
                        while (match === false && txter.indexOf(filterer) != -1) {
                            let index = txter.indexOf(filterer);
                            let firstChar = txter.charAt(index);
                            let secondChar = txter.charAt(index + filterer.length - 1);

                            if (regexp.test(firstChar) === false) {
                                if (regexp.test(secondChar) === false) {
                                    match = true;
                                    if (!searchList.includes(a)) {
                                        searchList.push(a);
                                    }
                                    break;
                                }
                            }
                            txter = txter.substring(index + filterer.length + 1);
                        }
                    }
                }
            }
            set_props({
                list: searchList,
                type: props.type,
                callback: props.callback,
                p_state: props.p_state,
                tag: props.tag
            })
        } else {
            console.log("WE ARE IN THE ELSE FLOW")
          if (props.filter === '' && props.type !== 'questions_page') {
            console.log("Entering set props with a complete list")
                set_props({
                    list: searchList,
                    type: props.type,
                    callback: props.callback,
                    p_state: props.p_state,
                    tag: props.tag
                })
          } else {
            console.log("THIS SHOULD BE THE FULL LIST!")
            set_props({
              list: props.list,
              type: props.type,
              callback: props.callback,
              p_state: props.p_state,
              tag: props.tag,
            });
          }
        }
        resolve(result_for_tags.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}, [props.s_state]);




    /*useEffect(() => {

        

            
        

    


        console.log("THIS IS OUR LIST AFTER ASSIGNMENT: ", questions)

        //console.log("THIS IS OUR LIST AFTER ASSIGNMENT: " + questions)
        
        let searchList = [];
        if (props.type !== "props.type" && props.filter) {
            var txtInput = props.filter.toUpperCase();

            var searchArray = [];
            var regexp = "/s+";
            searchArray = txtInput.replaceAll("[", " [").replaceAll("]", "] ")
                .replaceAll(/\s\s+/g, ' ').trim().split(" ");

            for(let kj = 0; kj < searchArray.length; kj++){
                console.log("This is what search array has: " + searchArray[kj])
            }

            for (let i = 0; i < questions.length; i++) {
                var a = questions[i];
                console.log(a)
                var title = a["title"]; 
                console.log("This is the supposed title: " + a["title"])
                var txt = a["text"];
                for (let j = 0; j < searchArray.length; j++) {
                    if (searchArray[j].indexOf("[") == 0 && searchArray[j].indexOf("]") == searchArray[j].length-1) //if the filter has a bracket, that means its a tag
                    {
                        var b = a["tags"];  // the list of tag id's for the current question
                        for (let k = 0; k < b.length; k++) {
                            //search through the tags of the question for the right filter
                            var c = b[k];
                            var name = c["name"];
                            name = name.toUpperCase()
                            let filterer = searchArray[j].toUpperCase().replace("[", "")
                                .replace("]", "").trim();
                            //var id = c["tid"];
                            //if (name === filterer && b.includes(id) && !searchList.includes(a)) {
                            if (name === filterer && !searchList.includes(a)) {
                                searchList.push(a);
                                break;
                            }
                        }
                    } else { //if it doesn't have a bracket
                        let filterer = searchArray[j]; // the input
                        filterer = " " + filterer.toUpperCase() + " ";
                        let titler = " " + title.replace(/[.,/#!$^*;:{}=\-~()]/g,"") + " ";
                        titler = titler.toUpperCase();
                        let txter = " " + txt + " ";
                        txter = txter.toUpperCase();
                        let match = false;
                        regexp = /[a-zA-Z]/;
                        while (match === false && titler.indexOf(filterer) != -1) {
                            let index = titler.indexOf(filterer);
                            let firstChar = titler.charAt(index);
                            let secondChar = titler.charAt(index + filterer.length - 1);

                            if (regexp.test(firstChar) === false) {
                                if (regexp.test(secondChar) === false) {
                                    match = true;
                                    if (!searchList.includes(a)) {
                                        searchList.push(a);
                                    }
                                    break;
                                }
                            }
                            titler = titler.substring(index + filterer.length + 1);
                        }
                        while (match === false && txter.indexOf(filterer) != -1) {
                            let index = txter.indexOf(filterer);
                            let firstChar = txter.charAt(index);
                            let secondChar = txter.charAt(index + filterer.length - 1);

                            if (regexp.test(firstChar) === false) {
                                if (regexp.test(secondChar) === false) {
                                    match = true;
                                    if (!searchList.includes(a)) {
                                        searchList.push(a);
                                    }
                                    break;
                                }
                            }
                            txter = txter.substring(index + filterer.length + 1);
                        }
                    }
                }
            }
            set_props({
                list: searchList,
                type: props.type,
                callback: props.callback,
                p_state: props.p_state,
                tag: props.tag
            })
        }else{
            if(props.filter === "" && props.type !== "questions_page") {
                console.log("Entering set props with a complete list")
                set_props({
                    list: searchList,
                    type: props.type,
                    callback: props.callback,
                    p_state: props.p_state,
                    tag: props.tag
                })
            }
            else {

                set_props({
                    //list: sof_model.get_all_qstns(),
                    list: questions,
                    type: props.type,
                    callback: props.callback,
                    p_state: props.p_state,
                    tag: props.tag
                })
            }
        }
        console.log("I EXECUTE WITH STATE_CHANGER")
    }, [props.filter, props.type, props.callback, props.p_state, props.tag]);*/



//<Next_step {...my_props} />
    //console.log("This is the list we are sending: " + my_props.list)
    return (
        <div>
            <Next_step questions_to_make={my_props.list} call_back={props.callback} type={props.type} tag={props.tag}/>
        </div>
    )

}