'use strict';

//importing the required files/modules
var usersModel = require('../models/usersModel.js');
var responseLib = require('../libs/responseLib.js');
var jsonwebtoken = require('jsonwebtoken');
var jwt = require('../config/jwtConfig.js');

var exports = module.exports = {};

exports.isAuthenticated = function (req, res, next) {

	if (req.cookies && req.cookies.jwtoken) {
		jsonwebtoken.verify(req.cookies.jwtoken, jwt.secretKey, function (err, decodedJwt) {
			if (err) {
				var response = responseLib.responseGenerate(null, 500, true, 'Internal server error');
				res.status(500).send(response);
			}
			else {
				next();
			}
		})
	}
	else {
		console.log('User not logged in');
		var response = responseLib.responseGenerate(null, 401, true, 'User not logged in');
		res.status(401).send(response);
	}

}

exports.isAdmin = function (req, res, next) {

	if (req.cookies && req.cookies.jwtoken) {
		jsonwebtoken.verify(req.cookies.jwtoken, jwt.secretKey, function (err, decodedJwt) {
			if (err) {
				var response = responseLib.responseGenerate(null, 500, true, 'Internal server error');
				res.status(500).send(response);
			}
			else {
				// console.log(decodedJwt);
				usersModel.findOne({'email': decodedJwt.email}, function (err, user) {
					if (err) {
						var response = responseLib.responseGenerate(null, 500, true, 'Internal server error');
						res.status(500).send(response);
					}
					else if (user.admin) {
						// console.log(user);
						next();
					}
					else {
						console.log('User is not admin');
						var response = responseLib.responseGenerate(null, 401, true, 'User is not admin');
						res.status(401).send(response);
					}
				});//end findOne()
			}
		});//end verify()
	}
	else {
		console.log('User not logged in');
		var response = responseLib.responseGenerate(null, 401, true, 'User not logged in');
		res.status(401).send(response);
	}

}