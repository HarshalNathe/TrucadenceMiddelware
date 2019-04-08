'use strict'
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var extend = require('util')._extend;
var async = require('async');

/* Create a new record of member alongwith candidate attachment.
 */

exports.create = function memberAdd(headers, args, res) {

  var memberDetails = memberDetails();
  var member;
  var candidateAttachment;

  member = new Promise((resolve, reject) => {
    request(memberDetails, memberSuccess);

    function memberSuccess(error, response, body) {
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
        _res.data = _candidateObj.member;
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

  // Call member application API
  member.then(candidateIdSuccess, onrejected);

  // member application created successfull
  function candidateIdSuccess(member) {
    var _candidateObj = {};

    if (member.statusCode === 200) {
      _candidateObj.id = member.data.Candidate_Id;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.member = member.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(member.statusCode).json(member.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function memberDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'POST',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_Id + '/' + DataPower.Models.memberApplication,
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

/** Get member information alongwith candidate attachments */

exports.get = function memberFetch(headers, args, res) {
  var _qs = {
    'filter[where][Attachment_Type_ID]': args.AttachmentTypeID.value,
    'filter[where][Form_Master_ID]': args.FormMasterID.value
  };
  var includeMember = args.candidateId.value ? '/' +
    DataPower.Models.memberApplication : '';

  var param = args.candidateId.value ? '/' + args.candidateId.value +
  includeMember : getParams(_qs);

  var includeAttachment = args.candidateId.value ? '/' +
    DataPower.Models.candidateAttachment : '';

  var params = args.candidateId.value ? '/' + args.candidateId.value +
    includeAttachment + getParams(_qs) : getParams(_qs);

  var memberOptions = memberOptions();
  var memberInfo;

  var candidateAttachmentOptions = candidateAttachmentOptions();
  var pList;

  memberInfo = new Promise((resolve, reject) => {
    request(memberOptions, getMemberOptions);

    function getMemberOptions(error, response, body) {
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

  pList = memberInfo => new Promise((resolve, reject) => {
    request(candidateAttachmentOptions, getList);

    function getList(error, response, body) {
      var _res = {};
      var object = {};

      if (memberInfo) {
        object.MemberDetails = memberInfo;
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

  memberInfo.then(countSuccess, onrejected);

  function countSuccess(memberInfo) {
    pList(memberInfo.data).then(onfulfilled, onrejected);
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  function memberOptions() {
    return {
      method: 'GET',
      url: DataPower.url + DataPower.Models.candidate + param + '?'
           + 'filter[include]=' + 'employers',
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

/* Update existing member alongwith candidate attachment */

exports.edit = function memberUpdate(headers, args, res) {

  var memberDetails = memberDetails();
  var member;
  var candidateAttachment;

  member = new Promise((resolve, reject) => {
    request(memberDetails, onSuccess);

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
        _res.data = _candidateObj.member;
        _res.data.candidateAttachment = arr;
        resolve(_res);
      }
    });
  })

  // Call member API
  member.then(memberSuccess, onrejected);

  // member Updated successfully
  function memberSuccess(member) {
    var _candidateObj = {};

    if (member.statusCode === 200) {
      _candidateObj.id = member.data.Candidate_Id;
      _candidateObj.candidateAttachment = args.CandidateAttachments;
      _candidateObj.member = member.data;
      Promise.all([
        candidateAttachment(_candidateObj),
      ]).then((result) => {
        return res.status(200).json(result);
      }).catch(err => {
        return res.status(401).json(err);
      });
    } else {
      return res.status(member.statusCode).json(member.data);
    }
  }

  function onfulfilled(object) {
    return res.status(object.statusCode).json(object.data);
  }

  // CandidateAttachments options
  function memberDetails() {
    var _args = extend({}, args);
    delete _args.CandidateAttachments;

    return {
      method: 'PUT',
      url: DataPower.url + DataPower.Models.candidate +
        '/' + args.Candidate_Id +
        '/' + DataPower.Models.memberApplication +
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
