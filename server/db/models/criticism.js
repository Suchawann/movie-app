// File: ./models/criticism.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var CriticismSchema = new Schema({
  img    : {type : String, required : true},
  title  : {type : String, required : true},
  content   : {type : String, required : true},
  author : {type : String, required : true},
  publicationDate   : {type : String, required : true},
});

//Export function to create "CrticismSchema" model class
module.exports = mongoose.model('Criticism', CriticismSchema );