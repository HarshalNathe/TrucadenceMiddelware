'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

exports.get = function eeoSelfIdentificationGet(headers, args, res) {
  var _qs = {
    'filter[where][Attachment_Type_ID]': args.AttachmentTypeID.value,
    'filter[where][Form_Master_ID]': args.FormMasterID.value,
  };
  var includeSelfIdentification = args.candidateId.value ? '/' +
    DataPower.Models.eeoSelfIdentification : '';

  var param = args.candidateId.value ? '/' + args.candidateId.value +
    includeSelfIdentification : getParams(_qs);

  var includeAttachment = args.candidateId.value ? '/' +
    DataPower.Models.candidateAttachment : '';

  var params = args.candidateId.value ? '/' + args.candidateId.value +
    includeAttachment + getParams(_qs) : getParams(_qs);

  var selfIdentificationOptions = selfIdentificationOptions();
  var eeoselfIdentification;

  var candidateAttachmentOptions = candidateAttachmentOptions();
  var pList;

  eeoselfIdentification = new Promise((resolve, reject) => {
    request(selfIdentificationOptions, getSelfIdentificationOptions);

    function getSelfIdentificationOptions(error, response, body) {
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

  pList = eeoselfIdentification => new Promise((resolve, reject) => {
    request(candidateAttachmentOptions, getList);

    function getList(error, response, body) {
      var _res = {};
      var object = {};

      if (eeoselfIdentification) {
        object.EEOSelfIdentification = eeoselfIdentification;
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

  eeoselfIdentification.then(countSuccess, onrejected);

  function countSuccess(eeoselfIdentification) {
    pList(eeoselfIdentification.data).then(onfulfilled, onrejected);
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  function selfIdentificationOptions() {
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

exports.create = function eeoSelfIdentificationCreate(headers, args, res) {

  var selfIdentificationDetails = selfIdentificationDetails();
  var selfIdentification;
  var candidateAttachment;

  selfIdentification = new Promise((resolve, reject) => {
    request(selfIdentificationDetails, patientSuccess);

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
        _res.data = _candidateObj.selfIdentification;
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

  // Call selfIdentification API
  selfIdentification.then(candidateIdSuccess, onrejected);

  // selfIdentification created successfull
  function candidateIdSuccess(selfIdentification) {
    var _candidateObj = {};

    if (selfIdentification.statusCode === 200) {
      _candidateObj.id = selfIdentification.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.selfIdentification = selfIdentification.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(selfIdentification.statusCode).json(selfIdentification.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function selfIdentificationDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'POST',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID + '/' + DataPower.Models.eeoSelfIdentification,
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

/* Update eeoSelfIdentification Alongwith candidateAttachment */
exports.edit = function eeoSelfIdentificationUpdate(headers, args, res) {

  var selfIdentificationDetails = selfIdentificationDetails();
  var selfIdentification;
  var candidateAttachment;

  selfIdentification = new Promise((resolve, reject) => {
    request(selfIdentificationDetails, onSuccess);

    function onSuccess(error, response, body) {
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
        _res.data = _candidateObj.selfIdentification;
        _res.data.candidateAttachment = response.body;
        resolve(_res);
      }
    }

    function candidateAttachmentOptions() {
      return {
        method: 'PUT',
        url: DataPower.url + DataPower.Models.candidate +
          '/' + _candidateObj.id + '/' + DataPower.Models.candidateAttachment +
          '/' + _candidateObj.candidateAttachment[0].id,
        headers: setOption(headers.authorization),
        body: _candidateObj.candidateAttachment[0],
        json: true
      }
    }
  })

  // Call eeo selfIdentification API
  selfIdentification.then(selfIdentificationSuccess, onrejected);

  // eeo selfIdentification created successfull
  function selfIdentificationSuccess(selfIdentification) {
    var _candidateObj = {};

    if (selfIdentification.statusCode === 200) {
      _candidateObj.id = selfIdentification.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.selfIdentification = selfIdentification.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(selfIdentification.statusCode).json(selfIdentification.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function selfIdentificationDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'PUT',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID +
        '/' + DataPower.Models.eeoSelfIdentification +
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
