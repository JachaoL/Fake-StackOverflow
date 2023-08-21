// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

let express = require('express');
const app = express();
let session = require('express-session')
let cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    // For simplicity the secret is hard-coded. Ideally should be read from environment variables.
    secret: "my-secret-key",
    cookie: {secure: false},
    resave: false,
    saveUninitialized: false
  })
)

let mongoose = require("mongoose");
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";

//the then is an attempt at making it automatically redirecting to /questions
const connectToMongo = () => {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
}

connectToMongo();
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", function () {
  console.log("Connected to database");
});

// Bind to the 'close' event
process.on('SIGINT', async () => {
  try{
    await mongoose.disconnect();
    console.log('\nServer closed. Database instance disconnected.');
    process.exit(0)
    
  }catch(error){
    console.error("ERROR OCCURED WHILE DISCONNECTING FROM DATABASE: " + error.message)
    process.exit(1)
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

let cors = require('cors');
app.use(express.json())


/********************************  NEW ************************************/

// Create a new MongoDBStore instance
/*const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/fake_so',
  collection: 'sessions'
});*/

//const secret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PUT"],
  credentials: true
}))

//app.use(bodyParser.urlencoded({extended: true}))

let bcrypt = require('bcrypt')

/********************************  NEW   ************************************/

let mySchema = require('./models/questions');
let Tags = require('./models/tags')
let Answers = require('./models/answers');
let Comments = require('./models/comments');
let users = require('./models/users');
const answers = require("./models/answers");
//const MyModel = mongoose.model('MyModel', mySchema);




