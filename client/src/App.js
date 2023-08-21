// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import WelcomePage from './components/welcomePage.js'
import FakeStackOverflow from './components/fakestackoverflow.js'
//import {sof_model} from'./models/model'
/*
* This is just a documentation for what is planned.
*
* We will have a single model (maybe it did not work quite amazing last time?)
* This time what I am thinking is we will pass a prop into questions_creator part of pipeline.
* The prop will be the arr in the exact order we want.
* ^ what this implies is that the sorting pipeline step has to come before questions
*
* The node js itself will be like
*
* A -> B -> C -> ... -> END
*
* You can start at any spot. But you will always follow that specific process to the end.
*
* For example say process A is the category button and process B is sorting button (newest/something i forgot)
* If the user was to press on the category button they will go through process A -> B -> ... -> END
* HOWEVER, if the user used process B they would skip process A and just do B -> END
*
* Maybe im overthinking this but the reason I thought to implement it this way was because there are different
* difficulties in changing:
* When we change categories (currently I think sorting is category)
* we have to always display a new set of questions/tags/whatever, however, changing sorting keeps category.
*
* We basically implemented this by making every item in our "pipeline" a prop and passing in a variable.
* We can skip a process by directly calling ones after it.
* ^ I do not believe that is something we have to worry about though. As long as we build our pipeline
* where each step has their own states it should just work.
* */

/*

        <FakeStackOverflow />
        <Begin_pipeline />
*/
function App() {


    //sof_model.sort_answers();
    //sof_model.sort_questions();

    //<Begin_pipeline />

  return (
    <section className="fakeso">
      <WelcomePage/>
      <FakeStackOverflow/>
      
    </section>
  );
}



export default App;