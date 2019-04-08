'use strict'

var bsaDisclosureRelease = require('../services/bsa-disclosure-release-services');

exports.bsaDisclosureReleaseGet = function (req, res, next) {
    bsaDisclosureRelease.get(req.headers, req.swagger.params, res)
}

exports.bsaDisclosureReleasePost = function (req, res, next) {
    bsaDisclosureRelease.create(req.headers, req.body, res)
}

