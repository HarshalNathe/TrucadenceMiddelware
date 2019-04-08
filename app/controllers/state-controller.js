'use strict'

var state = require('../services/state-services')

exports.stateGet = function (req, res, next) {
  state.get(req.headers, req.swagger.params, res);
}
