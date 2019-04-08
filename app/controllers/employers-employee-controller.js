'use strict'

var employersEmployee = require('../services/employers-employee-services');

exports.employersEmployeeGet = function (req, res, next) {
  employersEmployee.get(req.headers, req.swagger.params, res)
}

exports.employersEmployeeCreate = function (req, res, next) {
  employersEmployee.create(req.headers, req.body, res)
}

exports.employersEmployeeUpdate = function (req, res, next) {
  employersEmployee.edit(req.headers, req.body, res)
}

exports.employersEmployeeDelete = function (req, res, next) {
  employersEmployee.delete(req.headers, req.swagger.params, res)
}