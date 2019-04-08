'use strict'
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');

/**  Api to get list of employer **/

exports.get = function getEmployer(headers, args, res) {

    var _qs = {
        'filter[order]': 'Employer_Name ASC',
        'item': args.keyword.value,
        'limit': args.limit.value,
        'skip': args.skip.value
    };

    var param = DataPower.Models.employer + '/' +
        'getEmployerList' + getParams(_qs);

    var options = {
        method: 'GET',
        url: DataPower.url + param,
        headers: setOption(headers.authorization)
    };

    request(options, function (error, response, body) {
        if (error) {
            return res.status(response.statusCode).json(JSON.stringify(error));
        }
        return res.status(response.statusCode).json(JSON.parse(body));
    })
}