'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

exports.get = function candidateGet(headers, args, res) {

    var cOptions;
    var _qs;
    var pOptions;
    var pList;
    var count;

    /* Displays all user for role "Admin" */
    if (args.role.value === 1) {

        cOptions = cOptions();
        _qs = _qs();
        pOptions = pOptions();

        count = new Promise((resolve, reject) => {
            request(cOptions, getCount);

            function getCount(error, response, body) {
                var _res = {};
                _res.statusCode = response.statusCode;
                if (error) {
                    _res.data = JSON.parse(error);
                    reject(_res);
                } else {
                    _res.data = JSON.parse(body);
                    resolve(_res);
                }
            }
        })

        pList = count => new Promise((resolve, reject) => {
            request(pOptions, getList);

            function getList(error, response, body) {
                var _res = {};
                var object = {};

                if (count) {
                    object.count = count;
                }

                _res.statusCode = response.statusCode;
                if (error) {
                    _res.data = JSON.parse(error);
                    reject(_res);
                } else {
                    object.list = JSON.parse(body);
                    _res.data = object;
                    resolve(_res);
                }
            }
        })

        if (args.skip.value === 0) {
            // Call Count API
            count.then(countSuccess, onrejected);
        } else {
            // candidate List call without count
            pList().then(onfulfilled, onrejected);
        }

        function countSuccess(count) {
            if (!args.limit.value) {
                return onfulfilled(count);
            }

            pList(count.data.count).then(onfulfilled, onrejected);
        }

        function onfulfilled(object) {
            return res.status(object.statusCode).json(object.data);
        }

        function cOptions() {
            return {
                method: 'GET',
                url: DataPower.url + DataPower.Models.candidate + '/count',
                headers: setOption(headers.authorization)
            }
        }

        function _qs() {
            return {
                'filter[limit]': args.limit.value,
                'filter[skip]': args.skip.value,
                'filter[include]': 'positionInterested'
            }
        }

        function pOptions() {
            var param = args.ID.value ? '/' + args.ID.value + getParams(_qs) : getParams(_qs);
            return {
                method: 'GET',
                url: DataPower.url + DataPower.Models.candidate + param,
                headers: setOption(headers.authorization)
            }
        }

        // Error handler
        function onrejected(error) {
            return res.status(401).json(error);
        }
    }
    /* Displays mapped users otherwise admin role */
    else {
        var obj = {};
        var _qs = {
            'filter[limit]': args.limit.value,
            'filter[skip]': args.skip.value,
            'filter[include]': 'positionInterested'
        };
        var rOptions = {
            method: 'GET',
            url: DataPower.url + DataPower.Models.users +
                '/' + args.userId.value +
                '/' + DataPower.Models.candidate + getParams(_qs),
            headers: setOption(headers.authorization)
        };

        request(rOptions, function (error, response, body) {

            if (error) {
                return res.status(response.statusCode).json(JSON.stringify(error));
            }
            obj.list = JSON.parse(body);
            return res.status(response.statusCode).json(obj);
        })
    }

}


// Get all details of candidate using custom API
exports.getById = function candidateGet(headers, args, res) {

    var _qs = {
        'AttachmentID': args.AttachmentID.value,
        'FormMasterID': args.FormMasterID.value
    };

    var param = args.ID.value ? '/' + args.ID.value + getParams(_qs) : getParams(_qs);

    var options = {
        method: 'GET',
        url: DataPower.url + DataPower.Models.candidate + '/getDetails' + param,
        headers: setOption(headers.authorization)
    };

    request(options, function (error, response, body) {
        if (error) {
            return res.status(response.statusCode).json(JSON.stringify(error));
        }
        return res.status(response.statusCode).json(JSON.parse(body));
    })
}

