(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('WFourController', WFourController);

  WFourController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'wFourServices',
    'newCandidateServices',
    'commonService',
    'toastr',
    '$q',
    '$timeout',
    'lodash',
    'utilService'
  ];

  function WFourController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    wFourServices,
    newCandidateServices,
    commonService,
    toastr,
    $q,
    $timeout,
    _,
    utilService) {
    var vm = this;
    vm.hidePopUp = false;
    vm.securePassword = '';
    vm.ssn = '';

    window.jQuery('#EmploymentDate').datetimepicker({
      format: 'MM/DD/YYYY',
      minDate: new Date('1900-01-1')
    });

    init();

    function init() {
      vm.userName = utilService.getItem('userData');
      vm.showEmployersDetails = false;

      if (vm.userName.user[0].role === '1' || vm.userName.user[0].role === 1) {
        vm.showEmployersDetails = true;
      } else if (vm.userName.user[0].role === '0' || vm.userName.user[0].role === 0) {
        vm.showEmployersDetails = false;
      }

      vm.signature = {
        dataUrl: ''
      };

      getFormMaster('Form W4', 'W4_Signature');

      if ($state.params.candidate.view) {
        vm.isEdit = true;
      }
    }

    // Test comment
    vm.user = $rootScope.user;
    vm.AssignedDate = new Date();
    vm.isPreviousSign = false;
    vm.showUpdateButton = false;
    vm.isPrint = false;
    vm.single = false;
    vm.married = false;
    vm.withhold = false;

    vm.wFourDetails = {
      aValue: false,
      bValue: false,
      cValue: false,
      dValue: '',
      eValue: false,
      fValue: false,
      gValue: false,
      hValue: 0,
      Is_Withhold_Married: '',
      Is_SSC_Replacement: false,
      Total_Allowances_Claim: '',
      Addition_Amt_Required: '',
      WAC_Signature_Date: '',
      Employer_Name_Address: 'Trucadence LLC 1 Tiffany Pointe, Suite 108  Bloomingdale IL 60108',
      Employer_Office_Code: '',
      Employer_Indentification_No: '81-2599619',
      Is_Exempt: ''
    };

    window.jQuery('#EmploymentDate').on('dp.change', function (e) {
      vm.wFourDetails.Employer_Office_Code = moment(e.date._d).format('MM/DD/YYYY');
    });

    vm.clear = function () {
      var canvas = document.querySelector('canvas');
      var signaturePad = new SignaturePad(canvas);

      // Clears the canvas
      signaturePad.clear();
      vm.signature.dataUrl = '';
      vm.signPadDisable = false;
    };

    vm.printWFour = function () {
      vm.isPrint = true;
    };

    vm.optionsSelected = function (selectedOption) {
      if (selectedOption === true) {
        vm.wFourDetails.hValue++;
      } else {
        vm.wFourDetails.hValue--;
      }
    };

    vm.temp = 0;
    vm.noOfDependentSelected = function () {
      if (!vm.wFourDetails.dValue) {
        vm.wFourDetails.dValue = 0;
      }

      vm.wFourDetails.hValue = vm.wFourDetails.hValue - vm.temp;
      vm.wFourDetails.hValue = vm.wFourDetails.hValue + parseInt(vm.wFourDetails.dValue);
      vm.temp = vm.wFourDetails.dValue;
    };

    vm.edit = function () {
      vm.isEdit = false;
      vm.showUpdateButton = true;
      vm.promise = $timeout(function () { }, 200);
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
            getWFourDetails();
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

    function getWFourDetails() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: vm.attachmentTypeId,
        FormMasterID: vm.formId
      };
      vm.promise = wFourServices.getWFourDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.wFourDetailsresp = data.data;
            vm.wFourDetails.Is_Withhold_Married = vm.wFourDetailsresp
              .personalAllowancesWorksheets[0].Is_Withhold_Married;

            if (vm.wFourDetails.Is_Withhold_Married === '1') {
              vm.single = true;
            } else if (vm.wFourDetails.Is_Withhold_Married === '2') {
              vm.married = true;
            } else {
              vm.withhold = true;
            }

            vm.wFourDetails.Is_SSC_Replacement = vm.wFourDetailsresp
              .personalAllowancesWorksheets[0].Is_SSC_Replacement;
            vm.wFourDetails.Total_Allowances_Claim = vm.wFourDetailsresp
              .personalAllowancesWorksheets[0].Total_Allowances_Claim;
            vm.wFourDetails.Addition_Amt_Required = vm.wFourDetailsresp
              .personalAllowancesWorksheets[0].Addition_Amt_Required;
            vm.wFourDetails.Is_Exempt = vm.wFourDetailsresp
              .personalAllowancesWorksheets[0].Is_Exempt;
            vm.wFourDetails.Employer_Name_Address = vm.wFourDetailsresp
              .personalAllowancesWorksheets[0].Employer_Name_Address;
            vm.wFourDetails.Employer_Office_Code = vm.wFourDetailsresp
              .personalAllowancesWorksheets[0].Employer_Office_Code;
            vm.wFourDetails.Employer_Indentification_No = vm.wFourDetailsresp
              .personalAllowancesWorksheets[0].Employer_Indentification_No;
            vm.Employee_Name = vm.wFourDetailsresp.CandidateAttachments[0]
              .Employee_Name;
            vm.getImage = function () {
              return vm.wFourDetailsresp.CandidateAttachments[0]
                .Metadata_URL;
            };
          }
        }, function (response) {
        });
    }

    vm.update = function () {
      var sendData = {
        id: vm.wFourDetailsresp.personalAllowancesWorksheets[0].id,
        Candidate_ID: $state.params.candidate.id,

        // PAW_A_Value: vm.wFourDetails.aValue,
        // PAW_B_Value: vm.wFourDetails.bValue,
        // PAW_C_Value: vm.wFourDetails.cValue,
        // PAW_D_Value: Number(vm.wFourDetails.dValue),
        // PAW_E_Value: vm.wFourDetails.eValue,
        // PAW_F_Value: vm.wFourDetails.fValue,
        // PAW_G_Value: vm.wFourDetails.gValue,
        // PAW_H_Value: Number(vm.wFourDetails.hValue),

        Is_Withhold_Married: vm.wFourDetails.Is_Withhold_Married,
        Is_SSC_Replacement: vm.wFourDetails.Is_SSC_Replacement,
        Total_Allowances_Claim: Number(vm.wFourDetails.Total_Allowances_Claim),
        Addition_Amt_Required: Number(vm.wFourDetails.Addition_Amt_Required),
        Is_Exempt: vm.wFourDetails.Is_Exempt,
        WAC_Signature_Date: vm.AssignedDate,
        Employer_Name_Address: vm.wFourDetails.Employer_Name_Address,
        Employer_Office_Code: vm.wFourDetails.Employer_Office_Code,
        Employer_Indentification_No: vm.wFourDetails.Employer_Indentification_No,
        CandidateAttachments: [{
          id: vm.wFourDetailsresp.CandidateAttachments[0].id,
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

      vm.promise = wFourServices
        .updateWFourDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'WFour details updated sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While updating WFour details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While updating WFour details', response.status);
        });
    };

    vm.submit = function () {
      var sendData = {
        Candidate_ID: $state.params.candidate.id,

        // PAW_A_Value: vm.wFourDetails.aValue,
        // PAW_B_Value: vm.wFourDetails.bValue,
        // PAW_C_Value: vm.wFourDetails.cValue,
        // PAW_D_Value: Number(vm.wFourDetails.dValue),
        // PAW_E_Value: vm.wFourDetails.eValue,
        // PAW_F_Value: vm.wFourDetails.fValue,
        // PAW_G_Value: vm.wFourDetails.gValue,
        // PAW_H_Value: Number(vm.wFourDetails.hValue),

        Is_Withhold_Married: vm.wFourDetails.Is_Withhold_Married,
        Is_SSC_Replacement: vm.wFourDetails.Is_SSC_Replacement,
        Total_Allowances_Claim: Number(vm.wFourDetails.Total_Allowances_Claim),
        Addition_Amt_Required: Number(vm.wFourDetails.Addition_Amt_Required),
        Is_Exempt: vm.wFourDetails.Is_Exempt,
        WAC_Signature_Date: vm.AssignedDate,
        Employer_Name_Address: vm.wFourDetails.Employer_Name_Address,
        Employer_Office_Code: vm.wFourDetails.Employer_Office_Code,
        Employer_Indentification_No: vm.wFourDetails.Employer_Indentification_No,
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

      vm.promise = wFourServices
        .saveWFourDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            var param = {
              id: $state.params.candidateID || $state.params.candidate.id,
              formId: vm.formId,
              attachmentTypeId: vm.attachmentTypeId,
              view: false
            };
            $state.go('app.iNine', {
              candidate: param
            });
          }
        }, function (response) {
        });

      var formStatus = {
        id: vm.candidatDetails.formStatuses[0].id,
        Candidate_ID: vm.candidatDetails.id,
        Is_Personal_Allowance_Fill: true,
      };

      vm.promise = newCandidateServices
        .updateFormStatus(_.omitBy(formStatus, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'WFour details added sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While adding WFour details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While adding WFour details', response.status);
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
