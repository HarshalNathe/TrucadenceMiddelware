'use strict'
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');

exports.get = function stateGet(headers, args, res) {

  var _qs = {
    'filter[order]': 'name ASC'
  };
  var includeCity = args.city.value ? '/' + DataPower.Models.city : '';
  var param = args.id.value ? '/' + args.id.value + includeCity : getParams(_qs);
  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.state + param,
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}
