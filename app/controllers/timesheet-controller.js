'use strict'

var timeSheet = require('../services/timesheet-services')

exports.timeSheetPost = function (req, res, next) {
  timeSheet.create(req.headers, req.body, res)
}

exports.timeSheetGet = function (req, res, next) {
  timeSheet.get(req.headers, req.swagger.params, res)
}

exports.timeSheetDelete = function (req, res, next) {
  timeSheet.delete(req.headers, req.swagger.params, res)
}

exports.timeSheetUpdate = function (req, res, next) {
  timeSheet.edit(req.headers, req.body, res)
}



