// ORM MongoDB Connectivity
const mongoose = require('mongoose');

//Set up default mongoose connection
console.debug(process.env.MONGODBS_URI)
mongoose.connect(process.env.MONGODBS_URI, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));