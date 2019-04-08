'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

/* Fetch the form master */
exports.get = function formGet(headers, args, res) {

  var _qs = {
    'filter[where][Form_Name]': args.formMaster_Name.value
  };

  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.formMaster + getParams(_qs),
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}