'use strict'

var attachmentTypeList = require('../services/attachment-type-services');

exports.attachmentTypesGet = function (req, res, next) {
  attachmentTypeList.get(req.headers, req.swagger.params, res)
}

