//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

const bcrypt = require('bcrypt')

let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let User = require('./models/users')

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let Comment = require('./models/comments')
let mongoose = require('mongoose');

const admin_model = mongoose.model('Admins');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


async function hashPassword(password) {
    const saltrounds = 10;
    let hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltrounds, function(err, hashed){
            if(err) {
                reject(err)
            }
            resolve(hashed)
        })
    })
    return hashedPassword
}
async function userCreate(name, email, password, access_level, questions_posted, answers_posted, tags_posted) {
    let newUser = new User({
        name: name,
        email: email,
        access_level: access_level,
        password: await hashPassword(password),
        questions_posted: questions_posted,
        answers_posted: answers_posted,
        tags_posted: tags_posted,
        
        
    })
    return newUser.save()
}

async function adminCreate(name, email, password, access_level, questions_posted, answers_posted, tags_posted, registered_users) {
    let newUser = new admin_model({
        name: name,
        email: email,
        access_level: access_level,
        password: await hashPassword(password),
        questions_posted: questions_posted,
        answers_posted: answers_posted,
        tags_posted: tags_posted,
        registered_users: registered_users
        
    })
    return newUser.save()
}
async function commentCreate(text, comment_by, comment_date_time) {
  let commentDetail = {text: text};
  if(comment_by != false) commentDetail.comment_by = comment_by;
  if(comment_date_time != false) commentDetail.comment_date_time = comment_date_time;
  let comment = new Comment(commentDetail);
  return comment.save();
}
function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, comments) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if(comments != false) answerdetail.comments = comments
  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views, comments) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if(comments != false) qstndetail.comments = comments;
  let qstn = new Question(qstndetail);
  return qstn.save();
}

const populate = async () => {
  let t1 = await tagCreate('react');
  let t2 = await tagCreate('javascript');
  let t3 = await tagCreate('android-studio');
  let t4 = await tagCreate('shared-preferences');

  let c1 = await commentCreate('hi this is the first comment','ape1', false)
  let c2 = await commentCreate('hi this is the second comment', 'ape2', false)
  let c3 = await commentCreate('hi this is the third comment','ape3', false)
  let c4 = await commentCreate('hi this is the fourth comment', 'ape4', false)
  let c5 = await commentCreate('hi this is the fifth comment','ape5', false)
  let c6 = await commentCreate('hi this is the sixth comment', 'ape6', false)
  let c7 = await commentCreate('hi this is the seventh comment', 'ape7', false)

  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'hamkalo', false, [c1]);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'azad', false, [c2]);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'abaya', false, [c3]);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'alia', false, [c4]);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'sana', false, [c5]);
  
  let q1 = await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], 'Joji John', false, false, [c6]);
  let q2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'saltyPeter', false, 121,[c7]);
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'saltyPeter', false, 121,[c7]);
  await questionCreate('android studio save string sasdgasdbsfbasfbsfbpp crashes.','I have 2 fragments isadgdsgsdgsdgi am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'asdgsg', false, 121,[c7]);
  await questionCreate('android studio save string shared sdgsdgdsbsdbload the saved string', 'I am using bottom navigation view but am usingasdgsdgsagfgsdgreated every time i switch to a diffeasfgsdgson selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'saltyPeter', false, 121,[c7]);
  await questionCreate('android studiasdgasdgnd load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'dgsdg', false, 121,[c7]);


  let u1 = await userCreate('user1', "user1@gmail.com", "user1pass", 0, [q1],[a3],[t1,t2]) 
  let u2 = await userCreate('user2', "user2@gmail.com", "user2pass", 0, [q2],[a1],[t3,t4,t2]) 
  let u3 = await userCreate('user3', "user3@gmail.com", "user3pass", 0, [],[a2,a4],[]) 
  await adminCreate('admin', "admin@gmail.com", "adminpass", 1, [],[a5],[], [u1,u2,u3])

  
  
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');
