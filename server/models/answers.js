// Answer Document Schema
const mongoose = require('mongoose')

var Schema = mongoose.Schema;
const answer_schema = new Schema({
    text: {type: String, required: true},
    ans_by: {type: String, required: true},
    ans_date_time: {type: Date, required: false, default: Date.now},
    question_id: {type: Schema.Types.ObjectId, ref: "Questions"},
    views: {type: Number, required: false, default: 0},
    votes: {type: Number, required: false, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: "Comments"}]
})

answer_schema.virtual('url').get(function(){
    return`/posts/answer/${this._id}`
})

module.exports = mongoose.model('Answers', answer_schema);