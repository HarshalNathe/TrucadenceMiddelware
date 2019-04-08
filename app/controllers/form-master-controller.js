'use strict'

var formMaster = require('../services/form-master-services');

exports.formMasterGet = function (req, res, next) {
  formMaster.get(req.headers, req.swagger.params, res)
}

