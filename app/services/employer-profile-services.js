'use strict'
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');

/**  Api to get details of employer profile **/

exports.get = function getEmployerProfile(headers, args, res) {

    var _qs = {
        'filter[order]': 'Employer_Name ASC'
    };

    var param = DataPower.Models.employer + '/' + args.employerId.value + '/' +
        'getEmployerProfile' + getParams(_qs);

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



/** Upsert Employer details alongwith employer,employerProfile,
 * employerShift and shiftJobProfile
 */

exports.post = function upsertEmployerProfile(headers, args, res) {

    var param = DataPower.Models.employer + '/' +
        'upsertEmployerProfile';

    var options = {
        method: 'POST',
        url: DataPower.url + param,
        headers: setOption(headers.authorization),
        body: args,
        json: true
    };

    request(options, function (error, response, body) {

        if (error) {
            return res.status(response.statusCode).json(JSON.stringify(error));
        }
        return res.status(response.statusCode).json(body);
    })
}