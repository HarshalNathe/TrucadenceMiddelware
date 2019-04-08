'use strict'

var user = require('../services/user-services')

exports.userGet = function (req, res, next) {
  user.get(req.headers, req.swagger.params, res);
}

exports.userPut = function (req, res, next) {
  user.edit(req.headers, req.body, res);
}

