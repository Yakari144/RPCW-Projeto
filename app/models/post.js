//Import the mongoose module
var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    IdProcesso: String,
    TituloProcesso: String,
    username: String,
    dateCreated: String
},{versionKey: false })

module.exports = mongoose.model('post',postSchema)
