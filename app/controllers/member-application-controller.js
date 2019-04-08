'use strict'

var member = require('../services/member-application-services');

exports.memberPost = function (req, res, next) {
  member.create(req.headers, req.body, res)
}

exports.memberGet = function (req, res, next) {
  member.get(req.headers, req.swagger.params, res)
}

exports.memberPut = function (req, res, next) {
  member.edit(req.headers, req.body, res)
}


