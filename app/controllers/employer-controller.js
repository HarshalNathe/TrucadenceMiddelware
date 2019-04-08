'use strict'

var employer = require('../services/employer-services');

exports.employerGet = function (req, res, next) {
  employer.get(req.headers,req.swagger.params, res)
}