app.get('/questions', async(req, res) => {

  //console.log("WE ARE INSIDE SERVER. THESE ARE OUR QUESTIONS: " + await mySchema.find({}))
  //console.log("AND THESE ARE OUT TAGS: " + await Tags.find({}))
  /*const [l1, l2] = await Promise.all([
    mySchema.find({}),
    Tags.find({})
  ]);
  res.json({l1, l2});*/
  //console.log("Userid: " + req.session.userId)
  await res.send(await mySchema.find())
})


  
app.get('/questions_sorted_newest', async (req, res) => {
  //console.log("WE ARE INSIDE NEWEST " + await mySchema.find({}))
  //console.log("AND THESE ARE OUT TAGS: " + await Tags.find({}))
  //console.log("Newest: THIS IS THE SESSION USER WE ARE: " + JSON.stringify(req.session))
  //console.log("Newest: THIS IS THE SESSION ID WE ARE USING " + req.sessionID)
  try {
      const questions = await mySchema.find({})
      .sort({ask_date_time: -1})
      .exec();
    //console.log(questions);
    res.send(questions);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/questions_sorted_active', async (req, res) => {
  try {
    const questions = await mySchema.find({})
      .populate('answers', 'ans_date_time')
      .exec();

    questions.sort((a, b) => {
      const aMaxAnsDate = a.answers.length > 0 ? Math.max(...a.answers.map(ans => ans.ans_date_time)) : null;
      const bMaxAnsDate = b.answers.length > 0 ? Math.max(...b.answers.map(ans => ans.ans_date_time)) : null;

      if (aMaxAnsDate === null) {
        return 1;
      } else if (bMaxAnsDate === null) {
        return -1;
      } else {
        return bMaxAnsDate - aMaxAnsDate;
      }
    });

    res.send(questions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.get('/questions_sorted_unanswered', async(req, res) => {
  try {
    const questions = await mySchema.find({answers: { $size: 0}}).exec();
    res.send(questions);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});



app.put('/questions/:id/views', async (req, res) => {
  const questionId = req.params.id;
  let oldViews;
  try {
    const question = await mySchema.findById(questionId);
    if (!question) {
      res.status(404).json({ error: `Question with ID ${questionId} not found.` });
      return;
    }
    oldViews = question.views;
    //console.log(`The views for question ${questionId} are: ${oldViews}`);
  } catch (error) {
    console.error("error looking at views ", error)
    res.status(500).json({error: 'An error occurred while looking at views count. '})
    return;
  }

  try {
    if(oldViews === null) {
      oldViews = 0;
      oldViews++;
    }
    else {
      oldViews++
    }
    await mySchema.findByIdAndUpdate(questionId, {views: oldViews});
    res.status(200).json({ message: `Views count of question with ID ${questionId} updated successfully. new views: ${oldViews}` })
  }
  catch(error) {
    console.error("error updating question: ", error)
    res.status(500).json({ error: 'An error occurred while updating the views count.' })
  }
});



app.get('/tags', async(req, res) => {
  res.send(await Tags.find({}))
})


app.get('/answers', async(req, res) => {
  res.send(await Answers.find().populate('comments').exec())
})

app.get('/comments', async(req, res) => {
  res.send(await Comments.find())
})

/*app.get('/new_question', async(req, res) => {
  res.send(await Tags.find({}))
})*/


app.get('/tag_names', async(req, res) =>{

  try {
    const tagIds = JSON.parse(req.query.tags);
    //console.log("HERE IS OUR INPUT: " + tagIds)
    const tag_names = await Tags.find({ _id: { $in: tagIds } });
    //console.log("THESE ARE THE TAGS FOUND: " + tag_names)
    res.json(tag_names);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})


app.get('/tags_count', async(req,res) => {
  try{
    const tag_sums_cursor = mySchema.aggregate([
      {$unwind:"$tags"},
      {$group:{_id:"$tags", count:{$sum:1}}}
    ]);
    const tag_sums = await tag_sums_cursor.exec();

    //await mySchema.populate(tag_sums, { path: "tags", select: "name" });
    //some type of populate


    const tags = await Tags.find({});

    tag_sums.forEach(tagSum => {
      const tag = tags.find(tag => tag._id.toString() === tagSum._id.toString());
      if (tag) {
        //console.log("THIS IS THE NAME: " + tag.name)
        tagSum.name = tag.name;
      }
    });
    
    

    res.send(tag_sums)
  }catch(error){
    console.error(error)
    res.status(500).send('Server Error')
  }
})
app.get('/question/comments/:id', async(req, res) => {
  console.log("i get comment with question id")
  const id = req.params.id;
  try {
    const question = await mySchema.findById(id).populate('comments').exec();
    res.send(question.comments);
  }
  catch(err)
  {
    console.error(err)
    res.status(500).send("Server Error")
  }
})
app.get('/answer/comments/:id', async(req, res) => {
  console.log('i get to comment with answer id')
  const id = req.params.id;
  try {
    const answer = await Answers.findById(id).populate('comments').exec();
    res.send(answer.comments)
  }
  catch(err) {
    console.error(err);
    res.status(500).send("Server Error")
  }
})

app.get('/answer_list/:id', async(req, res) => {

  const id = req.params.id;
  try {
    const question = await mySchema.findById(id)
      .populate('answers')
      .exec();
    let answer;
    let answersComments = [];
      for(let i = 0; i < question.answers.length; i++) {
        console.log(question.answers[i].id)
        answer = await Answers.findById(question.answers[i].id).populate('comments').exec()
        answersComments.push(answer.comments)
    }

    const answers = question.answers
    

    // Sort answers based on a specific answer ID
    const optional = req.query.normalParam
    //need to make sure optional is not undefined
    if(optional && (optional.id || optional.id == "")){
      const specificUserId = optional.id;
      if(optional.id == ""){

        console.log("THIS IS ANSWER LIST OUR SESSION IS: " + req.session.userId)
        specificUserId = req.session.userId
      }

      const user = await users.findById(specificUserId);
      let answer_list = user.answers_posted;
      
      answers.sort((a, b) => {
        if (answer_list.includes(a._id.toString()) && !answer_list.includes(b._id.toString())) {
          return -1; // a comes before b
        } else if (!answer_list.includes(a._id.toString()) && answer_list.includes(b._id.toString())) {
          return 1; // b comes before a
        } else {
          return 0; // maintain the original order
        }
      });

    }


    //console.log(question.answers);
    res.json({answer_list: answers, answersComments: answersComments});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get('/get_question/:id', async (req, res) => {
  const id = req.params.id;
  mySchema.findById(id)
    .populate('tags', 'name') // Specify the field to populate ('name' in this case)
    .then(document => {
      if (!document) {
        res.status(404).send('Document not found');
        return;
      }
      res.send(document);
    })
    .catch(err => {
      console.log('Error while finding document:', err);
      res.status(500).send('Error while finding document');
    });
});


app.get('/get_answer/:id', async (req, res) =>{
  
  const id = req.params.id
  Answers.findById(id)
    .then(document => {
      if (!document) {
        res.status(404).send('Document not found');
        return;
      }
      res.send(document);
    })
    .catch(err => {
      console.log('Error while finding document:', err);
      res.status(500).send('Error while finding document');
    });
});


app.get('/get_user', async (req,res) => {
  await users.findById(req.session.userId)
    .then(user => {
      if (!user) {
        // User not found
        return res.status(404).json({ error: 'User not found' });
      }

      //console.log(user)
      // User found, return it as the response
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
})


app.post('/new_question', async (req, res) => {
  let title = req.body.title;
  let text = req.body.text;
  let tags = req.body.tags;

  /************* *****************************************************************************************/
  let user = await users.findById(req.session.userId);
  let asked_by = user.name
  //console.log("We are adding a new question, this is the session: ", req.session.userId);
  //console.log("THIS IS THE NAME: ", asked_by)

  //console.log("THIS IS RIGHT BEFORE SERVER TAG PRINTING")
  /*for(let i =0 ; i< tags.length; i++){
    console.log("This is what our server gets for tags: "  + tags[i])
  }*/

  //let totalTags = await Tags.find();

  let tags_to_add = [];
  let made_tags = []

  for (let i = 0; i < tags.length; i++) {
    try {
      const temp_tag = await Tags.findOne({ name: tags[i] });
      if (temp_tag === null) {
        //console.log("A NEW TAG WAS FOUND AS WE WERE ADDING OUR QUESTION: " + tags[i]);
        const tag = new Tags({
          name: tags[i]
        });
        tags_to_add.push(tag);
        await tag.save();
        made_tags.push(tag)
        //console.log('Created a new tag: ', result);
      } else {
        tags_to_add.push(temp_tag);
        //await temp_tag.save();
      }
    } catch (err) {
      console.error('Failed to save tag: ', err);
      res.status(500).send('Failed to save tag');
    }
    
  }


  try {
    
    /******************************* NEW ADDITION *******************/
    users.findById(req.session.userId)
    .then(async foundItem => {
      if (!foundItem) {
      // Handle the case where the item is not found
        console.log('Item not found.');
      } else {
        // Access the reputation field of the found item and assign it to a variable
        const reputationValue = foundItem.reputation;
        if(reputationValue < 50 && made_tags && foundItem.access_level === 0){
          res.status(418).json({error: "Reputation is less than 50, cannot make tag!"});
        }
      }
    }).catch(error => {
      console.error('Error finding item:', error);
    })
    
    let question = new mySchema({
      title: title,
      text: text,
      tags: tags_to_add,
      asked_by: asked_by
    });

    const result = await question.save().then(async (saved_question) => {
      // Add tags that were created to profile
      made_tags.map(async tag => {
        await users.findByIdAndUpdate(
          req.session.userId,
          { $push: { tags_posted: tag } }
       );
      })

      // Add questions that were created to profile
      await users.findByIdAndUpdate(
        req.session.userId,
        { $push: { questions_posted: saved_question._id } }
      );

  });

    

    /*********************** END NEW ADDITIONS *******************/
    res.send('created new question' + result);
  } catch (err) {
    res.send('failed to save' + err);
  }
  
});


app.post('/new_answer', async (req, res) => {
  try {
    const text = req.body.text;
    let user = await users.findById(req.session.userId);
    let ans_by = user.name
    const for_question = req.body.for_question;
    
    const answer = new Answers({
      text: text,
      ans_by: ans_by,
      question_id: for_question
    });

    // Save answer to the database
    const savedAnswer = await answer.save();

    // Add answer to the question
    await mySchema.findByIdAndUpdate(
      for_question,
      { $push: { answers: savedAnswer._id } },
      { new: true }
    );
/******************************* NEW ADDITION *******************/
    // Add questions that were created to profile
    await users.findByIdAndUpdate(
      req.session.userId,
      { $push: { answers_posted: savedAnswer._id } }
    );
/*********************** END NEW ADDITIONS *******************/
    res.send(`Created a new answer: ${savedAnswer}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save answer');
  }
});


/******************************* START NEW FINAL PROJECT ADDITIONS *********************************/

async function commentCreate(text, comment_by, comment_date_time) {
  let commentDetail = {text: text};
  if(comment_by != false) commentDetail.comment_by = comment_by;
  if(comment_date_time != false) commentDetail.comment_date_time = comment_date_time;
  let comment = new Comment(commentDetail);
  return comment.save();
}


//pass in name as "name"
//send email as "email" 
//raw password as "password"
//******************* ADD EMAIL CHECK ***************************
app.post('/add_user', async (req, res) => {
  try {
    const instance = await users.findOne({ email: req.body.email });

    if (instance) {
      return res.status(400).json({ message: 'A user with the same email already exists.' });
    }

    if(((req.body.email).match(/\./g) || []).length != 1 || ((req.body.email).match(/@/g) || []).length != 1){
      return res.status(500).json({error: "This is not an email!"})
    }

    if(req.body.email.indexOf('@')+1 >= req.body.email.indexOf('.')){

      return res.status(500).json({error: "This is not an email!"})
    }

    if (req.body.password.includes(req.body.email.split('@')[0].trim())) {
      return res.status(500).json({ error: 'Password contains email id or the @ is the first character (not an email)' });
    }

    if (req.body.password.includes(req.body.name)) {
      return res.status(500).json({ error: 'Password contains username' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const result = await newUser.save();

    await users.updateMany(
      { access_level: { $gt: 0 } },
      { $push: { registered_users: newUser._id } }
    );

    console.log('Added user for admin users with access_level 1+:', result);

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error occurred while processing the request:', error);
    res.status(500).json({ message: 'An error occurred while processing the request' });
  }
});

//send id of user to be deleted as "id"
app.post('/delete_user', async (req, res) => {

  users.updateMany({ access_level: {$gt: 0}}, 
                    {$pull: {registered_users: req.body.id}})
      .then(result => {
          console.log('Removed the user from registered_users for admin users with access_level 1+:', result);
      }).catch(error => {
          console.error('Error removing the specific ID:', error);
        });
  

  users.findByIdAndDelete(req.body.id).then(deleted_user => {
      if (!deleted_user) {
        console.log('No user found with the specified ID.');
      } else {
        console.log('User deleted:', deleted_user);
      }
    })
    .catch(error => {
      console.error('Error deleting User:', error);
    });
})


//pass in email as "username" and password as "password" to req
// Login endpoint
app.post('/login', async (req, res) => {
  const {email, password } = req.body;

  // Find the user by username
  const user = await users.findOne({email: email});
  if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare the entered password with the stored hashed password
  bcrypt.compare(password, user.password, async(err, passwordsMatch) => {
      if (passwordsMatch) {
          // Passwords match, user is authenticated
          
          // Create a session and store user ID in session
          
          
          req.session.userId = user._id;

          //console.log("THIS IS THE USER ID WE ARE USING " + user._id)

          await req.session.save()

          //console.log("THIS IS THE SESSION  " + JSON.stringify(req.session))
          console.log("THIS IS THE SESSION ID OF THIS LOGIN " + req.session.userId)
            return res.status(200).json({ message: 'Login successful' });
          
          
      } else {
          // Passwords don't match
          return res.status(401).json({ error: 'Invalid credentials' });
      }
  });
});


app.post('/logout', (req, res) => {
    
  console.log("LOGOUT HAS RAN IF THIS IS AN ERROR TAKE NOTE.")
  // Destroy the session
  req.session.destroy(err => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
    
      // Session destroyed successfully
      return res.status(200).json({ message: 'Logout successful' });
  });
});




//pass in the id of the user who posted comment upvoted as "id"
//pass in the question id as "qid"
//also send param for if it is comment called "isComment"
app.post('/user_upvoted', async (req, res) => {



  user_model.findById(req.session.userId)
  .then(foundItem => {
      if (!foundItem) {
      // Handle the case where the item is not found
          console.log('Item not found.');
      } else {
          // Access the reputation field of the found item and assign it to a variable
          const reputationValue = foundItem.reputation;
          const authority = foundItem.access_level;
          
          if(reputationValue >= 50 || req.params.isComment || authority > 0){
              users.findOneAndUpdate(
                  { _id: req.params.id },
                  { $inc: { reputation: 5 } },
                  { new: true }
                )
                .then(updatedUser => {
                  if (!updatedUser) {
                    // Handle the case where the user is not found
                    console.log('User not found.');
                  } else {
                    // The reputation field in the user document has been increased
                    console.log('Updated user:', updatedUser);
                  }
                })
                .catch(error => {
                  console.error('Error updating user:', error);
                });
          }else{
              res.status(418).json({error: "Reputation is less than 50, cannot vote!"});
          }
      }
  })
  .catch(error => {
      console.error('Error finding item:', error);
  })

  const updatedDocument = await mySchema.findOneAndUpdate(
    { _id: req.params.qid },
    { $inc: { votes: 1 } },
    { new: true }
  )

  console.log('Updated Question: ', updatedDocument)
})


//same as upvote. See above
app.post('/user_downvoted', async (req, res) => {
  await user_model.findById(req.session.userId)
  .then(foundItem => {
      if (!foundItem) {
      // Handle the case where the item is not found
          console.log('Item not found.');
      } else {
          // Access the reputation field of the found item and assign it to a variable
          const reputationValue = foundItem.reputation;
          const authority = foundItem.access_level;
          
          if(reputationValue >= 50 || req.params.isComment || authority > 0){
              users.findOneAndUpdate(
                  { _id: req.params.id },
                  { $inc: { reputation: -10 } },
                  { new: true }
                )
                .then(updatedUser => {
                  if (!updatedUser) {
                    // Handle the case where the user is not found
                    console.log('User not found.');
                  } else {
                    // The reputation field in the user document has been increased
                    console.log('Updated user:', updatedUser);
                  }
                })
                .catch(error => {
                  console.error('Error updating user:', error);
                });
          }else{
              //I am a teapot
              res.status(418).json({error: "Reputation is less than 50, cannot vote!"});
          }
      }
  })
  .catch(error => {
      console.error('Error finding item:', error);
  })

  const updatedDocument = await mySchema.findOneAndUpdate(
    { _id: req.params.qid },
    { $inc: { votes: -1 } },
    { new: true }
  )

  //console.log('Updated Question: ', updatedDocument)

})


//send in the id of the user profile if not self as "id"
app.post('/user_profile', (req, res) => {
  let id = req.body.id;
  console.log("This is id: ", id)
  if(!id){
    console.log("entered")
    console.log("Userid: " + req.session.userId)
    id = req.session.userId
  }
  //console.log("HERE!");
  
  /*users.find({_id: id}).then(() => {
    console.log("hello2")
  })*/
  users.findById(id).then(async (user) => {
    console.log(user);
    if (!user) {
        return res.status(404).json({ error: 'Object not found' });
    }

    //list of questions asked by user
    let questions = await mySchema.find({ _id: { $in: user.questions_posted} }).exec();
    //list of question with an answer by the user
    let answers = await mySchema.find({ answers: { $in: user.answers_posted } }).exec();
    //let answers = await Answers.find({ _id: { $in: user.answers_posted } }).populate({path: 'question_id',});
    //list of tags created
    let tags = await Tags.find({ _id: { $in: user.tags_posted } }).exec();

    //console.log("THESE ARE OUR QUESTIONS: ", questions)
    //console.log("THESE ARE OUR ANSWERS", answers)
    //console.log("THESE ARE OUR TAGS", tags)
    

    // We can directly use the result arrays instead of the query objects
    const values_to_render = {
        username: user.name,
        reputation: user.reputation,
        date: user.date_joined,
        questions: questions,
        answers: answers,
        tags: tags,
    };

    if (user.access_level > 0) {
        values_to_render.other_users = await users.find({ _id: {$in: user.registered_users}}).exec()
    }

    //console.log("THESE OUR THE OTHER USERS: ", values_to_render.other_users)

    res.json(values_to_render);
});
})



app.post('/delete_question', async (req, res) => {
  let id = req.body.id;

  let user = req.body.user
  if(!user){
    user = req.session.userId
  }

  try {
    // Remove it from the user profile
    await users.updateOne(
      { _id: user },
      { $pull: { questions_posted: id } }
    );
    console.log('Removed the question from the user profile.');

    // Remove comments
    const question = await mySchema.findById(id).populate('comments');
    const commentIds = question.comments.map((comment) => comment._id);

    await Comments.deleteMany({ _id: { $in: commentIds } });
    console.log('Removed associated comments.');

    // Remove answers
    await Answers.deleteMany({ question_id: id });
    console.log('Removed associated answers.');

    // Remove the question itself
    await mySchema.deleteOne({ _id: id });
    console.log('Question and associated data have been deleted successfully.');

    res.status(200).send('Question and associated data have been deleted successfully.');
  } catch (error) {
    console.error('Error deleting question and associated data:', error);
    res.status(500).send('An error occurred while deleting the question.');
  }
});



//pass in ans_id asn "ans_id"
app.post('/delete_answer', async (req, res) => {
  
  //no assertions are necessary quite simple similar to questions after comments are implemented
  //before it is implemented all you have to do is remove it from user schema, remove it from question answerid, then remove
  //      from answer schema. Nothing special

  let id = req.body.id;
  let qid = req.body.qid

  let user = req.body.user
  if(!user){
    user = req.session.userId
  }

  try {
    // Remove it from the user profile
    await users.updateOne(
      { _id: user },
      { $pull: { answers_posted: id } }
    );
    console.log('Removed the answer from the user profile.');

    await mySchema.updateOne(
      {_id: qid},
      {$pull: {answers: id}}
    )

    // Remove comments
    const ans = await Answers.findById(id).populate('comments');
    const commentIds = ans.comments.map((comment) => comment._id);

    await Comments.deleteMany({ _id: { $in: commentIds } });
    console.log('Removed associated comments.');

    res.status(200).send('Answer and associated data have been deleted successfully.');
  } catch (error) {
    console.error('Error deleting Answer and associated data:', error);
    res.status(500).send('An error occurred while deleting the answer.');
  }

})


//sned the tag id that is to be deleted as "id"
app.post('/delete_tag', async (req, res) => {
  // the idea is
  // we will search our questions schema mySchema for all tags associated with the id
  // we will then assert that only a single userid has been used for the questions
  // after that we can just delete all questions with the tag and then delete tag itself

  mySchema.aggregate([
    {
      $project: {
        count: {
          $size: {
            $filter: {
              input: '$tags',
              as: 'tag',
              cond: { $eq: ['$$tag', req.body.id] }
            }
          }
        }
      }
    }
  ]).exec((err, result) => {
    if (err) {
      console.error(err);
      // Handle the error appropriately
    } else {
      if (result.length > 1) {
        res.status(500).json({error: "Tag is being used by other users"})
      }
    }
  });

  users.updateOne({ _id: req.session.userId}, 
    {$pull: {tags_posted: req.body.id}})
    .then(result => {
        console.log('Removed the tag from user profile:', result);
    }).catch(error => {
        console.error('Error removing the specific tag ID:', error);
    });


    mySchema.updateMany(
      { tags: req.body.id },
      { $pull: { tags: req.body.id } }
    )
      .then(() => {
        console.log('Tag removed from all questions successfully.');
      })
      .catch((error) => {
        console.error('Error removing tag from questions:', error);
      });
})


//pass in edited tag as "edit", and pass in tagid as "id"
app.post('/edit_tag', async (req, res) => {
  //same assertion as above

  //except go into the tag and change name field

  mySchema.aggregate([
    {
      $project: {
        count: {
          $size: {
            $filter: {
              input: '$tags',
              as: 'tag',
              cond: { $eq: ['$$tag', req.body.id] }
            }
          }
        }
      }
    }
  ]).exec((err, result) => {
    if (err) {
      console.error(err);
      // Handle the error appropriately
    } else {
      if (result.length > 1) {
        res.status(500).json({error: "Tag is being used by other users"})
      }
    }
  });


  try {
    const updatedTag = await Tags.findOneAndUpdate(
        { _id: req.body.id },
        { $set: { name: req.body.edit } },
        { new: true }
    );

    console.log('Updated tag name:', updatedTag);
    res.status(200).send('Tag name updated successfully.');
} catch (error) {
    console.error('Error updating the tag name:', error);
    res.status(500).send('An error occurred while updating the tag name.');
}

})

app.post('/edit_answer', async (req, res) => {
  try {
    const id = req.body.id;
    const text = req.body.text;

    const updatedAnswer = await Answers.findByIdAndUpdate(id, { text: text }, { new: true });
    console.log('Updated answer:', updatedAnswer);
    res.status(200).send('Answer updated successfully.');
  } catch (err) {
    console.error(err);
    // Handle the error
  }
})


app.post('/edit_question', async (req, res) => {
  try {
    const tags = req.body.tags;
    const tags_to_add = [];
    const made_tags = [];

    for (let i = 0; i < tags.length; i++) {
      let temp_tag = await Tags.findOne({ name: tags[i] });
      if (temp_tag === null) {
        const tag = new Tags({
          name: tags[i]
        });
        tags_to_add.push(tag);
        await tag.save();
        made_tags.push(tag);
      } else {
        tags_to_add.push(temp_tag);
      }
    }

    const foundItem = await users.findById(req.session.userId);
    if (!foundItem) {
      console.log('Item not found.');
    } else {
      const reputationValue = foundItem.reputation;
      if (reputationValue < 50 && made_tags.length > 0 && foundItem.access_level === 0) {
        return res.status(418).json({ error: "Reputation is less than 50, cannot make tag!" });
      }
    }

    const updatedQuestion = await mySchema.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { title: req.body.title, text: req.body.text, tags: tags_to_add } },
      { new: true }
    );

    if (updatedQuestion) {
      for (let i = 0; i < made_tags.length; i++) {
        await users.findByIdAndUpdate(
          req.session.userId,
          { $push: { tags_posted: made_tags[i] } }
        );
      }
    } else {
      console.log('Question not found');
    }

    // Success message or further processing
    res.status(200).json({ message: "Question updated successfully." });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).send('Failed to update question');
  }
});


/******************************* END NEW FINAL PROJECT ADDITIONS *********************************/

