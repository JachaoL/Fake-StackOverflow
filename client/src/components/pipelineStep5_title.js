import Next_step from './pipelineStep6_questions'
//not implemented
//displays the correct "title" ie: all questions, all tags, showing results
//also display question numbers and stuff (maybe)

//calls a builder whether it be question builder/tag builder, etc depending on the type it received

//REMEMBER TO PASS callback: props.callback
export default function Title(props) {

    const Header = {
        top: '66px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-400px)',
        fontSize: '27px'
    }

    const Header2 = {
        top: '120px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-400px)',
        fontWeight: "lighter",
        fontSize: "17px"
    }

    //console.log("this is the prop.type: " + props.type);

    let title = "";
    let size = props.questions_to_make.length;
    if(props.type === "questions_page") {
        title = "All Questions"
    }
    else if(props.type === "tags_page") {
        title = "All Tags"
    }
    else if(props.type === "search") {
        if(size > 0)
            title = "Search Results"
        else{
            title = "No Questions Found"
        }
    }
    else if(props.type === "tags_search") {
        console.log(props.tag);
        title = props.tag
    }

    //BLAH something for type 3

    // add for {props.type === 3 ?  :}
    return(
        <div>
            <h1 style = {Header}>
                {title}
            </h1>
            <h2 style = {Header2}>
                {size === 1 ? size + " question": size + " questions" }
            </h2>

            <Next_step {...props} />
        </div>
    );

}