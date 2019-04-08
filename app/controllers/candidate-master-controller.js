'use strict'

var candidateMaster = require('../services/candidate-master-services');

exports.candidateGet = function (req, res, next) {
    candidateMaster.get(req.headers, req.swagger.params, res)
}

exports.candidateDetailsById = function (req, res, next) {
    candidateMaster.getById(req.headers, req.swagger.params, res)
}

exports.candidatePost = function (req, res, next) {
    candidateMaster.create(req.headers, req.body, res)
}

exports.candidateEdit = function (req, res, next) {
    candidateMaster.edit(req.headers, req.body, res)
}