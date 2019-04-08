'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

/* Fetch the document list based on its id */
exports.get = function docListGet(headers, args, res) {

  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.documentList,
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}

/* Update document List using its id */
exports.edit = function docListUpdate(headers, args, res, next) {

  var options = {
    method: 'PUT',
    url: DataPower.url + DataPower.Models.documentList +
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