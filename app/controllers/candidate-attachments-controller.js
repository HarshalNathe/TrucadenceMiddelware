'use strict'

var candidateAttachment = require('../services/candidate-attachment-services');

exports.candidateAttachmentsGet = function (req, res, next) {
    candidateAttachment.get(req.headers, req.swagger.params, res);
}

exports.candidateAttachmentsPost = function (req, res, next) {
    candidateAttachment.post(req.headers, req.body, res);
}

exports.candidateAttachmentsEdit = function (req, res, next) {
    candidateAttachment.edit(req.headers, req.body, res);
}

exports.candidateAttachmentsDeleteById = function (req, res, next) {
    candidateAttachment.deleteById(req.headers, req.swagger.params, res);
}