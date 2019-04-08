'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

exports.get = function bsaDisclosureReleaseGet(headers, args, res) {
  var _qs = {
    'filter[where][Attachment_Type_ID]': args.AttachmentTypeID.value,
    'filter[where][Form_Master_ID]': args.FormMasterID.value,
  };
  var includeBSADisclosureRelease = args.candidateId.value ? '/' 
    + DataPower.Models.bSADisclosureRelease : '';

  var param = args.candidateId.value ? '/' + args.candidateId.value 
    + includeBSADisclosureRelease : getParams(_qs);

  var includeAttachment = args.candidateId.value ? '/' 
    + DataPower.Models.candidateAttachment : '';

  var params = args.candidateId.value ? '/' + args.candidateId.value 
    + includeAttachment + getParams(_qs) : getParams(_qs);

  var bsaDisclosureReleaseOptions = bsaDisclosureReleaseOptions();
  var bsaDisclosureRelease;

  var candidateAttachmentOptions = candidateAttachmentOptions();
  var pList;

  bsaDisclosureRelease = new Promise((resolve, reject) => {
    request(bsaDisclosureReleaseOptions, getBSADisclosureReleaseOptions);

    function getBSADisclosureReleaseOptions(error, response, body) {
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

  pList = bsaDisclosureRelease => new Promise((resolve, reject) => {
    request(candidateAttachmentOptions, getList);

    function getList(error, response, body) {
      var _res = {};
      var object = {};

      if (bsaDisclosureRelease) {
        object.BSADisclosureRelease = bsaDisclosureRelease;
      }

      _res.statusCode = response.statusCode;
      if (error) {
        _res.data = JSON.parse(error);
        reject(_res);
      } else {
        object.CandidateAttachments = JSON.parse(body);
        _res.data = object;
        resolve(_res);
      }
    }
  })

  bsaDisclosureRelease.then(countSuccess, onrejected);

  function countSuccess(bsaDisclosureRelease) {
    pList(bsaDisclosureRelease.data).then(onfulfilled, onrejected);
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  function bsaDisclosureReleaseOptions() {
    return {
      method: 'GET',
      url: DataPower.url + DataPower.Models.candidate + param,
      headers: setOption(headers.authorization)
    }
  }

  function candidateAttachmentOptions() {
    return {
      method: 'GET',
      url: DataPower.url + DataPower.Models.candidate + params,
      headers: setOption(headers.authorization)
    }
  }

  // Error handel
  function onrejected(error) {
    return res.status(401).json(error);
  }

}

exports.create = function bsaDisclosureReleasePost(headers, args, res) {

  var bsaDisclosureReleaseDetails = bsaDisclosureReleaseDetails();
  var bsaDisclosureRelease;
  var candidateAttachment;

  bsaDisclosureRelease = new Promise((resolve, reject) => {
    request(bsaDisclosureReleaseDetails, bsaDisclosureReleaseSuccess);

    function bsaDisclosureReleaseSuccess(error, response, body) {
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

  // Create candidateAttachment details using Candidate_Id
  candidateAttachment = _candidateObj => new Promise((resolve, reject) => {
    var _candidateAttachmentOptions = candidateAttachmentOptions();

    request(_candidateAttachmentOptions, candidateAttachmentSuccess);

    function candidateAttachmentSuccess(error, response, body) {
      var _res = {};
      _res.statusCode = response.statusCode;
      if (error) {
        _res.data = error;
        reject(_res);
      } else {
        _res.data = _candidateObj.bsaDisclosureRelease;
        _res.data.candidateAttachment = response.body;
        resolve(_res);
      }
    }

    function candidateAttachmentOptions() {
      return {
        method: 'POST',
        url: DataPower.url + DataPower.Models.candidate +
          '/' + _candidateObj.id + '/' + DataPower.Models.candidateAttachment,
        headers: setOption(headers.authorization),
        body: _candidateObj.candidateAttachment,
        json: true
      }
    }
  })

  // Call bsaDisclosureRelease API
  bsaDisclosureRelease.then(candidateIdSuccess, onrejected);

  // bsaDisclosureRelease created successfull
  function candidateIdSuccess(bsaDisclosureRelease) {
    var _candidateObj = {};

    if (bsaDisclosureRelease.statusCode === 200) {
      _candidateObj.id = bsaDisclosureRelease.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.bsaDisclosureRelease = bsaDisclosureRelease.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(bsaDisclosureRelease.statusCode).json(bsaDisclosureRelease.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function bsaDisclosureReleaseDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'PUT',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID + '/' + DataPower.Models.bSADisclosureRelease + 
        '/' + args.id,
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