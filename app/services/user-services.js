'use strict'
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');

/* Fetch user details based on secure field password & user id */

exports.get = function fetchUser(headers, args, res) {

  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.users +
      '/' + 'fetchDetails' +
      '/' + args.userId.value +
      '/' + 'fieldPassword' +
      '/' + args.secureFieldPassword.value,
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}

/* Update user profile using its id */
exports.edit = function updateUser(headers, args, res, next) {
  var options = {
    method: 'PUT',
    url: DataPower.url + DataPower.Models.users +
      '/' + args.id,
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