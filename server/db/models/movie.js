var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  img    : String,
  title  : String,
  desc   : String,
  actor : String,
  time   : String
});

//Export function to create "NewsSchema" model class
module.exports = mongoose.model('Movie', MovieSchema );