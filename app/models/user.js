//Import the mongoose module
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    filiacao: String,
    level: String,
    dateCreated: String,
    dateLastLogin: String
},{versionKey: false })

module.exports = mongoose.model('user',userSchema)
