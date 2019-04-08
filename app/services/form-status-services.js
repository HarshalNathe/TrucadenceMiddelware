'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

/* Update form status using its id */
exports.edit = function formStatusUpdate(headers, args, res, next) {

  var options = {
    method: 'PUT',
    url: DataPower.url + DataPower.Models.formStatus +
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