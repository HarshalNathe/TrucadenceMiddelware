(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('IllinoisController', IllinoisController);

  IllinoisController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'illinoisServices',
    'newCandidateServices',
    'commonService',
    'toastr',
    '$q',
    '$timeout',
    'lodash',
    'utilService'
  ];

  function IllinoisController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    illinoisServices,
    newCandidateServices,
    commonService,
    toastr,
    $q,
    $timeout,
    _,
    utilService) {
    var vm = this;
    vm.isEdit = false;
    vm.isPreviousSign = false;
    vm.showUpdateButton = false;
    vm.hidePopUp = false;
    vm.securePassword = '';
    vm.ssn = '';
    init();

    function init() {
      vm.signature = {
        dataUrl: ''
      };
      getFormMaster('Form W4 illinois', 'Illinois W4_Signature');

      if ($state.params.candidate.view) {
        vm.isEdit = true;
      }
    }

    // Test comment
    vm.user = $rootScope.user;
    vm.Employee_Name = '';
    vm.AssignedDate = new Date();
    vm.maxValue = 10;

    vm.illinoisDetails = {
      isDependent: 'false',
      isSpouseDependent: 'false',
      isSixtyFive: 'false',
      isSpouseSixtyFive: 'false',
      isBlind: 'false',
      isSpouseBlind: 'false',
      isExempt: 'false',
      oneValue: 0,
      twoValue: 0,
      threeValue: 0,
      fourValue: 0,
      fiveValue: 0,
      sixValue: 0,
      sevenValue: 0,
      eightValue: 0,
      nineValue: 0,
      totalBasicAllowances: 0,
      additionalAllowance: 0,
      additionalAmount: 0
    };

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

    vm.dependentSelected = function (value) {
      vm.maxValue = 10;

      if (value === true) {
        vm.illinoisDetails.oneValue++;
      } else {
        vm.illinoisDetails.oneValue--;
      }

      vm.maxValue = vm.maxValue - vm.illinoisDetails.oneValue;
      vm.persovalAllowanceValue();
    };

    vm.additionalAllowanceSelected = function (value) {
      if (value === true) {
        vm.illinoisDetails.fiveValue++;
      } else {
        vm.illinoisDetails.fiveValue--;
      }

      vm.line8Value();
    };

    vm.persovalAllowanceValue = function () {
      vm.illinoisDetails.threeValue =
        vm.illinoisDetails.oneValue + vm.illinoisDetails.twoValue;
    };

    vm.line7Value = function () {
      vm.illinoisDetails.sevenValue =
        Math.round(vm.illinoisDetails.sixValue / 1000);

      vm.line8Value();
    };

    vm.line8Value = function () {
      vm.illinoisDetails.eightValue =
        vm.illinoisDetails.fiveValue + vm.illinoisDetails.sevenValue;
    };

    vm.line9Changed = function () {
      vm.illinoisDetails.additionalAllowance =
        vm.illinoisDetails.nineValue;
    };

    vm.line4Changed = function () {
      vm.illinoisDetails.totalBasicAllowances =
        vm.illinoisDetails.fourValue;
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
            getIllinoisDetails();
            getCandidateDetail();
          } else {
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    vm.submit = function () {
      var sendData = {
        Candidate_ID: $state.params.candidate.id,
        Is_Dependent: vm.illinoisDetails.isDependent.toString(),
        Is_Spouse_Dependent: vm.illinoisDetails.isSpouseDependent.toString(),
        Is_SixtyFive: vm.illinoisDetails.isSixtyFive.toString(),
        Is_Spouse_SixtyFive: vm.illinoisDetails.isSpouseSixtyFive.toString(),
        Is_Blind: vm.illinoisDetails.isBlind.toString(),
        Is_Spouse_Blind: vm.illinoisDetails.isSpouseBlind.toString(),
        Is_Exempt: vm.illinoisDetails.isExempt.toString(),
        One_Value: vm.illinoisDetails.oneValue,
        Two_Value: vm.illinoisDetails.twoValue,
        Three_Value: vm.illinoisDetails.threeValue,
        Four_Value: vm.illinoisDetails.fourValue,
        Five_Value: vm.illinoisDetails.fiveValue,
        Six_Value: vm.illinoisDetails.sixValue,
        Seven_Value: vm.illinoisDetails.sevenValue,
        Eight_Value: vm.illinoisDetails.eightValue,
        Nine_Value: vm.illinoisDetails.nineValue,
        Total_Basic_Allowance: vm.illinoisDetails.totalBasicAllowances,
        Additional_Allowance: vm.illinoisDetails.additionalAllowance,
        Additional_Amount: vm.illinoisDetails.additionalAmount,
        CandidateAttachments: [{
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

      vm.promise = illinoisServices
        .saveIllinoisDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            var param = {
              id: $state.params.candidateID || $state.params.candidate.id,
              formId: vm.formId,
              attachmentTypeId: vm.attachmentTypeId,
              view: false
            };
            $state.go('app.wFour', {
              candidate: param
            });
            commonService.showSnackbar('info', 'illinois details added sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While adding illinois details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While adding illinois details', response.status);
        });

      var formStatus = {
        id: vm.candidatDetails.formStatuses[0].id,
        Candidate_ID: vm.candidatDetails.id,
        Is_Illinois_Allowance_Fill: true,
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

    vm.update = function () {
      var sendData = {
        id: vm.illinoisDetailsObject.
          IllinoisAllowancesWorksheets[0].id,
        Candidate_ID: $state.params.candidate.id,
        Is_Dependent: vm.illinoisDetails.isDependent.toString(),
        Is_Spouse_Dependent: vm.illinoisDetails.isSpouseDependent.toString(),
        Is_SixtyFive: vm.illinoisDetails.isSixtyFive.toString(),
        Is_Spouse_SixtyFive: vm.illinoisDetails.isSpouseSixtyFive.toString(),
        Is_Blind: vm.illinoisDetails.isBlind.toString(),
        Is_Spouse_Blind: vm.illinoisDetails.isSpouseBlind.toString(),
        Is_Exempt: vm.illinoisDetails.isExempt.toString(),
        One_Value: vm.illinoisDetails.oneValue,
        Two_Value: vm.illinoisDetails.twoValue,
        Three_Value: vm.illinoisDetails.threeValue,
        Four_Value: vm.illinoisDetails.fourValue,
        Five_Value: vm.illinoisDetails.fiveValue,
        Six_Value: vm.illinoisDetails.sixValue,
        Seven_Value: vm.illinoisDetails.sevenValue,
        Eight_Value: vm.illinoisDetails.eightValue,
        Nine_Value: vm.illinoisDetails.nineValue,
        Total_Basic_Allowance: vm.illinoisDetails.totalBasicAllowances,
        Additional_Allowance: vm.illinoisDetails.additionalAllowance,
        Additional_Amount: vm.illinoisDetails.additionalAmount,
        CandidateAttachments: [{
          id: vm.illinoisDetailsObject.CandidateAttachments[0].id,
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

      vm.promise = illinoisServices
        .updateIllinoisDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'illinois details updated sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While updating illinois details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While updating illinois details', response.status);
        });
    };

    function getIllinoisDetails() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: vm.attachmentTypeId,
        FormMasterID: vm.formId
      };
      var deferred = $q.defer();
      vm.promise = illinoisServices.getIllinoisDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.illinoisDetailsObject = data.data;
            vm.illinoisDetails.isDependent = JSON.parse(
              vm.illinoisDetailsObject.IllinoisAllowancesWorksheets[0].Is_Dependent);
            vm.illinoisDetails.isSpouseDependent = JSON.parse(
              vm.illinoisDetailsObject.IllinoisAllowancesWorksheets[0].Is_Spouse_Dependent);
            vm.illinoisDetails.isSixtyFive = JSON.parse(
              vm.illinoisDetailsObject.IllinoisAllowancesWorksheets[0].Is_SixtyFive);
            vm.illinoisDetails.isSpouseSixtyFive = JSON.parse(
              vm.illinoisDetailsObject.IllinoisAllowancesWorksheets[0].Is_Spouse_SixtyFive);
            vm.illinoisDetails.isBlind = JSON.parse(
              vm.illinoisDetailsObject.IllinoisAllowancesWorksheets[0].Is_Blind);
            vm.illinoisDetails.isSpouseBlind = JSON.parse(
              vm.illinoisDetailsObject.IllinoisAllowancesWorksheets[0].Is_Spouse_Blind);
            vm.illinoisDetails.isExempt = JSON.parse(
              vm.illinoisDetailsObject.IllinoisAllowancesWorksheets[0].Is_Exempt);
            vm.illinoisDetails.oneValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].One_Value;
            vm.illinoisDetails.twoValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Two_Value;
            vm.illinoisDetails.threeValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Three_Value;
            vm.illinoisDetails.fourValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Four_Value;
            vm.illinoisDetails.fiveValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Five_Value;
            vm.illinoisDetails.sixValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Six_Value;
            vm.illinoisDetails.sevenValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Seven_Value;
            vm.illinoisDetails.eightValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Eight_Value;
            vm.illinoisDetails.nineValue = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Nine_Value;
            vm.illinoisDetails.totalBasicAllowances = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Total_Basic_Allowance;
            vm.illinoisDetails.additionalAllowance = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Additional_Allowance;
            vm.illinoisDetails.additionalAmount = vm.illinoisDetailsObject.
              IllinoisAllowancesWorksheets[0].Additional_Amount;
            vm.AssignedDate = vm.illinoisDetailsObject.CandidateAttachments[0]
              .Attachment_Date;

            vm.getImage = function () {
              return vm.illinoisDetailsObject.CandidateAttachments[0]
                .Metadata_URL;
            };

            deferred.resolve(data);
          } else {
            commonService.showSnackbar('error', 'Error While getting illinois details', data.status);
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
    }

    vm.edit = function () {
      vm.isEdit = false;
      vm.showUpdateButton = true;
      vm.promise = $timeout(function () { }, 200);
    };

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

    vm.showExemptPopUP = function (value) {
      if (value) {
        commonService.showSnackbar('info', '', 2, true);
      }
    };
  }
})();
