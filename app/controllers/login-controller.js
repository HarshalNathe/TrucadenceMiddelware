'use strict'
var login = require('../services/login-services');

module.exports.getLogin = function getLogin(req, res, next) {
  login.getLogin(req.headers['authorization'], res, next);
};

module.exports.postLogin = function postLogin(req, res, next) {
  login.postLogin(req.body, res, next);
};

module.exports.postSignup = function postSignup(req, res, next) {
  login.postSignup(req.body, res, next);
};

module.exports.verifyUsers = function verifyUsers(req, res, next) {
  login.verifyUsers(req.swagger.params.token.value, res, next);
};

module.exports.forgotPassword = function forgotPassword(req, res, next) {
  login.forgotPassword(req.body.email, res, next);
};

module.exports.resetPasswordToken = function resetPasswordToken(req, res, next) {
  login.resetPasswordToken(req.swagger.params.token.value, res, next);
};

module.exports.changePassword = function changePassword(req, res, next) {
  login.changePassword(req.swagger.params.token.value, req.body.password, res, next);
};

module.exports.resetPassword = function resetPassword(req, res, next) {
  login.resetPassword(req.body, res, next);
};