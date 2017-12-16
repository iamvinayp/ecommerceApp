'use strict';

//importing the required files/modules
var usersModel = require('../models/usersModel.js');
var responseLib = require('../libs/responseLib.js');
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var jwt = require('../config/jwtConfig.js');
var ObjectId = require('mongodb').ObjectID;

//declaring an object
var exports = module.exports = {};

//definitions of all the route handlers

exports.signupUser = function (req, res, next) {

	if (!req.body.fullName || !req.body.email || !req.body.password) {
		console.log('Syntax invalid in the request');
		var response = responseLib.responseGenerate(null, 400, true, 'Syntax invalid in the request');
		res.status(400).send(response);
	}
	else {
		var newUser = new usersModel({
			fullName: req.body.fullName,
			email: req.body.email,
			password: req.body.password,
			admin: req.body.admin,
			address: req.body.address
		});
		newUser.password = bcrypt.hashSync(req.body.password, 10);
		usersModel.findOne({'email': newUser.email}, function (err, user) {
			if (err) {
				next(err);
			}
			else if (!user) {
				newUser.save(function (err, user) {
					if (err) {
						next(err);
					}
					else {
						user.password = undefined;
						console.log('User signup successfull');
						var response = responseLib.responseGenerate(user, 201, false, 'User signup successfull');
						res.status(201).send(response);
					}
				});// end save()
			}
			else {
				newUser.password = undefined;
				console.log('Email is already registered');
				var response = responseLib.responseGenerate(newUser, 409, true, 'Email is already registered');
				res.status(409).send(response);
			}
		});//end findOne()
	}// end main else

}//end signupUser()


exports.loginUser = function (req, res, next) {

	if (!req.body.email || !req.body.password) {
		console.log('Syntax invalid in the request');
		var response = responseLib.responseGenerate(null, 400, true, 'Syntax invalid in the request');
		res.status(400).send(response);
	}
	else {
		usersModel.findOne({'email': req.body.email}, function (err, user) {
			if (err) {
				next(err);
			}
			else if (!user) {
				console.log('Email not registered');
				var response = responseLib.responseGenerate(null, 401, true, 'Authentication failed. Email not registered');
				res.status(401).send(response);
			}
			else {
				if (bcrypt.compareSync(req.body.password, user.password)) {
					user.password = undefined;
					console.log('User found, Login successfull');
					var response = responseLib.responseGenerate(user, 200, false, 'User found, Login successfull');
					//generating a json web token
					// response.token = jsonwebtoken.sign({fullName: user.fullName, email: user.email, _id: user._id}, 'ecommerce RESTful APIs');
					var payload = {fullName: user.fullName, email: user.email, _id: user._id};
					var token = jsonwebtoken.sign(payload, jwt.secretKey);
					res.cookie('jwtoken', token, {maxAge: 1000*60*60*2}).status(200).send(response);
				}
				else {
					user.password = undefined;
					console.log('Wrong password');
					var response = responseLib.responseGenerate(user, 401, true, 'Authentication failed. Wrong password');
					res.status(401).send(response);
				}
			}
		});//end findOne()
	}

}

exports.resetPassword = function (req, res, next) {

	if (!req.body.email) {
		console.log('Provide the registered email please !!');
		var response = responseLib.responseGenerate(null, 400, true, 'Provide the registered email please !!');
		res.status(400).send(response);
	}
	else {
		//generate and hash a random pwd
		var password = generatePassword();
		console.log(password);
		var passwordHash = bcrypt.hashSync(password, 10);
		// console.log(passwordHash);
		var update = {
			password: passwordHash
		}
		usersModel.findOneAndUpdate({'email': req.body.email}, update, function (err, user) {
			if (err) {
				next(err);
			}
			else if (!user) {
				console.log('Provided email is not registered');
				var response = responseLib.responseGenerate(null, 404, true, 'Provided email is not registered');
				res.status(404).send(response);
			}
			else {
				console.log('Password updated in db');
				// res.status(200).send('ok');
				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'youremail@gmail.com',
						pass: 'yourpassword'
					}
				});

				var mailOptions = {
					from: 'youremail@gmail.com',//sender emailaddress
					to: req.body.email,
					subject: 'Password reset',
					text: 'Hello ' + req.body.email + ', \n\n Your password has been reset. Please use ' + password + ' to login. \n\nThank you.'
				};

				transporter.sendMail(mailOptions, function(err, info){
					if (err) {
						next(err);
					}
					else {
						console.log('Password reset email sent' + info.response);
						var response = responseLib.responseGenerate(info.response, 200, false, 'Password reset email sent');
						res.status(200).send(response);
					}
				}); // end sendMail()
			} // end inner else
		}); //end findOneAndUpdate()

	}// end main else

}// end resetPassword()

