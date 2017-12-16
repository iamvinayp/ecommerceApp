'use strict';

//load packages
var express = require('express');
var router = express.Router();
//authentication middleware
var auth = require('../middlewares/auth.js');

var usersController = require('../controllers/usersController.js');
var productsController = require('../controllers/productsController.js');

//defining/mounting all the route handlers on the router instance

//user signup
router.post('/users/signup', usersController.signupUser);
//user login
router.post('/users/login', usersController.loginUser);
//user forgot password
router.post('/users/forgotpassword', usersController.resetPassword);
//user change password
router.post('/users/changepassword', auth.isAuthenticated, usersController.changePassword);
//user logout
router.get('/users/logout', usersController.logoutUser);
//get a users cart
router.post('/users/cart', auth.isAuthenticated, usersController.loadCart);
//add products to cart
router.post('/users/addtocart', auth.isAuthenticated, usersController.addToCart);
//remove products from cart
router.delete('/users/cart/:id', auth.isAuthenticated, usersController.removeFromCart);

//get the list of products
router.get('/products', productsController.getAllProducts);
//create a product
router.post('/products', auth.isAuthenticated, auth.isAdmin, productsController.createProduct);
//load a particular product
router.get('/products/:id', productsController.loadProduct);
//update a product
router.put('/products/:id', auth.isAuthenticated, auth.isAdmin, productsController.updateProduct);
//delete a product
router.delete('/products/:id', auth.isAuthenticated, auth.isAdmin, productsController.deleteProduct);

module.exports = router;