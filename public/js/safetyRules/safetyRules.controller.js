(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('SafetyRulesController', SafetyRulesController);

  SafetyRulesController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'newCandidateServices',
    'commonService',
    'toastr',
    'candidateAttachmentServices',
    '$q',
    '$timeout',
    'lodash'
  ];

  function SafetyRulesController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    newCandidateServices,
    commonService,
    toastr,
    candidateAttachmentServices,
    $q,
    $timeout,
    _) {
    var vm = this;
    vm.isEdit = false;
    vm.showUpdateButton = false;
    vm.isPreviousSign = false;

    init();

    function init() {
      vm.signature = {
        dataUrl: ''
      };
      getFormMaster('Trucadence Safty Rules', 'Safety_Rules_Signature');

      if ($state.params.candidate.view) {
        vm.isEdit = true;
      }
    }

    // Test comment
    vm.user = $rootScope.user;
    vm.Employee_Name = '';
    vm.AssignedDate = new Date();
    vm.clear = function () {
      var canvas = document.querySelector('canvas');
      var signaturePad = new SignaturePad(canvas);

      // Clears the canvas
      signaturePad.clear();
      vm.signature.dataUrl = '';
      vm.signPadDisable = false;
    };

    vm.goToCandidateDetail = function () {
      $state.go('app.candidateDetail', {
        candidateID: $state.params.candidate.id
      });
    };

    vm.edit = function () {
      vm.isEdit = false;
      vm.showUpdateButton = true;
      vm.promise = $timeout(function () { }, 200);
    };

    vm.usePreviousSign = function () {
      if (vm.isPreviousSign) {
        vm.signature.dataUrl = vm.candidatDetails.candidateAttachments[0]
          .Metadata_URL;
        vm.getImage = function () {
          return vm.candidatDetails.candidateAttachments[0]
            .Metadata_URL;
        };
      } else {
        vm.signature.dataUrl = '';
      }
    };

    function getFormMaster(formName, attacmentTypeName) {
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getFormMaster(formName)
        .then(function (data) {
          if (data.status === 200) {
            vm.formId = data.data[0].id;
            deferred.resolve(data.data);
            getAttachmentType(attacmentTypeName);
          } else {
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    function getAttachmentType(attachmentType) {
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getAttachmentType(attachmentType)
        .then(function (data) {
          if (data.status === 200) {
            vm.attachmentTypeId = data.data[0].id;
            deferred.resolve(data.data);
            getAttachments();
            getCandidateDetail();
          } else {
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    function getCandidateDetail() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: $state.params.attachmentTypeId,
        FormMasterID: $state.params.formId
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCandidatDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.candidatDetails = data.data;
            deferred.resolve(data.data);
          } else {
            commonService.showSnackbar('error', 'Error While getting Candidate details', data.status);
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    function getAttachments() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: vm.attachmentTypeId,
        FormMasterID: vm.formId
      };
      vm.promise = candidateAttachmentServices.getCandidateAttachments(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.attachments = data.data;
            vm.AssignedDate = vm.attachments[0].
              Attachment_Date;
            vm.Employee_Name = vm.attachments[0].
              Employee_Name;
            vm.getImage = function () {
              return vm.attachments[0]
                .Metadata_URL;
            };
          } else {
            commonService.showSnackbar('error', 'Error While geting SaftyRules details', data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    vm.update = function () {
      var sendData = {
        id: vm.attachments[0].id,
        Candidate_ID: $state.params.candidate.id,
        Attachment_Type_ID: vm.attachmentTypeId,
        Attachment_Date: vm.AssignedDate,
        Metadata_URL: vm.signature.dataUrl,
        Form_Master_ID: vm.formId,
        Employee_Name: vm.Employee_Name
      };

      if (vm.isPreviousSign) {
        sendData.Metadata_URL =
          vm.candidatDetails.candidateAttachments[0].Metadata_URL;
      }

      vm.promise = candidateAttachmentServices
        .updateCandidateAttachments(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'SaftyRules details updated sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While updating SaftyRules details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While updating SaftyRules details', response.status);
        });
    };

    vm.submit = function () {
      var sendData = {
        Candidate_ID: $state.params.candidate.id,
        Attachment_Type_ID: vm.attachmentTypeId,
        Attachment_Date: vm.AssignedDate,
        Metadata_URL: vm.signature.dataUrl,
        Form_Master_ID: vm.formId,
        Employee_Name: vm.Employee_Name
      };

      if (vm.isPreviousSign) {
        sendData.Metadata_URL =
          vm.candidatDetails.candidateAttachments[0].Metadata_URL;
      }

      vm.promise = candidateAttachmentServices
        .saveCandidateAttachments(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            var param = {
              id: $state.params.candidateID || $state.params.candidate.id,
              formId: vm.formId,
              attachmentTypeId: vm.attachmentTypeId,
              view: false
            };
            $state.go('app.selfIdentification', {
              candidate: param
            });
            commonService.showSnackbar('info', 'SaftyRules details added sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While adding SaftyRules details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While adding SaftyRules details', response.status);
        });

      var formStatus = {
        id: vm.candidatDetails.formStatuses[0].id,
        Candidate_ID: vm.candidatDetails.id,
        Is_Safety_Rules_Fill: true,
      };

      vm.promise = newCandidateServices
        .updateFormStatus(_.omitBy(formStatus, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
          }
        }, function (response) {
        });
    };

    vm.cancel = function () {
      $state.go('app.candidateDetail', {
        candidateID: $state.params.candidate.id
      });
    };

    vm.signaturePadDisabled = function () {
      vm.signPadDisable = true;
    };
  }
})();
