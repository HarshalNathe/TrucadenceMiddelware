'use strict'

var state = require('../services/city-services')

exports.cityGet = function (req, res, next) {
  state.get(req.headers, req.swagger.params, res);
}
