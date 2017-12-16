'use strict';

//importing the required modules/packages
var productsModel = require('../models/productsModel.js');
var responseLib = require('../libs/responseLib.js');

//declaring an object
var exports = module.exports = {};

//definitions of all the route handlers

exports.getAllProducts = function (req, res, next) {
	productsModel.find({}, function(err, products) {
		if (err) {
			next(err);
		}
		else if (products.length == 0) {
			console.log('No products found in db');
			var response = responseLib.responseGenerate(products, 404, true, 'No products found in db');
			res.status(404).send(response);
		}
		else {
			console.log('Fetching products successfull');
			var response = responseLib.responseGenerate(products, 200, false, 'Fetching products successfull');
			res.send(response);
		}
	});
}// end getAllProducts()

exports.createProduct = function (req, res, next) {

	var newProduct = new productsModel({
		name: req.body.name,
		category: req.body.category,
		brand: req.body.brand,
		imageUrl: req.body.imageUrl,
		price: req.body.price
	});

	if (!newProduct.name || !newProduct.category || !newProduct.brand|| !newProduct.imageUrl || !newProduct.price) {
		console.log('Syntax invalid in the request');
		var response = responseLib.responseGenerate(null, 400, true, 'Syntax invalid in the request');
		res.status(400).send(response);
	}
	else {
		newProduct.save(function (err, product) {
			if (err) {
				next(err);
			}
			else {
				console.log('Product creation successfull');
				var response = responseLib.responseGenerate(product, 201, false, 'Product creation successfull');
				res.send(response);
			}
		});
	}
}// end createProduct()

exports.loadProduct = function (req, res, next) {
		productsModel.findOne({'_id': req.params.id}, function (err, product) {
			if (err) {
				next(err);
			}
			else if (!product) {
				console.log('Requested product not found in db');
				var response = responseLib.responseGenerate(null, 404, true, 'Requested product not found in db');
				res.status(404).send(response);
			}
			else {
				console.log('Fetched the product successfully');
				var response = responseLib.responseGenerate(product, 200, false, 'Fetched the product successfully');
				res.send(response);
			}
		});
}// end loadProduct()

exports.updateProduct = function (req, res, next) {
		var updates = req.body;
		updates.lastModified = new Date();
		if (!updates.name || !updates.category || !updates.brand|| !updates.imageUrl || !updates.price) {
			console.log('Syntax invalid in the request');
			var response = responseLib.responseGenerate(null, 400, true, 'Syntax invalid in the request');
			res.status(400).send(response);
		}
		else {
			productsModel.findOneAndUpdate({'_id': req.params.id}, updates, { new: true }, function (err, product) {
				if (err) {
					next(err);
				}
				else if (!product) {
					console.log('Requested product not found in db');
					var response = responseLib.responseGenerate(null, 404, true, 'Requested product not found in db');
					res.status(404).send(response);
				}
				else {
					console.log('Updated the product successfully');
					var response = responseLib.responseGenerate(product, 200, false, 'Updated the product successfully');
					res.send(response);
				}
			});
		}
}// end updateProduct()

exports.deleteProduct = function (req, res, next) {
		productsModel.remove({'_id': req.params.id}, function (err, product) {
			if (err) {
				next(err);
			}
			else if (!product) {
				console.log('Requested product not found in db');
				var response = responseLib.responseGenerate(null, 404, true, 'Requested product not found in db');
				res.status(404).send(response);
			}
			else {
				console.log('Deleted the product successfully');
				var response = responseLib.responseGenerate(product, 200, false, 'Deleted the product successfully');
				res.send(response);
			}
		});
}// end deleteProduct()