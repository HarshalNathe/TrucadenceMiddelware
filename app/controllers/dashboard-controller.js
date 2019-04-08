'use strict'

var dashboardStatistics = require('../services/dashboard-services');

exports.monthlyRegistrationStatsGet = function (req, res, next) {
  dashboardStatistics.getMonthlyCandidate(req.headers, req.swagger.params, res);
}

exports.userRegistrationStatsGet = function (req, res, next) {
  dashboardStatistics.getUser(req.headers, req.swagger.params, res);
}

exports.candidateStatisticsGet = function (req, res, next) {
  dashboardStatistics.getRecentUpdatedCandidate(req.headers, req.swagger.params, res);
}

exports.profileStatsGet = function (req, res, next) {
  dashboardStatistics.getProfileStats(req.headers, req.swagger.params, res);
}

