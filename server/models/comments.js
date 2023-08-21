// Comments Document Schema
const mongoose = require('mongoose')

var Schema = mongoose.Schema;
const comments_schema = new Schema({
    text: {type: String, required: true},
    comment_by: {type: String, required: true},
    comment_date_time: {type: Date, required: false, default: Date.now},
    votes: {type: Number, required: false, default: 0}
})

comments_schema.virtual('url').get(function(){
    return`/posts/comments/${this._id}`
})

module.exports = mongoose.model('Comments', comments_schema);