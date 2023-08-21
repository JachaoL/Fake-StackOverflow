// Tag Document Schema
const mongoose = require('mongoose')

var Schema = mongoose.Schema;
const tag_schema = new Schema({
    name: {type: String, required: true},
})

tag_schema.virtual('url').get(function(){
    return`/posts/tag/${this._id}`
})

module.exports = mongoose.model('Tags', tag_schema);