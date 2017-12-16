'use strict';

var responseLib = require('../libs/responseLib.js');

var exports = module.exports = {};

exports.handleError = function (err, req, res, next) {
	console.log(err);
	var response = responseLib.responseGenerate(null, 500, true, 'Internal server error');
	res.status(500).send(response);
}