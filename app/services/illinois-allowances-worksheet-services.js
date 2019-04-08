'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;

exports.get = function illinoisAllowancesWorksheetGet(headers, args, res) {
  var _qs = {
    'filter[where][Attachment_Type_ID]': args.AttachmentTypeID.value,
    'filter[where][Form_Master_ID]': args.FormMasterID.value,
  };
  var includeSelfIdentification = args.candidateId.value ? '/' +
    DataPower.Models.illinoisAllowancesWorksheet : '';

  var param = args.candidateId.value ? '/' + args.candidateId.value +
    includeSelfIdentification : getParams(_qs);

  var includeAttachment = args.candidateId.value ? '/' +
    DataPower.Models.candidateAttachment : '';

  var params = args.candidateId.value ? '/' + args.candidateId.value +
    includeAttachment + getParams(_qs) : getParams(_qs);

  var illinoisAllowancesWorksheetOptions = illinoisAllowancesWorksheetOptions();
  var illinoisAllowancesWorksheet;

  var candidateAttachmentOptions = candidateAttachmentOptions();
  var pList;

  illinoisAllowancesWorksheet = new Promise((resolve, reject) => {
    request(illinoisAllowancesWorksheetOptions, getIllinoisAllowancesWorksheetOptions);

    function getIllinoisAllowancesWorksheetOptions(error, response, body) {
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

  pList = illinoisAllowancesWorksheet => new Promise((resolve, reject) => {
    request(candidateAttachmentOptions, getList);

    function getList(error, response, body) {
      var _res = {};
      var object = {};

      if (illinoisAllowancesWorksheet) {
        object.IllinoisAllowancesWorksheets = illinoisAllowancesWorksheet;
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

  illinoisAllowancesWorksheet.then(countSuccess, onrejected);

  function countSuccess(illinoisAllowancesWorksheet) {
    pList(illinoisAllowancesWorksheet.data).then(onfulfilled, onrejected);
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  function illinoisAllowancesWorksheetOptions() {
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

exports.create = function illinoisAllowancesGet(headers, args, res) {

  var illinoisAllowancesWorksheetDetails = illinoisAllowancesWorksheetDetails();
  var illinoisAllowances;
  var candidateAttachment;

  illinoisAllowances = new Promise((resolve, reject) => {
    request(illinoisAllowancesWorksheetDetails, illinoisAllowancesSuccess);

    function illinoisAllowancesSuccess(error, response, body) {
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
        _res.data = _candidateObj.illinoisAllowances;
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

  // Call illinoisAllowances API
  illinoisAllowances.then(candidateIdSuccess, onrejected);

  // illinoisAllowances created successfull
  function candidateIdSuccess(illinoisAllowances) {
    var _candidateObj = {};

    if (illinoisAllowances.statusCode === 200) {
      _candidateObj.id = illinoisAllowances.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.illinoisAllowances = illinoisAllowances.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(illinoisAllowances.statusCode).json(illinoisAllowances.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function illinoisAllowancesWorksheetDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'POST',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID + '/' + DataPower.Models.illinoisAllowancesWorksheet,
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

/* Update illinois allowances worksheet alongwith
 * candidate attachment
 */
exports.update = function illinoisAllowancesUpdate(headers, args, res) {

  var illinoisAllowancesDetails = illinoisAllowancesDetails();
  var illinoisAllowances;
  var candidateAttachment;

  illinoisAllowances = new Promise((resolve, reject) => {

    request(illinoisAllowancesDetails, onSuccess);

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
        _res.data = _candidateObj.illinoisAllowances;
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

  // Call illinoisAllowances API
  illinoisAllowances.then(illinoisAllowancesSuccess, onrejected);

  // illinoisAllowances created successfull
  function illinoisAllowancesSuccess(illinoisAllowances) {
    var _candidateObj = {};

    if (illinoisAllowances.statusCode === 200) {
      _candidateObj.id = illinoisAllowances.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.illinoisAllowances = illinoisAllowances.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(illinoisAllowances.statusCode).json(illinoisAllowances.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function illinoisAllowancesDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'PUT',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID +
        '/' + DataPower.Models.illinoisAllowancesWorksheet +
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