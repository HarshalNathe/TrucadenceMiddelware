'use strict'
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');

exports.get = function fetchCandidateAttachment(headers, args, res) {

    var _qs = {
        'filter[where][Attachment_Type_ID]': args.AttachmentTypeID.value,
        'filter[where][Form_Master_ID]': args.FormMasterID.value,
        'filter[where][Document_List_ID]': args.DocumentListID.value,
    };

    var includeAttachment = args.candidateId.value ? '/' +
        DataPower.Models.candidateAttachment : '';

    var params = args.candidateId.value ? '/' + args.candidateId.value +
        includeAttachment + getParams(_qs) : getParams(_qs);

    var options = {
        method: 'GET',
        url: DataPower.url + DataPower.Models.candidate + params,
        headers: setOption(headers.authorization)
    };

    request(options, function (error, response, body) {
        if (error) {
            return res.status(response.statusCode).json(JSON.stringify(error));
        }
        return res.status(response.statusCode).json(JSON.parse(body));
    })
}

exports.post = function createCandidateAttachment(headers, args, res) {

    var includeAttachment = args.Candidate_ID ? '/' +
        DataPower.Models.candidateAttachment : '';

    var params = args.Candidate_ID ? '/' + args.Candidate_ID +
        includeAttachment : '';

    var options = {
        method: 'POST',
        url: DataPower.url + DataPower.Models.candidate + params,
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

/* Update candidate Attachment based on candidateId */
exports.edit = function EditCandidateAttachment(headers, args, res) {

    var includeAttachment = args.Candidate_ID ? '/' +
        DataPower.Models.candidateAttachment : '';

    var params = args.Candidate_ID ? '/' + args.Candidate_ID +
        includeAttachment : '';

    var options = {
        method: 'PUT',
        url: DataPower.url + DataPower.Models.candidate + params +
            '/' + args.id,
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

/* Get candidateAttachment based on candidateAttachementId & candidateId */
exports.deleteById = function deleteCandidateAttachmentById(headers, args, res) {

    var options = {
        method: 'DELETE',
        url: DataPower.url + DataPower.Models.candidate + '/' + args.candidateId.value + '/' + DataPower.Models.candidateAttachment + '/' + args.candidateAttachmentId.value,
        headers: setOption(headers.authorization)
    };

    request(options, function (error, response, body) {
        if (error) {
            return res.status(response.statusCode).json(JSON.stringify(error));
        }

        return res.json('Record has been deleted');
    })
}