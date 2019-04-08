(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('DrugTestingController', DrugTestingController);

  DrugTestingController.$inject = [
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
    'bsaDisclosureServices',
    'candidateAttachmentServices',
    '$q',
    '$timeout',
    'lodash'
  ];

  function DrugTestingController(
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
    bsaDisclosureServices,
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
      getFormMaster('Drug Testing', 'Drug_Testing_Signature');

      if ($state.params.candidate.view) {
        vm.isEdit = true;
      }
    }

    // Test comment
    vm.user = $rootScope.user;
    vm.Is_ConsumerReport_Available = '';
    vm.Is_ConsumerReport_Provided = '';
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
            getBsaDisclosureDetails();
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

    function getBsaDisclosureDetails() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: vm.attachmentTypeId,
        FormMasterID: vm.formId
      };
      vm.promise = bsaDisclosureServices.getBsaDisclosureDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.bsaDisclosureDetails = data.data;
            vm.Company_Representative_Name = vm.bsaDisclosureDetails.BSADisclosureRelease[0].
              Company_Representative_Name;

            if (vm.bsaDisclosureDetails.CandidateAttachments.length > 0) {
              vm.AssignedDate = vm.bsaDisclosureDetails.CandidateAttachments[0].
                Attachment_Date;
              vm.Employee_Name = vm.bsaDisclosureDetails.CandidateAttachments[0].
                Employee_Name;
              vm.getImage = function () {
                return vm.bsaDisclosureDetails.CandidateAttachments[0]
                  .Metadata_URL;
              };
            }
          } else {
            commonService.showSnackbar('error', 'Error While geting DrugTesting details', data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    vm.update = function () {
      var sendData = {
        Candidate_ID: $state.params.candidate.id,
        id: vm.bsaDisclosureDetails.BSADisclosureRelease[0].id,
        Company_Representative_Name: vm.Company_Representative_Name,
        CandidateAttachments: [{
          id: vm.bsaDisclosureDetails.CandidateAttachments[0].id,
          Attachment_Type_ID: vm.attachmentTypeId,
          Attachment_Date: vm.AssignedDate,
          Metadata_URL: vm.signature.dataUrl,
          Form_Master_ID: vm.formId,
          Employee_Name: vm.Employee_Name
        }]
      };

      var updateAttachmentData = {
        id: vm.bsaDisclosureDetails.CandidateAttachments[0].id,
        Candidate_ID: $state.params.candidate.id,
        Attachment_Type_ID: vm.attachmentTypeId,
        Attachment_Date: vm.AssignedDate,
        Metadata_URL: vm.signature.dataUrl,
        Form_Master_ID: vm.formId,
        Employee_Name: vm.Employee_Name
      };

      if (vm.isPreviousSign) {
        sendData.CandidateAttachments[0].Metadata_URL =
          vm.candidatDetails.candidateAttachments[0].Metadata_URL;
      }

      vm.promise = bsaDisclosureServices
        .saveBsaDisclosureDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
          }
        }, function (response) {
        });

      vm.promise = candidateAttachmentServices
        .updateCandidateAttachments(_.omitBy(updateAttachmentData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'DrugTesting details updated sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While updating DrugTesting details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While updating DrugTesting details', response.status);
        });
    };

    vm.submit = function () {
      var sendData = {
        Candidate_ID: $state.params.candidate.id,
        id: vm.bsaDisclosureDetails.BSADisclosureRelease[0].id,
        Company_Representative_Name: vm.Company_Representative_Name,
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

      vm.promise = bsaDisclosureServices
        .saveBsaDisclosureDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            var param = {
              id: $state.params.candidateID,
              formId: vm.formId,
              attachmentTypeId: vm.attachmentTypeId,
              view: false
            };
            $state.go('app.safetyRules', {
              candidate: param
            });
          }
        }, function (response) {
        });

      var formStatus = {
        id: vm.candidatDetails.formStatuses[0].id,
        Candidate_ID: vm.candidatDetails.id,
        Is_Drug_Testing_Fill: true,
      };

      vm.promise = newCandidateServices
        .updateFormStatus(_.omitBy(formStatus, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'DrugTesting details added sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While adding DrugTesting details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While adding DrugTesting details', response.status);
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
