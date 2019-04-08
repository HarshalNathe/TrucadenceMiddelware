'use strict'

var verification = require('../services/employment-eligibility-verification-services');

exports.verificationPost = function (req, res, next) {
  verification.create(req.headers, req.body, res)
}

exports.verificationGet = function (req, res, next) {
  verification.get(req.headers, req.swagger.params, res)
}

exports.verificationPut = function (req, res, next) {
  verification.edit(req.headers, req.body, res)
}
