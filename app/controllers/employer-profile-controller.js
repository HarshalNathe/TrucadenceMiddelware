'use strict'

var employerProfile = require('../services/employer-profile-services');

exports.employerProfileGet = function (req, res, next) {
  employerProfile.get(req.headers, req.swagger.params, res)
}

exports.employerProfileUpsert = function (req, res, next) {
  employerProfile.post(req.headers, req.body, res)
}





