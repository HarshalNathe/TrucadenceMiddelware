'use strict';

var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

/*** Find the personalAllowanceWorksheet details based on
 * *  candidateId alongwith candidateAttachments
 */
exports.get = function personalAllowancesWorksheetGet(headers, args, res) {
  var _qs = {
    'filter[where][Attachment_Type_ID]': args.AttachmentTypeID.value,
    'filter[where][Form_Master_ID]': args.FormMasterID.value,
  };
  var includePAWorksheet = args.candidateId.value ? '/' +
    DataPower.Models.personalAllowancesWorksheet : '';

  var param = args.candidateId.value ? '/' + args.candidateId.value +
    includePAWorksheet : getParams(_qs);

  var includeAttachment = args.candidateId.value ? '/' +
    DataPower.Models.candidateAttachment : '';

  var params = args.candidateId.value ? '/' + args.candidateId.value +
    includeAttachment + getParams(_qs) : getParams(_qs);

  var personalAllowancesWorksheetOptions = personalAllowancesWorksheetOptions();
  var personalAllowancesWorksheet;

  var candidateAttachmentOptions = candidateAttachmentOptions();
  var pList;

  personalAllowancesWorksheet = new Promise((resolve, reject) => {
    request(personalAllowancesWorksheetOptions, getPersonalAllowancesWorksheetOptions);

    function getPersonalAllowancesWorksheetOptions(error, response, body) {
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

  pList = personalAllowancesWorksheet => new Promise((resolve, reject) => {
    request(candidateAttachmentOptions, getList);

    function getList(error, response, body) {
      var _res = {};
      var object = {};

      if (personalAllowancesWorksheet) {
        object.personalAllowancesWorksheets = personalAllowancesWorksheet;
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

  personalAllowancesWorksheet.then(countSuccess, onrejected);

  function countSuccess(personalAllowancesWorksheet) {
    pList(personalAllowancesWorksheet.data).then(onfulfilled, onrejected);
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  function personalAllowancesWorksheetOptions() {
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

  // Encounters Error
  function onrejected(error) {
    return res.status(401).json(error);
  }
}

/** Create personalAllowancesWorksheet details
 *   alongwith candidateAttachment
 */
exports.create = function personalAllowancesCreate(headers, args, res) {

  var personalAllowancesWorksheetDetails = personalAllowancesWorksheetDetails();
  var personalAllowances;
  var candidateAttachment;

  personalAllowances = new Promise((resolve, reject) => {
    request(personalAllowancesWorksheetDetails, personalAllowancesSuccess);

    function personalAllowancesSuccess(error, response, body) {
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
        _res.data = _candidateObj.personalAllowances;
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

  // Call personalAllowances API
  personalAllowances.then(candidateIdSuccess, onrejected);

  // personalAllowances created successfull
  function candidateIdSuccess(personalAllowances) {
    var _candidateObj = {};

    if (personalAllowances.statusCode === 200) {
      _candidateObj.id = personalAllowances.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.personalAllowances = personalAllowances.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(personalAllowances.statusCode).json(personalAllowances.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function personalAllowancesWorksheetDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'POST',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID + '/' + DataPower.Models.personalAllowancesWorksheet,
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



/** Update personal allowances worksheet alongwith candidate
 *  attachments
 */
exports.edit = function personalAllowancesEdit(headers, args, res) {

  var personalAllowanceDetails = personalAllowanceDetails();
  var allowances;
  var candidateAttachment;

  allowances = new Promise((resolve, reject) => {
    request(personalAllowanceDetails, allowancesSuccess);

    function allowancesSuccess(error, response, body) {
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
        _res.data = _candidateObj.allowances;
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

  // Call personal allowances worksheet API
  allowances.then(allowanceSuccess, onrejected);

  // personal allowances worksheet created successfull
  function allowanceSuccess(allowances) {
    var _candidateObj = {};

    if (allowances.statusCode === 200) {
      _candidateObj.id = allowances.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.allowances = allowances.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(allowances.statusCode).json(allowances.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function personalAllowanceDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'PUT',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID + '/' + DataPower.Models.personalAllowancesWorksheet +
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