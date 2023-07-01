//Import the mongoose module
var mongoose = require('mongoose');

var comentarioSchema = new mongoose.Schema({
    idRef: String,
    content: String,
    username: String,
    dateCreated: String
},{versionKey: false })

module.exports = mongoose.model('comentario',comentarioSchema)
