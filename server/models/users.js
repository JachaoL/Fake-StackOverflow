//User Document Schema
const mongoose = require('mongoose')


var Schema = mongoose.Schema;

//only one guest will be created
const user_schema = new Schema({
    name: {type: String, required: true},
    access_level: {type: Number, required: false, default: 0}, //discriminator key
    email: {type: String, required: true},
    password: {type: String, required: true},
    date_joined: {type: Date, required: false,  default: Date.now()},
    reputation: {type: Number, required: false, default: 0},
    questions_posted: [{type: Schema.Types.ObjectId, ref: "Questions"}],
    answers_posted: [{type: Schema.Types.ObjectId, ref: "Answers"}],
    tags_posted: [{type: Schema.Types.ObjectId, ref: "Tags"}]
})

//extends user_schema
const admin_user_schema = new Schema({
    
    registered_users: [{type: Schema.Types.ObjectId, ref: "Users"}]
    }
)

user_schema.virtual('url').get(function(){
    return`/posts/users/${this._id}`
})

const user_model =  mongoose.model('Users', user_schema);
user_model.discriminator('Admins', admin_user_schema)

module.exports = user_model