'use strict'

var illinoisAllowancesWorksheet = require('../services/illinois-allowances-worksheet-services');

exports.illinoisAllowancesWorksheetGet = function (req, res, next) {
    illinoisAllowancesWorksheet.get(req.headers, req.swagger.params, res)
}

exports.illinoisAllowancesWorksheetPost = function (req, res, next) {
    illinoisAllowancesWorksheet.create(req.headers, req.body, res)
}

exports.illinoisAllowancesWorksheetEdit = function (req, res, next) {
    illinoisAllowancesWorksheet.update(req.headers, req.body, res)
}

