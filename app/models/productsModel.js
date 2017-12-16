'use strict';

//importing/loading the express module/package
var mongoose = require('mongoose');

//declaring a schema
var Schema = mongoose.Schema;

//defining required schemas
var ProductSchema = new Schema({
	name:{
		type: String,
		required: true
	},
	category:{
		type: String,
		required: true
	},
	brand:{
		type: String,
		required: true
	},
	imageUrl:{
		type: String,
		required: true
	},
	price:{
		type: Number,
		required: true
	},
	availability:{
		type: Boolean,
		default: true
	},
	created:{
		type: Date,
		default: Date.now
	},
	lastModified:{
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Products', ProductSchema);