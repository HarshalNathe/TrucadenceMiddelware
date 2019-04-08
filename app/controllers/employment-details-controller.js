var employmentDetail = require('../services/employment-details-services');

exports.employmentDetaildelete = function (req, res, next) {
  employmentDetail.delete(req.headers, req.swagger.params, res)
}