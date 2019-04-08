'use strict'

var eeoSelfIdentification = require('../services/eeoselfidentification-services');

exports.selfIdentificationPost = function (req, res, next) {
  eeoSelfIdentification.create(req.headers, req.body, res)
}

exports.selfIdentificationGet = function (req, res, next) {
  eeoSelfIdentification.get(req.headers, req.swagger.params, res)
}

exports.selfIdentificationPut = function (req, res, next) {
  eeoSelfIdentification.edit(req.headers, req.body, res)
}
