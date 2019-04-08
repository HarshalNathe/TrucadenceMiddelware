'use strict'

var country = require('../services/country-services')

exports.countryGet = function (req, res, next) {
  country.get(req.headers, req.swagger.params, res);
}
