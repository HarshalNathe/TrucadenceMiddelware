'use strict'
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');

/**  Api to get specific employersEmployee through employeeId
 * alongwith candidate,employers,employerShifts,shiftJobProfiles details
 */

exports.get = function getEmployersEmployee(headers, args, res) {

    var param = DataPower.Models.employersEmployee + '/' + args.employerId.value + '/' + 'getEmployersEmployee';

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

/** Api to add employersEmployee detail */

exports.create = function addEmployersEmployee(headers, args, res) {

    var param = DataPower.Models.employersEmployee;

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

/** Api to update specific employersEmployee by employersEmployeeId */

exports.edit = function modifyEmployersEmployee(headers, args, res) {

    var param = DataPower.Models.employersEmployee + '/'
         + args.id;

    var options = {
        method: 'PUT',
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

/** Api to delete specific employersEmployee by employersEmployeeId */

exports.delete = function deleteEmployersEmployee(headers, args, res) {

    var param = DataPower.Models.employersEmployee + '/'
         + args.id.value;

    var options = {
        method: 'DELETE',
        url: DataPower.url + param,
        headers: setOption(headers.authorization)
    };

    request(options, function (error, response, body) {

        if (error) {
            return res.status(response.statusCode).json(JSON.stringify(error));
        }
        return res.status(response.statusCode).json(body);
    })
}