// function to generate a random password
function generatePassword () {

	var password = "";
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>1234567890";
	for (var i = 0; i < 8; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return password;

}// end generatePassword()


exports.logoutUser = function (req, res,next) {

	res.clearCookie('jwtoken');
	console.log('User logged out');
	var response = responseLib.responseGenerate(null, 200, false, 'User logged out');
	res.status(200).send(response);

}// end logoutUser()

exports.changePassword =function (req, res, next) {

	var passwordHash = bcrypt.hashSync(req.body.password, 10);
	// console.log(passwordHash);
	var update = {
		password: passwordHash
	}
	if (!req.body.email || !req.body.password) {
		console.log('Syntax invalid in the request');
		var response = responseLib.responseGenerate(null, 400, true, 'Syntax invalid in the request');
		res.status(400).send(response);
	}
	else {
		usersModel.findOne({'email': req.body.email}, function (err, user) {
			if (err) {
				next(err);
			}
			else if (!user) {
				console.log('Requested user not found in db');
				var response = responseLib.responseGenerate(null, 404, true, 'Requested user not found in db');
				res.status(404).send(response);
			}
			else {
				if (bcrypt.compareSync(req.body.password, user.password)) {
					user.password = undefined;
					console.log('Current & the new password can\'t be same');
					var response = responseLib.responseGenerate(user, 409, true, 'Current & the new password can\'t be same');
					res.status(409).send(response);
				}
				else {
					usersModel.findOneAndUpdate({'email' : req.body.email}, update, {new: true}, function (err, user) {
						if (err) {
							next(err);
						}
						else if (!user) {
							console.log('Requested user not found in db');
							var response = responseLib.responseGenerate(null, 404, true, 'Requested user not found in db');
							res.status(404).send(response);
						}
						else {
							console.log('Password changed successfully');
							user.password = undefined;
							var response = responseLib.responseGenerate(user, 200, false, 'Password changed successfully');
							res.status(200).send(response);
						}
					});// end findOneAndUpdate()
				}
			}
		});//end findOne()
	}// end main else

}

exports.loadCart = function (req, res, next) {

	var cart;
	if (!req.body.email) {
		console.log('Syntax invalid in the request');
		var response = responseLib.responseGenerate(null, 400, true, 'Syntax invalid in the request');
		res.status(400).send(response);
	}
	else {
		usersModel
		.findOne({'email': req.body.email})
		.populate('cart')
		.exec(function (err, user) {
			if (err) {
				next(err);
			}
			else if (!user) {
				console.log('Requested user not found in db');
				var response = responseLib.responseGenerate(null, 404, true, 'Requested user not found in db');
				res.status(404).send(response);
			}
			else {
				console.log('User\'s cart fetched successfully');
				var response = responseLib.responseGenerate(user.cart, 200, false, 'User\'s cart fetched successfully');
				res.status(200).send(response);
			}
		});// end exec()
	}

}// end loadCart()

exports.addToCart = function (req, res, next) {

	if (!req.body.email || !req.body.productId) {
		console.log('Syntax invalid in the request');
		var response = responseLib.responseGenerate(null, 400, true, 'Syntax invalid in the request');
		res.status(400).send(response);
	}
	else {
		usersModel.findOne({'email': req.body.email}, function (err, user) {
			if (err) {
				next(err);
			}
			else if (!user) {
				console.log('Requested user not found in db');
				var response = responseLib.responseGenerate(null, 404, true, 'Requested user not found in db');
				res.status(404).send(response);
			}
			else {
				var exists = false;
				user.cart.forEach(function (pid) {
					if (pid == req.body.productId) exists = true;
				});
				if (!exists) {
					var productId = ObjectId(req.body.productId);
					user.cart.push(productId);
					user.save(function (err, user) {
						if (err) {
							next(err);
						}
						else {
							user.password = undefined;
							console.log('User\'s cart saved');
							var response = responseLib.responseGenerate(user, 201, false, 'User\'s cart saved');
							res.status(201).send(response);
						}
					}); // end save()
				}
				else {
					user.password = undefined;
					console.log('Product is already in cart');
					var response = responseLib.responseGenerate(user, 409, true, 'Product is already in cart');
					res.status(409).send(response);
				}
			}
		}); // end findOne()
	}

} // end addToCart()

exports.removeFromCart = function (req, res, next) {

	if (!req.body.email) {
		console.log('Syntax invalid in the request');
		var response = responseLib.responseGenerate(null, 400, true, 'Syntax invalid in the request');
		res.status(400).send(response);
	}
	else {
		usersModel.findOne({'email': req.body.email}, function (err, user) {
			if (err) {
				next(err);
			}
			else if (!user) {
				console.log('Requested user not found in db');
				var response = responseLib.responseGenerate(null, 404, true, 'Requested user not found in db');
				res.status(404).send(response);
			}
			else {
				var index = user.cart.indexOf(ObjectId(req.param.id));
				user.cart.splice(index, 1);
				console.log('Deleted the product from user\'s cart successfully');
				var response = responseLib.responseGenerate(user.cart, 200, false, 'Deleted the product from user\'s cart successfully');
				res.send(response);
			}
		}); // end findOne()
	}

} //end removeFromCart()