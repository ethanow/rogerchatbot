// module model.js
var mongodb= require('mongodb');
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  fbID: String
})


var User = mongoose.model('User',UserSchema)