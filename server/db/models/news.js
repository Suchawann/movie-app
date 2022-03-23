// File: ./models/news.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
  img    : String,
  title  : String,
  desc   : String,
  author : String,
  date   : String,
  time   : String
});

//Export function to create "NewsSchema" model class
module.exports = mongoose.model('News', NewsSchema );