// Create a new candidate
exports.create = function candidateCreate(headers, args, res) {
    var candidateOptions = candidateOptions();
    var candidate;

    var employmentDetails;
    var candidateAttachments;
    var bSADisclosureReleases;
    var formStatus;

    // Create Candidate
    candidate = new Promise((resolve, reject) => {
        request(candidateOptions, patientSuccess);

        function patientSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = response.body;
                resolve(_res);
            }
        }
    });

    // Create Employement details using Candidate_Id
    employmentDetails = _candidateObj => new Promise((resolve, reject) => {
        var _employmentDetailsOptions = employmentDetailsOptions();

        request(_employmentDetailsOptions, employmentDetailsSuccess);

        function employmentDetailsSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = _candidateObj.candidate;
                _res.data.employmentDetails = response.body;
                resolve(_res);
            }
        }

        function employmentDetailsOptions() {
            return {
                method: 'POST',
                url: DataPower.url + DataPower.Models.candidate +
                    '/' + _candidateObj.id + '/' + DataPower.Models.employmentDetails,
                headers: setOption(headers.authorization),
                body: _candidateObj.employmentDetails,
                json: true
            }
        }
    })

    // Create candidateAttachments using Candidate_Id
    candidateAttachments = _candidateObj => new Promise((resolve, reject) => {
        var _candidateAttachmentsOptions = candidateAttachmentsOptions();

        request(_candidateAttachmentsOptions, candidateAttachmentsSuccess);

        function candidateAttachmentsSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = _candidateObj.candidate;
                _res.data.candidateAttachments = response.body;
                resolve(_res);
            }
        }

        function candidateAttachmentsOptions() {
            return {
                method: 'POST',
                url: DataPower.url + DataPower.Models.candidate +
                    '/' + _candidateObj.id + '/' + DataPower.Models.candidateAttachment,
                headers: setOption(headers.authorization),
                body: _candidateObj.candidateAttachments,
                json: true
            }
        }
    })

    // Create BSADisclosureRelease using Candidate_Id
    bSADisclosureReleases = _candidateObj => new Promise((resolve, reject) => {
        var _bSADisclosureReleasesOptions = bSADisclosureReleasesOptions();

        request(_bSADisclosureReleasesOptions, bSADisclosureReleasesSuccess);

        function bSADisclosureReleasesSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = _candidateObj.candidate;
                _res.data.bSADisclosureReleases = response.body;
                resolve(_res);
            }
        }

        function bSADisclosureReleasesOptions() {
            return {
                method: 'POST',
                url: DataPower.url + DataPower.Models.candidate +
                    '/' + _candidateObj.id + '/' + DataPower.Models.bSADisclosureRelease,
                headers: setOption(headers.authorization),
                body: _candidateObj.bSADisclosureReleases,
                json: true
            }
        }
    })

    // Create form status using Candidate_Id
    formStatus = _candidateObj => new Promise((resolve, reject) => {
        var _formStatusOptions = formStatusOptions();

        request(_formStatusOptions, formStatusSuccess);

        function formStatusSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = _candidateObj.candidate;
                _res.data.formStatus = response.body;
                resolve(_res);
            }
        }

        function formStatusOptions() {
            return {
                method: 'POST',
                url: DataPower.url + DataPower.Models.candidate +
                    '/' + _candidateObj.id + '/' + DataPower.Models.formStatus,
                headers: setOption(headers.authorization),
                body: _candidateObj.formStatus,
                json: true
            }
        }
    })

    // Call candidate API
    candidate.then(candidateIdSuccess, onrejected);

    // candidate created successfull
    function candidateIdSuccess(candidate) {
        var _candidateObj = {};

        if (candidate.statusCode === 200) {
            _candidateObj.id = candidate.data.id;
            _candidateObj.employmentDetails = args.EmploymentDetails;
            _candidateObj.candidateAttachments = args.CandidateAttachments;
            _candidateObj.bSADisclosureReleases = args.BSADisclosureReleases;
            _candidateObj.formStatus = args.FormStatuses;
            _candidateObj.candidate = candidate.data;
            Promise.all([
                employmentDetails(_candidateObj),
                candidateAttachments(_candidateObj),
                bSADisclosureReleases(_candidateObj),
                formStatus(_candidateObj)
            ]).then((result) => {
                return res.status(200).json(result[1]);
            }).catch(err => {
                return res.status(401).json(err);
            });
        } else {
            return res.status(candidate.statusCode).json(candidate.data);
        }
    }

    function onfulfilled(object) {
        return res.status(object.statusCode).json(object.data);
    }

    // Candidate options
    function candidateOptions() {
        var _args = extend({}, args);
        delete _args.EmploymentDetails;
        delete _args.CandidateAttachments;
        delete _args.BSADisclosureReleases;
        delete _args.FormStatuses;
        _args.Updated_At = new Date();
        _args.Created_At = new Date();
        return {
            method: 'POST',
            url: DataPower.url + DataPower.Models.candidate,
            headers: setOption(headers.authorization),
            body: _args,
            json: true
        };
    }

    // Encounters Error
    function onrejected(error) {
        return res.status(401).json(error);
    }
}

/* 1) Update Candidate, Employment details & candidate attachment
 *    based on candidate Id.
 * 2) Create employment details if not existed using update api.
 */
