'use strict'

var jobProfileList = require('../services/job-profile-services');

exports.jobProfileGet = function (req, res, next) {
  jobProfileList.get(req.headers, req.swagger.params, res)
}

exports.jobProfilePost = function (req, res, next) {
  jobProfileList.create(req.headers, req.body, res)
}

exports.jobProfilePut = function (req, res, next) {
  jobProfileList.edit(req.headers, req.body, res)
}

