'use strict';
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;
var async = require('async');
/* Fetch the employmentEligibility verification alongwith
 * candidate attachment.
*/
exports.get = function eligibilityVerificationGet(headers, args, res) {
  var _qs = {
    'filter[where][Attachment_Type_ID]': args.AttachmentTypeID.value,
    'filter[where][Form_Master_ID]': args.FormMasterID.value,
  };
  var includeVerification = args.candidateId.value ? '/' +
    DataPower.Models.employmentEligibilityVerification : '';

  var param = args.candidateId.value ? '/' + args.candidateId.value +
    includeVerification : getParams(_qs);

  var includeAttachment = args.candidateId.value ? '/' +
    DataPower.Models.candidateAttachment : '';

  var params = args.candidateId.value ? '/' + args.candidateId.value +
    includeAttachment + getParams(_qs) : getParams(_qs);

  var verificationOptions = verificationOptions();
  var eligibilityVerification;

  var candidateAttachmentOptions = candidateAttachmentOptions();
  var pList;

  eligibilityVerification = new Promise((resolve, reject) => {
    request(verificationOptions, getverificationOptions);

    function getverificationOptions(error, response, body) {
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

  pList = eligibilityVerification => new Promise((resolve, reject) => {
    request(candidateAttachmentOptions, getList);

    function getList(error, response, body) {
      var _res = {};
      var object = {};

      if (eligibilityVerification) {
        object.EligibilityVerification = eligibilityVerification;
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

  eligibilityVerification.then(countSuccess, onrejected);

  function countSuccess(eligibilityVerification) {
    pList(eligibilityVerification.data).then(onfulfilled, onrejected);
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  function verificationOptions() {
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

/* Create a new record of eligibility verification &
  * candidate attachment.
 */
exports.create = function eligibilityVerificationCreate(headers, args, res) {

  var verificationDetails = verificationDetails();
  var verification;
  var candidateAttachment;

  verification = new Promise((resolve, reject) => {
    request(verificationDetails, verificationSuccess);

    function verificationSuccess(error, response, body) {
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
        _res.data = _candidateObj.verification;
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

  // Call employment eligibility verification API
  verification.then(candidateIdSuccess, onrejected);

  // employment eligibility verification created successfull
  function candidateIdSuccess(verification) {
    var _candidateObj = {};

    if (verification.statusCode === 200) {
      _candidateObj.id = verification.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.verification = verification.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(verification.statusCode).json(verification.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function verificationDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'POST',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID + '/' + DataPower.Models.employmentEligibilityVerification,
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

/* Update employment eligibility verification Alongwith candidateAttachment */
exports.edit = function eligibilityVerificationUpdate(headers, args, res) {

  var verificationDetails = verificationDetails();
  var verification;
  var candidateAttachment;

  verification = new Promise((resolve, reject) => {
    request(verificationDetails, onSuccess);

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

  // Update candidateAttachment details using Candidate_Id
  candidateAttachment = _candidateObj => new Promise((resolve, reject) => {
    var arr = [];
    async.each(_candidateObj.candidateAttachment, function (eachAttachment, callback) {
      if (eachAttachment.id) {
        var options = {
          method: 'PUT',
          url: DataPower.url + DataPower.Models.candidate +
            '/' + _candidateObj.id + '/' + DataPower.Models.candidateAttachment +
            '/' + eachAttachment.id,
          headers: setOption(headers.authorization),
          body: eachAttachment,
          json: true
        };
        request(options, function (err, attachmentData) {
          if (err) {
            console.log(err);
          }
          arr.push(attachmentData.body);
          callback();
        });
      }
      else {
        var options = {
          method: 'POST',
          url: DataPower.url + DataPower.Models.candidate +
            '/' + _candidateObj.id + '/' + DataPower.Models.candidateAttachment,
          headers: setOption(headers.authorization),
          body: eachAttachment,
          json: true
        };
        request(options, function (err, attachmentData) {
          if (err) {
            console.log(err);
          }
          arr.push(attachmentData.body);
          callback();
        });
      }
    }, function (err) {
      if (err) {
        console.log('A file failed to process');
      } else {
        var _res = {};
        _res.data = _candidateObj.verification;
        _res.data.candidateAttachment = arr;
        resolve(_res);
      }
    });
  })

  // Call employment eligibility verification API
  verification.then(verificationSuccess, onrejected);

  // employment eligibility verification Updated successfully
  function verificationSuccess(verification) {
    var _candidateObj = {};

    if (verification.statusCode === 200) {
      _candidateObj.id = verification.data.Candidate_ID;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.verification = verification.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(verification.statusCode).json(verification.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function verificationDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'PUT',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_ID +
        '/' + DataPower.Models.employmentEligibilityVerification +
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
