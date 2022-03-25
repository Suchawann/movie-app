// File: ./models/news.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
  img    : {type : String, required : true},
  title  : {type : String, required : true},
  desc   : {type : String, required : true},
  author : {type : String, required : true},
  date   : {type : String, required : true},
  time   : {type : String, required : true}
});

//Export function to create "NewsSchema" model class
module.exports = mongoose.model('News', NewsSchema );