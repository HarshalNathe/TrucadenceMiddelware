'use strict'

var search = require('../services/global-search-services');

exports.searchingAll = function (req, res, next) {
  search.get(req.headers, req.swagger.params, res);
}
