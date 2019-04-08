'use strict'
var config = require('config');
var DataPower = config.get('DataPower');
var request = require('request');

/*** Implemented Global Search functionality ***/

exports.get = function searchingAll(headers, args, res) {

  var _qs = {
    'keyword': args.keyValue.value
  };
  var param = getParams(_qs);

  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.candidate + '/globalSearch' + param,
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}