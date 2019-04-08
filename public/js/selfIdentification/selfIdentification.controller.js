(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('SelfIdentificationController', SelfIdentificationController);

  SelfIdentificationController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    'selfIdentificationServices',
    'newCandidateServices',
    '$window',
    'commonService',
    'toastr',
    '$q',
    '$timeout',
    'lodash',
    'utilService'
  ];

  function SelfIdentificationController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    selfIdentificationServices,
    newCandidateServices,
    $window,
    commonService,
    toastr,
    $q,
    $timeout,
    _,
    utilService) {
    var vm = this;
    vm.isEdit = false;
    vm.showUpdateButton = false;
    vm.isPreviousSign = false;
    vm.hidePopUp = false;
    vm.securePassword = '';
    vm.ssn = '';
    init();

    function init() {
      vm.signature = {
        dataUrl: ''
      };
      getFormMaster('EEO-1 Self Identification', 'EEO_Signature');

      if ($state.params.candidate.view) {
        vm.isEdit = true;
      }
    }

    // Test comment
    vm.user = $rootScope.user;
    vm.AssignedDate = new Date();
    vm.eeoIdentification = '';
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
            getSelfIdentificationDetails();
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

    function getSelfIdentificationDetails() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: vm.attachmentTypeId,
        FormMasterID: vm.formId
      };
      vm.promise = selfIdentificationServices.getSelfIdentificationDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.selfIdentificationDetails = data.data;
            vm.AssignedDate = vm.selfIdentificationDetails.EEOSelfIdentification[0]
              .EEO_Signature_Date;
            vm.eeoIdentification = vm.selfIdentificationDetails.EEOSelfIdentification[0]
              .Ethnicity;
            vm.Employee_Name = vm.selfIdentificationDetails.CandidateAttachments[0]
              .Employee_Name;
            vm.getImage = function () {
              return vm.selfIdentificationDetails.CandidateAttachments[0]
                .Metadata_URL;
            };
          }
        }, function (response) {
        });
    }

    vm.edit = function () {
      vm.isEdit = false;
      vm.showUpdateButton = true;
      vm.promise = $timeout(function () { }, 200);
    };

    vm.update = function () {
      var sendData = {
        id: vm.selfIdentificationDetails.EEOSelfIdentification[0].id,
        Candidate_ID: $state.params.candidate.id,
        EEO_Signature_Date: vm.AssignedDate,
        Ethnicity: vm.eeoIdentification,
        CandidateAttachments: [{
          id: vm.selfIdentificationDetails.CandidateAttachments[0].id,
          Candidate_ID: $state.params.candidate.id,
          Attachment_Type_ID: vm.attachmentTypeId,
          Attachment_Date: vm.AssignedDate,
          Metadata_URL: vm.signature.dataUrl,
          Form_Master_ID: vm.formId,
          Employee_Name: vm.Employee_Name
        }]
      };

      if (vm.isPreviousSign) {
        sendData.CandidateAttachments[0].Metadata_URL =
          vm.candidatDetails.candidateAttachments[0].Metadata_URL;
      }

      vm.promise = selfIdentificationServices
        .updateSelfidentificationDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'Selfidentification details added sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While adding Selfidentification details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While adding Selfidentification details', response.status);
        });
    };

    vm.submit = function () {
      var sendData = {
        Candidate_ID: $state.params.candidate.id,
        EEO_Signature_Date: vm.AssignedDate,
        Ethnicity: vm.eeoIdentification,
        CandidateAttachments: [{
          Attachment_Type_ID: vm.attachmentTypeId,
          Attachment_Date: vm.AssignedDate,
          Metadata_URL: vm.signature.dataUrl,
          Form_Master_ID: vm.formId,
          Employee_Name: vm.Employee_Name
        }]
      };

      if (vm.isPreviousSign) {
        sendData.CandidateAttachments[0].Metadata_URL =
          vm.candidatDetails.candidateAttachments[0].Metadata_URL;
      }

      vm.promise = selfIdentificationServices
        .saveSelfidentificationDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            var param = {
              id: $state.params.candidateID || $state.params.candidate.id,
              formId: vm.formId,
              attachmentTypeId: vm.attachmentTypeId,
              view: false
            };
            $state.go('app.illinois', {
              candidate: param
            });
            commonService.showSnackbar('info', 'Selfidentification details added sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While adding Selfidentification details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While adding Selfidentification details', response.status);
        });

      var formStatus = {
        id: vm.candidatDetails.formStatuses[0].id,
        Candidate_ID: vm.candidatDetails.id,
        Is_SelfIdentification_Fill: true,
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

    vm.getSecurePassword = function () {
      var userData = JSON.parse(localStorage.getItem('userData'));
      var listParam = {
        userId: userData.user[0].id,
        secureFieldPassword: vm.securePassword
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getsecurefieldpassword(listParam)
        .then(function (data) {
          if (utilService.checkSecurePassword(vm.securePassword)) {
            vm.userDetails = data.data;
            vm.hidePopUp = true;
            vm.ssn = vm.candidatDetails.Social_Security_Number;
            deferred.resolve(data.data);
          } else {
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          if (utilService.checkSecurePassword(vm.securePassword)) {
            vm.hidePopUp = true;
            vm.ssn = vm.candidatDetails.Social_Security_Number;
            deferred.resolve(response.data);
          } else {
            toastr.error('Please enter valid secure password.');
            deferred.reject(response.data);
          }
        });
    };

    vm.cancel = function () {
      $state.go('app.candidateDetail', {
        candidateID: $state.params.candidate.id
      });
    };

    vm.close = function () {
      vm.ssn = '';
      vm.hidePopUp = false;
      vm.securePassword = '';
    };

    vm.signaturePadDisabled = function () {
      vm.signPadDisable = true;
    };
  }
})();
