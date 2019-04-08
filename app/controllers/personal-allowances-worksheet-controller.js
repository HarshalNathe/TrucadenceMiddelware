'use strict'

var personalAllowancesWorksheet = require('../services/personal-allowances-worksheet-services');

exports.personalAllowancesWorksheetGet = function (req, res, next) {
  personalAllowancesWorksheet.get(req.headers, req.swagger.params, res)
}

exports.personalAllowancesWorksheetPost = function (req, res, next) {
  personalAllowancesWorksheet.create(req.headers, req.body, res)
}

exports.personalAllowancesWorksheetEdit = function (req, res, next) {
  personalAllowancesWorksheet.edit(req.headers, req.body, res)
}

