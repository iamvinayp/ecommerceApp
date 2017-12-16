'use strict';

var responseLib = require('../libs/responseLib.js');

var exports = module.exports = {};

exports.checkRoute = function (req, res) {
	var response = responseLib.responseGenerate(null, 404, true, req.originalUrl + ' not found');
	res.status(404).send(response);
	// res.status(404).send({url: req.originalUrl + ' not found'});
}