'use strict';

//importing/loading the express module/package and other dependencies
var express = require('express');

//set up an express app instance
var app = express();

//initializing the port number
var port = process.env.PORT || 3000;

//requiring other necessary modules
var dbConnection = require('./app/config/dbConnection.js');
var ecomRoutes = require('./app/routes/ecomRoutes.js');

//loading required middlewares
//body parsing middleware
var bodyParser = require('body-parser');
//cookie parsing middleware
var cookieParser = require('cookie-parser');
//error handler middleware
var errorHandler = require('./app/middlewares/errorHandler.js');
//wrong route redirection middleware
var ecomWrongRoute = require('./app/middlewares/wrongRoute.js');

//body parsing middleware that only parses json/tells the system to use json.
app.use(bodyParser.json({limit: '10mb', extended: true}));

//body parsing middleware that only parses urlencoded bodies
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
//cookie parser
app.use(cookieParser());

//register the routes
app.use('/api', ecomRoutes);

//register/initialise middleware for redirection of wrong routes
app.use('*', ecomWrongRoute.checkRoute);

//register/initialise error handling middleware
app.use(errorHandler.handleError);

//server listening on port
app.listen(port, function () {
	console.log('ecommerce RESTful API Server listening on port:' +port);
});


