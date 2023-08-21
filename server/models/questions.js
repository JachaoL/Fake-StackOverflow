// Question Document Schema
const mongoose = require('mongoose')


var Schema = mongoose.Schema;

const question_schema = new Schema({
    title: {type: String, required: true, maxLength: 100}, 
    text: {type: String, required: true},
    tags: [{type: Schema.Types.ObjectId, ref: "Tags"}],
    answers: [{type: Schema.Types.ObjectId, ref: "Answers"}],
    asked_by: {type: String, required: false, default: "Anonymous"},
    ask_date_time: {type: Date, required: false, default: Date.now},
    views: {type: Number, required: false, default: 0},
    votes: {type: Number, required: false, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: "Comments"}]

})

question_schema.virtual('url').get(function(){
    return`/posts/question/${this._id}`
})

module.exports = mongoose.model('Questions', question_schema);