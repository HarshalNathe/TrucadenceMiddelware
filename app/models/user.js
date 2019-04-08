"use strict";

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	email: String,
	password: String,
	firstName: String,
	lastName: String,
	username: String,
	role: String,
	active: Boolean,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	securefieldPassword: String,
	createdAt: Date
});

module.exports = mongoose.model('User', userSchema);