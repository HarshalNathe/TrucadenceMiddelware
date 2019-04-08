'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');

/** Display candidate as per monthly register **/
exports.getMonthlyCandidate = function monthlyRegistrationStatsGet(headers, args, res) {
  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.candidate + '/' +
      'monthlyRegistrationStat',
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}

/** Display user registered as per current_week, current_month,
 * current_year,current_day
 */

exports.getUser = function userRegistrationStatsGet(headers, args, res) {
  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.users + '/' +
      'userStats',
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}

/** Display candidate statistics as per recently updated
 *  & total count
 */

exports.getRecentUpdatedCandidate = function candidateStatisticsGet(headers, args, res) {
  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.candidate + '/' +
      'candidateStats',
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}

/** Display status of all forms filled **/

exports.getProfileStats = function profileStatsGet(headers, args, res) {
  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.formStatus + '/' +
      'profileStatistics',
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}