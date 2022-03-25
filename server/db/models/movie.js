var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var MoviesSchema = new Schema({
  image    : String,
  title  : String,
  synopsis   : String,
  actor : String,
  min   : String
});

//Export function to create "NewsSchema" model class
module.exports = mongoose.model('Movie', MoviesSchema );