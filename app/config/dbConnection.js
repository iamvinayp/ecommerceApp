'use strict';

//importing/loading the mongoose module
var mongoose = require('mongoose');

//configuring the database

//defining the database path
var dbPath = 'mongodb://localhost/myecommerceapp';

//connect to the database
mongoose.connect(dbPath, { useMongoClient: true});

mongoose.connection.once('open', function(){
	console.log("Database connection established !!");
});