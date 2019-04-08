'use strict'

var documentList = require('../services/document-list-services');

exports.documentListGet = function (req, res, next) {
  documentList.get(req.headers, req.swagger.params, res)
}

exports.documentListPut = function (req, res, next) {
  documentList.edit(req.headers, req.body, res)
}