exports.edit = function candidateEdit(headers, args, res) {

    var candidateOptions = candidateOptions();
    var candidate;
    var employmentDetails;
    var candidateAttachment;
    var bsaDisclosureReleases;

    // Update candidate using Candidate_Id
    candidate = new Promise((resolve, reject) => {
        request(candidateOptions, candidateSuccess)

        function candidateSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = response.body;
                resolve(_res);
            }
        }
    })

    // Update employment Details using Candidate_Id
    employmentDetails = _employmentDetails => new Promise((resolve, reject) => {
        var _employmentDetailsUpsertOptions = employmentDetailsUpsertOptions();

        request(_employmentDetailsUpsertOptions, _employmentDetailsSuccess);

        function _employmentDetailsSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = response.body;
                resolve(_res);
            }
        }

        function employmentDetailsUpsertOptions() {
            return {
                method: 'POST',
                url: DataPower.url + DataPower.Models.employmentDetails +
                    '/' + 'upsertEmploymentDetails',
                headers: setOption(headers.authorization),
                body: _employmentDetails,
                json: true
            }
        }
    })

    // Update bsaDisclosure Details based on Candidate_Id
    bsaDisclosureReleases = _bsaDisclosureReleases => new Promise((resolve, reject) => {
        var _bsaDisclosureDetailsOptions = bsaDisclosureDetailsOptions();

        request(_bsaDisclosureDetailsOptions, _bsaDisclosureDetailsSuccess)

        function _bsaDisclosureDetailsSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = response.body;
                resolve(_res);
            }
        }

        function bsaDisclosureDetailsOptions() {
            return {
                method: 'PUT',
                url: DataPower.url + DataPower.Models.candidate +
                    '/' + _bsaDisclosureReleases.Candidate_ID +
                    '/' + DataPower.Models.bSADisclosureRelease +
                    '/' + _bsaDisclosureReleases.id,
                headers: setOption(headers.authorization),
                body: _bsaDisclosureReleases,
                json: true
            }
        }
    })

    // Update candidate attachment using Candidate_Id
    candidateAttachment = _candidateAttachment => new Promise((resolve, reject) => {
        var _candidateAttachmentOptions = candidateAttachmentOptions();

        request(_candidateAttachmentOptions, _candidateAttachmentSuccess)

        function _candidateAttachmentSuccess(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error) {
                _res.data = error;
                reject(_res);
            } else {
                _res.data = response.body;
                resolve(_res);
            }
        }

        function candidateAttachmentOptions() {
            return {
                method: 'PUT',
                url: DataPower.url + DataPower.Models.candidate +
                    '/' + _candidateAttachment.Candidate_ID +
                    '/' + DataPower.Models.candidateAttachment +
                    '/' + _candidateAttachment.id,
                headers: setOption(headers.authorization),
                body: _candidateAttachment,
                json: true
            }
        }
    })

    // Call candidate API
    var editPromiseArray = [
        candidate
    ];

    for (var i = 0; i < args.EmploymentDetails.length; i++) {
        editPromiseArray.push(employmentDetails(args.EmploymentDetails[i]));
    }

    for (var i = 0; i < args.CandidateAttachments.length; i++) {
        editPromiseArray.push(candidateAttachment(args.CandidateAttachments[i]));
    }

    for (var i = 0; i < args.BSADisclosureReleases.length; i++) {
        editPromiseArray.push(bsaDisclosureReleases(args.BSADisclosureReleases[i]));
    }

    Promise.all(editPromiseArray)
        .then(values => {
            var candidate = values[0];
            var _response = {};
            _response = parseString(candidate.data);

            if (candidate.statusCode === 200) {
                var employmentDetailsValues = [];
                for (var i = 1; i <= args.EmploymentDetails.length; i++) {
                    employmentDetailsValues.push(values[i].data);
                }

                var candidateAttachmentValues = [];
                for (var i = args.EmploymentDetails.length + 1; i < values.length; i++) {
                    candidateAttachmentValues.push(values[i].data);
                }

                var bsaDisclosureValues = [];
                for (var i = args.EmploymentDetails.length + 2; i < values.length; i++) {
                    bsaDisclosureValues.push(values[i].data);
                }
                _response.employmentDetails = employmentDetailsValues;
                _response.candidateAttachment = candidateAttachmentValues[0];
                _response.bsaDisclosureReleases = bsaDisclosureValues;
            }

            return res.status(candidate.statusCode).json(_response);
        }).catch(reason => {
            return res.status(401).json(reason);
        })

    function onfulfilled(object) {
        return res.status(object.statusCode).json(object.data);
    }

    // candidate options
    function candidateOptions() {
        var _args = extend({}, args);
        delete _args.EmploymentDetails;
        delete _args.CandidateAttachments;
        delete _args.BSADisclosureReleases;
        _args.Updated_At = new Date()
        return {
            method: 'PATCH', // Update object. Not for replace
            url: DataPower.url + DataPower.Models.candidate + '/' + _args.id,
            headers: setOption(headers.authorization),
            body: _args,
            json: true
        }
    }

    // Encounters Error
    function onrejected(error) {
        return res.status(401).json(error);
    }
}