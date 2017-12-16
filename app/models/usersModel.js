'use strict';

//importing/loading the express module/package
var mongoose = require('mongoose');

//declaring a schema
var Schema = mongoose.Schema;

//importing other required modules
var productsModel = require('./productsModel.js');

//defining required schemas
var UserSchema = new Schema({
	fullName:{
		type: String,
		trim: true,
		required: true
	},
	email:{
		type: String,
		// unique: true,
		trim: true,
		lowercase: true,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	admin: {
		type: Boolean,
		default: false
	},
	created:{
		type: Date,
		default: Date.now
	},
	address:{
		type: String,
		default: ''
	},
	cart:[{
		type: Schema.Types.ObjectId,
		ref: 'Products'
	}]
});

module.exports = mongoose.model('Users', UserSchema);