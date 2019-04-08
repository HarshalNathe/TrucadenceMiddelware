'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

// Delete employment detail based on employmentDetail id

exports.delete = function employmentDelete(headers, args, res) {

  var _employmentDetailOptions = employmentDetailOptions();

  request(_employmentDetailOptions, employmentDetailSuccess)

  function employmentDetailSuccess(error, response, body) {
    var _res = {};
    _res.statusCode = response.statusCode === 204 ?
      200 : response.statusCode;// Status code 200 set when 204 for body response

    if (error) {
      _res.data = error
    } else {
      console.log('response::', _res);
      _res.data = {};
      _res.data.status = response.statusCode === 204 ? true : false;
    }

    return res.status(_res.statusCode).json(_res.data);
  }

  function employmentDetailOptions() {
    return {
      method: 'DELETE',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.candidateId.value +
        '/' + DataPower.Models.employmentDetails +
        '/' + args.employmentId.value,
      headers: setOption(headers.authorization)
    }
  }
}
