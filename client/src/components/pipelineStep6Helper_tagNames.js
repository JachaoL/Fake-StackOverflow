//import {sof_model} from "../models/model";
import axios from 'axios'

export default function render_tags(question){
    //let all_tags = sof_model.get_all_tags();
    

    //let tag_ids = {tags: question['tags']}
    //console.log("THIS IS THE QUESTION GIVEN TO RENDER TAGS: " + question['tags'])
    var all_tags
    var tag_arr

    return new Promise((resolve, reject) => { 
    //WE HAVE TO GET LIST OF TAGS TO SEARCH INSIDE IT
        axios.get('http://localhost:8000/tag_names', {params: {tags: JSON.stringify(question['tags'])}})
            .then(response => {  

                //console.log("WE HAVE COMPLETED GET REQUEST, HERE ARE TAGS: " + response.data)
                all_tags = response.data;

                tag_arr = []
                for(let i = 0; i< 5; i++){
                //this will print tag ids
                //console.log("THIS IS INSIDE STEP6 HELPER: " + all_tags[i]['name'])

                if( i >= all_tags.length){
                    tag_arr.push("")
                }else{

                    //find tag we can do some other thing too, like do it on the server side (this then can just use find)
            
                    tag_arr.push('<span class="tag_text" style="font-size: 12px; color: #5091c0;">'+all_tags[i]['name'] +'</span>')
                }
                //console.log("added a tag")
            
            }
            
            resolve(tag_arr[0] + tag_arr[1] + tag_arr[2] + tag_arr[3] + tag_arr[4])
        }).catch((error) => {
            console.error(error);
            reject(error);
        });

        
    })
    

    //return tag_arr[0] + tag_arr[1] + tag_arr[2] + tag_arr[3] + tag_arr[4];
}

/*export default function render_tags(question) {
    let tag_ids = { tags: question["tags"] };
    var all_tags;
    var tag_arr;
  
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:8000/tag_names", tag_ids)
        .then((response) => {
          all_tags = response.data;
          tag_arr = [];
          for (let i = 0; i < 5; i++) {
            if (i >= all_tags.length) {
              tag_arr.push("");
            } else {
              tag_arr.push(
                '<span class="tag_text" style="font-size: 12px; color: #5091c0;">' +
                  all_tags[i]["name"] +
                  "</span>"
              );
            }
          }
          console.log("added tags");
          resolve(tag_arr[0] + tag_arr[1] + tag_arr[2] + tag_arr[3] + tag_arr[4]);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }*/
  