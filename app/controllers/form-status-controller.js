'use strict'

var formStatus = require('../services/form-status-services');

exports.formStatusPut = function (req, res, next) {
  formStatus.edit(req.headers, req.body, res)
}

