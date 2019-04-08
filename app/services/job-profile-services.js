'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

/* Fetch the job profile details */
exports.get = function profileGet(headers, args, res) {
  var _qs = {
    'filter[where][Is_Active]': args.Is_Active.value
  };

  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.jobProfile + getParams(_qs),
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}

/* create a new job profile */
exports.create = function profilePost(headers, args, res, next) {

  var profileName = args.Profile_Name;
  profileName = profileName.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });

  args.Profile_Name = profileName;

  var options = {
    method: 'POST',
    url: DataPower.url + DataPower.Models.jobProfile,
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

/* Update job profile using its id */
exports.edit = function profilePut(headers, args, res, next) {
  var options = {
    method: 'PUT',
    url: DataPower.url + DataPower.Models.jobProfile +
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