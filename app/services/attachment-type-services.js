'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

/* Fetch the attachment type */
exports.get = function attachmentGet(headers, args, res) {

  var _qs = {
    'filter[where][Attachment_Type_Name]': args.attachmentType_Name.value
  };

  var options = {
    method: 'GET',
    url: DataPower.url + DataPower.Models.attachmentType + getParams(_qs),
    headers: setOption(headers.authorization)
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(response.statusCode).json(JSON.stringify(error));
    }
    return res.status(response.statusCode).json(JSON.parse(body));
  })
}