'use strict';

var exports = module.exports = {};

exports.responseGenerate = function (data, status, error, message) {
	return {
		data: data,
		status: status,
		error: error,
		message: message
	}
}