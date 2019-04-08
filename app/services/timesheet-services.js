'use strict'
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');

/** Api to add timesheet */

exports.create = function addTimeSheet(headers, args, res, next) {


  var options = {
    method: 'POST',
    url: DataPower.url + DataPower.Models.timeSheet + '/' + 'addTimesheet',
    headers: setOption(headers.authorization),
    body: args,
    json: true
  }


  request(options, function (error, response, body) {

    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error))
    }
    return res.status(response.statusCode).json(body)
  })
}

/** Api to delete particular timesheet through timesheetId*/

exports.delete = function deleteTimeSheet(headers, args, res, next) {

  var param = DataPower.Models.timeSheet + '/' +
    args.id.value;

  var options = {
    method: 'DELETE',
    url: DataPower.url + param,
    headers: setOption(headers.authorization)
  }

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error))
    }
    return res.status(response.statusCode).json(body)
  })
}

/** Api to get details of timesheet which are asspociated to that employer */

exports.get = function getTimeSheet(headers, args, res, next) {

  var param = DataPower.Models.timeSheet + '/' +
    args.employerId.value + '/' + 'getTimesheetDetails' + '?' +
    'startDate=' + args.startDate.value + '&' + 'endDate=' + args.endDate.value;

  var options = {
    method: 'GET',
    url: DataPower.url + param,
    headers: setOption(headers.authorization)
  }

  request(options, function (error, response, body) {

    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error))
    }
    return res.status(response.statusCode).json(JSON.parse(body))
  })
}

/** Api to update particular timesheet through timesheetID */

exports.edit = function updateTimeSheet(headers, args, res, next) {

  var options = {
    method: 'PUT',
    url: DataPower.url + DataPower.Models.timeSheet + '/' + args.id,
    headers: setOption(headers.authorization),
    body: args,
    json: true
  }

  request(options, function (error, response, body) {

    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error))
    }
    return res.status(response.statusCode).json(body)
  })
}