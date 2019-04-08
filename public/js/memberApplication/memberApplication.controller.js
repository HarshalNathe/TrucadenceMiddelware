(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('MemberApplicationController', MemberApplicationController);

  MemberApplicationController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'newCandidateServices',
    'commonService',
    '$q',
    '$timeout',
    'utilService',
    'lodash',
    'MemberApplicationServices'
  ];

  function MemberApplicationController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    newCandidateServices,
    commonService,
    $q,
    $timeout,
    utilService,
    _,
    MemberApplicationServices) {
    var vm = this;
    vm.isEdit = false;
    vm.isPreviousSign = false;
    vm.showUpdateButton = false;
    vm.Employer_Name = '';
    vm.Date_Employed = '';
    vm.MI = '';
    vm.Height = '';
    vm.Weight = '';
    vm.MaritalStatus = '';
    vm.workingHours = [];
    vm.Attachment_Date = new Date();
    vm.Date_Of_Event = new Date();

    vm.Plan = [{
        planName: 'EverydayCARE (No Hospitalization with plan)',
        selected: false
      },
      {
        planName: 'EverydayCARE Plus 30',
        selected: false
      },
      {
        planName: 'EverydayCARE Plus 50',
        selected: false
      },
      {
        planName: 'EverydayCARE Plus 125',
        selected: false
      },
      {
        planName: 'EverydayCARE Plus 200',
        selected: false
      }
    ];

    vm.Coverage = [{
        planName: 'Individual only',
        selected: false
      },
      {
        planName: 'Individual & child(ren)',
        selected: false
      },
      {
        planName: 'Individual & spouse',
        selected: false
      },
      {
        planName: 'Family',
        selected: false
      }
    ];

    vm.Family_Information = [{
        label: 'Spouse',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        height: '',
        weight: '',
        socialSecurityNumber: '',
        isFullTimeStudent: Boolean
      },
      {
        label: 'Child',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        height: '',
        weight: '',
        socialSecurityNumber: '',
        isFullTimeStudent: Boolean
      },
      {
        label: 'Child',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        height: '',
        weight: '',
        socialSecurityNumber: '',
        isFullTimeStudent: Boolean
      },
      {
        label: 'Child',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        height: '',
        weight: '',
        socialSecurityNumber: '',
        isFullTimeStudent: Boolean
      },
      {
        label: 'Child',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        height: '',
        weight: '',
        socialSecurityNumber: '',
        isFullTimeStudent: Boolean
      }
    ];

    vm.Beneficiary_Information = [{
      lastName: '',
      firstName: '',
      MI: '',
      gender: '',
      relationshipToYou: ''
    }];

    vm.Current_Plan = [{
        eventName: 'Marriage',
        selected: false
      },
      {
        eventName: 'Divorce',
        selected: false
      },
      {
        eventName: 'Returning to School Full-Time',
        selected: false
      },
      {
        eventName: 'Adoption',
        selected: false
      },
      {
        eventName: 'Court Order',
        selected: false
      },
      {
        eventName: 'Other(Specify)',
        selected: false
      }
    ];

    vm.Specify_Other_Name = '';
    vm.CandidateAttachments = [{
      Attachment_Date: '',
      Attachment_Type_ID: '',
      Candidate_ID: '',
      Employee_Name: '',
      Form_Master_ID: '',
      Agreement: []
    }];

    vm.MemberAgreement = {
      label: 'Member Agreement',
      Employee_Signature: '',
      Is_Representative: true
    };

    vm.WaiverAgreement = {
      label: 'Waiver',
      Employee_Signature: '',
      Is_Representative: true,
      Government_Plan_Name: '',
      Other_Reason_data: '',
      Coverage: [],
      Coverage_Decline_Reason: []
    };

    vm.WaiverCoverage = [{
        Type: 'Individual',
        selected: false
      }, {
        Type: 'Spouse',
        selected: false
      },
      {
        Type: 'Children',
        selected: false
      }
    ];

    vm.Coverage_Decline_Reason = [{
        Type: 'Spouse \'s group health plan',
        selected: false
      },
      {
        Type: 'individual medical plan',
        selected: false
      },
      {
        Type: 'Not affordable',
        selected: false
      },
      {
        Type: 'COBRA/State Continuation',
        selected: false
      },
      {
        Type: 'Government Plan',
        selected: false
      }, {
        Type: 'Other Reason',
        selected: false
      }
    ];

    init();

    function init() {
      vm.signature = {
        dataUrl: ''
      };

      vm.signature1 = {
        dataUrl: ''
      };

      vm.candidateID = $state.params.candidate;
      getFormMaster('Member Application', 'Member_Agreement_Signature');

      if ($state.params.candidate.view) {
        vm.isEdit = true;
      }

      window.jQuery('#birthdate').datetimepicker({
        format: 'MM/DD/YYYY',
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });
      window.jQuery('#birthdate').on('dp.change', function (e) {
        vm.Family_Information[0].dateOfBirth = moment(e.date._d).format('MM/DD/YYYY');
      });
      window.jQuery('#birthdate1').datetimepicker({
        format: 'MM/DD/YYYY',
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });
      window.jQuery('#birthdate1').on('dp.change', function (e) {
        vm.Family_Information[1].dateOfBirth = moment(e.date._d).format('MM/DD/YYYY');
      });
      window.jQuery('#birthdate2').datetimepicker({
        format: 'MM/DD/YYYY',
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });
      window.jQuery('#birthdate2').on('dp.change', function (e) {
        vm.Family_Information[2].dateOfBirth = moment(e.date._d).format('MM/DD/YYYY');
      });
      window.jQuery('#birthdate3').datetimepicker({
        format: 'MM/DD/YYYY',
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });
      window.jQuery('#birthdate3').on('dp.change', function (e) {
        vm.Family_Information[3].dateOfBirth = moment(e.date._d).format('MM/DD/YYYY');
      });
      window.jQuery('#birthdate4').datetimepicker({
        format: 'MM/DD/YYYY',
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });
      window.jQuery('#birthdate4').on('dp.change', function (e) {
        vm.Family_Information[4].dateOfBirth = moment(e.date._d).format('MM/DD/YYYY');
      });
    }

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
            getCandidateDetail();
            getMemberApplicationDetails();
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
        candidateId: $state.params.candidate ? $state.params.candidate.id : $rootScope.candidate_ID,
        AttachmentTypeID: $state.params.attachmentTypeId,
        FormMasterID: $state.params.formId
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCandidatDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.candidatDetails = data.data;
            vm.workingHours = vm.candidatDetails.Part_Time_Hour;
            vm.MaritalStatus = vm.candidatDetails.Marital_Status;
            vm.MI = parseInt(vm.candidatDetails.MI);
            vm.Height = parseInt(vm.candidatDetails.Height);
            vm.Weight = parseInt(vm.candidatDetails.Weight);
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

    vm.edit = function () {
      vm.isEdit = false;
      vm.showUpdateButton = true;
      vm.promise = $timeout(function () {}, 200);
    };

    function getMemberApplicationDetails() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: vm.attachmentTypeId,
        FormMasterID: vm.formId
      };
      vm.promise = MemberApplicationServices.getMemberApplicationDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.MemberApplicationDetails = data.data;
            vm.Employer_Name = vm.MemberApplicationDetails.MemberDetails[0].employers.Employer_Name;
            vm.Date_Employed = moment(vm.MemberApplicationDetails.MemberDetails[0].employers.Created_At)
              .format('MM/DD/YYYY');
            vm.Plan = vm.MemberApplicationDetails.MemberDetails[0].Plan;
            vm.Coverage = vm.MemberApplicationDetails.MemberDetails[0].Coverage;
            vm.Family_Information = vm.MemberApplicationDetails.MemberDetails[0].Family_Information;
            vm.Beneficiary_Information = vm.MemberApplicationDetails.MemberDetails[0].Beneficiary_Information;
            vm.Current_Plan = vm.MemberApplicationDetails.MemberDetails[0].Current_Plan;
            vm.Specify_Other_Name = vm.MemberApplicationDetails.MemberDetails[0].Specify_Other_Name;
            vm.Date_Of_Event = vm.MemberApplicationDetails.MemberDetails[0].Date_Of_Event;
            vm.CandidateAttachments = vm.MemberApplicationDetails.CandidateAttachments;
            vm.getImage = function () {
              return vm.CandidateAttachments[0].Agreement[0].Employee_Signature;
            };

            if (vm.CandidateAttachments[0].Agreement.length > 1) {
              vm.WaiverAgreement = vm.CandidateAttachments[0].Agreement[1];
              vm.getImage1 = function () {
                return vm.CandidateAttachments[0].Agreement[1].Employee_Signature;
              };

              vm.WaiverCoverage = vm.WaiverAgreement.Coverage;
              vm.Coverage_Decline_Reason = vm.WaiverAgreement.Coverage_Decline_Reason;
            }
          } else {
            commonService.showSnackbar('error', 'Error While Getting Member Application Details', data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    vm.submit = function () {
      for (var i = 0; i < vm.Family_Information.length; i++) {
        if (vm.Family_Information[i].fullName === '') {
          vm.Family_Information.splice(i, 1);
          i = 0;
        }
      }

      vm.CandidateAttachments = [{
        Attachment_Date: vm.Attachment_Date,
        Attachment_Type_ID: vm.attachmentTypeId,
        Candidate_ID: $state.params.candidate.id,
        Employee_Name: '',
        Form_Master_ID: vm.formId,
        Agreement: []
      }];

      vm.MemberAgreement.Employee_Signature = vm.signature.dataUrl;
      vm.CandidateAttachments[0].Agreement.push(vm.MemberAgreement);

      if (vm.signature1.dataUrl !== '') {
        vm.WaiverAgreement.Coverage = vm.WaiverCoverage;
        vm.WaiverAgreement.Coverage_Decline_Reason = vm.Coverage_Decline_Reason;
        vm.WaiverAgreement.Employee_Signature = vm.signature1.dataUrl;
        vm.CandidateAttachments[0].Agreement.push(vm.WaiverAgreement);
      }

      var candidateData = {
        id: vm.candidatDetails.id,
        Application_ID: '',
        Application_Date: vm.candidatDetails.Application_Date,
        Social_Security_Number: vm.candidatDetails.Social_Security_Number,
        First_Name: vm.candidatDetails.First_Name,
        Middle_Name: vm.candidatDetails.Middle_Name,
        Last_Name: vm.candidatDetails.Last_Name,
        Nick_Name: vm.candidatDetails.Nick_Name,
        DOB: vm.candidatDetails.DOB,
        Gender: vm.candidatDetails.Gender,
        Marital_Status: vm.MaritalStatus,
        Other_Last_Name: vm.candidatDetails.Other_Last_Name,
        Address_1: vm.candidatDetails.Address_1,
        Address_2: vm.candidatDetails.Address_2,
        City: vm.candidatDetails.City,
        State: vm.candidatDetails.State,
        ZIP: vm.candidatDetails.ZIP,
        Cell_Phone: vm.candidatDetails.Cell_Phone.toString(),
        Pager: vm.candidatDetails.Pager,
        Emergency_Phone: vm.candidatDetails.Emergency_Phone.toString(),
        Emergency_Contact_Name: vm.candidatDetails.Emergency_Contact_Name,
        Email_ID: vm.candidatDetails.Email_ID,
        Permanent_Address_1: vm.candidatDetails.Permanent_Address_1,
        Permanent_Address_2: vm.candidatDetails.Permanent_Address_2,
        Permanent_City: vm.candidatDetails.Permanent_City,
        Permanent_State: vm.candidatDetails.Permanent_State,
        Permanent_ZIP: vm.candidatDetails.Permanent_ZIP,
        Ref_Channel_Media: vm.candidatDetails.Ref_Channel_Media,
        Ref_Description: vm.candidatDetails.Ref_Description,
        Is_Applied_Before: vm.candidatDetails.Is_Applied_Before.toString(),
        Pre_Application_Month: vm.candidatDetails.Pre_Application_Month,
        Pre_Application_Year: vm.candidatDetails.Pre_Application_Year,
        Ex_Trucadence_Employee: vm.candidatDetails.Ex_Trucadence_Employee,
        Ex_Trucadence_Employee_Place: vm.candidatDetails.Ex_Trucadence_Employee_Place,
        Ex_Trucadence_Employee_Year: vm.candidatDetails.Ex_Trucadence_Employee_Year,
        Ex_Trucadence_Employee_Position: vm.candidatDetails.Ex_Trucadence_Employee_Position,
        Decription_Pre_Employment: vm.candidatDetails.Decription_Pre_Employment,
        Is_Adult: vm.candidatDetails.Is_Adult,
        Education_Level: vm.candidatDetails.Education_Level,
        Is_US_WorkPermit: vm.candidatDetails.Is_US_WorkPermit.toString(),
        Area_Of_Work: vm.candidatDetails.Area_Of_Work,
        Favourable_Shifts: vm.candidatDetails.Favourable_Shifts,
        Favourable_Days: vm.candidatDetails.Favourable_Days,
        Is_Part_Time: true,
        Part_Time_Hour: vm.candidatDetails.Part_Time_Hour,
        Mode_Of_Payment: vm.candidatDetails.Mode_Of_Payment,
        Is_Transportation_Available: vm.candidatDetails.Is_Transportation_Available.toString(),
        Is_Suspended: vm.candidatDetails.Is_Suspended,
        Description_For_Suspension: vm.candidatDetails.Description_For_Suspension,
        Positions_Interested: vm.candidatDetails.Positions_Interested,
        Weight: vm.Weight ? vm.Weight.toString() : '',
        Height: vm.Height ? vm.Height.toString() : '',
        MI: vm.MI ? vm.MI.toString() : '',
        BSADisclosureReleases: vm.candidatDetails.bSADisclosureReleases,
        EmploymentDetails: vm.candidatDetails.employmentDetails,
        CandidateAttachments: vm.candidatDetails.candidateAttachments
      };

      vm.promise = newCandidateServices.updateCandidateDetails(_.omitBy(candidateData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            console.log('Candidate data updated!!!');
          } else {
            commonService.showSnackbar('error', 'Error While updating Candidate details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While updating Candidate details', response.status);
        });

      var sendData = {
        Employer_Id: vm.MemberApplicationDetails.MemberDetails[0].Employer_Id,
        Candidate_Id: $state.params.candidate.id,
        Plan: vm.Plan,
        Coverage: vm.Coverage,
        Family_Information: vm.Family_Information,
        Beneficiary_Information: vm.Beneficiary_Information,
        Current_Plan: vm.Current_Plan,
        Specify_Other_Name: vm.Specify_Other_Name,
        Date_Of_Event: vm.Attachment_Date,
        CandidateAttachments: vm.CandidateAttachments
      };

      vm.promise = MemberApplicationServices.saveMemberApplicationDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            var formStatus = {
              id: vm.candidatDetails.formStatuses[0].id,
              Candidate_ID: vm.candidatDetails.id,
              Is_MemberApplication_Fill: true,
            };

            vm.promise = newCandidateServices.updateFormStatus(_.omitBy(formStatus, _.isNil))
              .then(function (response) {
                if (response.status === 200) {
                  $state.go('app.candidateDetail', {
                    candidateID: $state.params.candidateID || $state.params.candidate.id
                  });
                  commonService.showSnackbar('info', 'Member Application Details Added Sucessfully', response.status);
                }
              }, function (response) {});
          } else {
            commonService.showSnackbar('error', 'Error While Adding Member Application Details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While Adding Member Application Details', response.status);
        });
    };

    vm.update = function () {
      for (var i = 0; i < vm.Family_Information.length; i++) {
        if (vm.Family_Information[i].fullName === '') {
          vm.Family_Information.splice(i, 1);
          i = 0;
        }
      }

      vm.CandidateAttachments = [{
        id: vm.CandidateAttachments[0].id,
        Attachment_Date: vm.Attachment_Date,
        Attachment_Type_ID: vm.attachmentTypeId,
        Candidate_ID: $state.params.candidate.id,
        Employee_Name: '',
        Form_Master_ID: vm.formId,
        Agreement: []
      }];

      vm.MemberAgreement.Employee_Signature = vm.signature.dataUrl;
      vm.CandidateAttachments[0].Agreement.push(vm.MemberAgreement);

      if (vm.signature1.dataUrl !== '') {
        vm.WaiverAgreement.Coverage = vm.WaiverCoverage;
        vm.WaiverAgreement.Coverage_Decline_Reason = vm.Coverage_Decline_Reason;
        vm.WaiverAgreement.Employee_Signature = vm.signature1.dataUrl;
        vm.CandidateAttachments[0].Agreement.push(vm.WaiverAgreement);
      }

      var candidateData = {
        id: vm.candidatDetails.id,
        Application_ID: '',
        Application_Date: vm.candidatDetails.Application_Date,
        Social_Security_Number: vm.candidatDetails.Social_Security_Number,
        First_Name: vm.candidatDetails.First_Name,
        Middle_Name: vm.candidatDetails.Middle_Name,
        Last_Name: vm.candidatDetails.Last_Name,
        Nick_Name: vm.candidatDetails.Nick_Name,
        DOB: vm.candidatDetails.DOB,
        Gender: vm.candidatDetails.Gender,
        Marital_Status: vm.MaritalStatus,
        Other_Last_Name: vm.candidatDetails.Other_Last_Name,
        Address_1: vm.candidatDetails.Address_1,
        Address_2: vm.candidatDetails.Address_2,
        City: vm.candidatDetails.City,
        State: vm.candidatDetails.State,
        ZIP: vm.candidatDetails.ZIP,
        Cell_Phone: vm.candidatDetails.Cell_Phone.toString(),
        Pager: vm.candidatDetails.Pager,
        Emergency_Phone: vm.candidatDetails.Emergency_Phone.toString(),
        Emergency_Contact_Name: vm.candidatDetails.Emergency_Contact_Name,
        Email_ID: vm.candidatDetails.Email_ID,
        Permanent_Address_1: vm.candidatDetails.Permanent_Address_1,
        Permanent_Address_2: vm.candidatDetails.Permanent_Address_2,
        Permanent_City: vm.candidatDetails.Permanent_City,
        Permanent_State: vm.candidatDetails.Permanent_State,
        Permanent_ZIP: vm.candidatDetails.Permanent_ZIP,
        Ref_Channel_Media: vm.candidatDetails.Ref_Channel_Media,
        Ref_Description: vm.candidatDetails.Ref_Description,
        Is_Applied_Before: vm.candidatDetails.Is_Applied_Before.toString(),
        Pre_Application_Month: vm.candidatDetails.Pre_Application_Month,
        Pre_Application_Year: vm.candidatDetails.Pre_Application_Year,
        Ex_Trucadence_Employee: vm.candidatDetails.Ex_Trucadence_Employee,
        Ex_Trucadence_Employee_Place: vm.candidatDetails.Ex_Trucadence_Employee_Place,
        Ex_Trucadence_Employee_Year: vm.candidatDetails.Ex_Trucadence_Employee_Year,
        Ex_Trucadence_Employee_Position: vm.candidatDetails.Ex_Trucadence_Employee_Position,
        Decription_Pre_Employment: vm.candidatDetails.Decription_Pre_Employment,
        Is_Adult: vm.candidatDetails.Is_Adult,
        Education_Level: vm.candidatDetails.Education_Level,
        Is_US_WorkPermit: vm.candidatDetails.Is_US_WorkPermit.toString(),
        Area_Of_Work: vm.candidatDetails.Area_Of_Work,
        Favourable_Shifts: vm.candidatDetails.Favourable_Shifts,
        Favourable_Days: vm.candidatDetails.Favourable_Days,
        Is_Part_Time: true,
        Part_Time_Hour: vm.candidatDetails.Part_Time_Hour,
        Mode_Of_Payment: vm.candidatDetails.Mode_Of_Payment,
        Is_Transportation_Available: vm.candidatDetails.Is_Transportation_Available.toString(),
        Is_Suspended: vm.candidatDetails.Is_Suspended,
        Description_For_Suspension: vm.candidatDetails.Description_For_Suspension,
        Positions_Interested: vm.candidatDetails.Positions_Interested,
        Weight: vm.Weight ? vm.Weight.toString() : '',
        Height: vm.Height ? vm.Height.toString() : '',
        MI: vm.MI ? vm.MI.toString() : '',
        BSADisclosureReleases: vm.candidatDetails.bSADisclosureReleases,
        EmploymentDetails: vm.candidatDetails.employmentDetails,
        CandidateAttachments: vm.candidatDetails.candidateAttachments
      };

      vm.promise = newCandidateServices.updateCandidateDetails(_.omitBy(candidateData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            console.log('Update Candidate data updated!!!');
          } else {
            commonService.showSnackbar('error', 'Error While updating Candidate details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While updating Candidate details', response.status);
        });

      var sendData = {
        id: vm.MemberApplicationDetails.MemberDetails[0].id,
        Employer_Id: vm.MemberApplicationDetails.MemberDetails[0].Employer_Id,
        Candidate_Id: $state.params.candidate.id,
        Plan: vm.Plan,
        Coverage: vm.Coverage,
        Family_Information: vm.Family_Information,
        Beneficiary_Information: vm.Beneficiary_Information,
        Current_Plan: vm.Current_Plan,
        Specify_Other_Name: vm.Specify_Other_Name,
        Date_Of_Event: vm.Attachment_Date,
        CandidateAttachments: vm.CandidateAttachments
      };

      vm.promise = MemberApplicationServices.updateMemberApplicationDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'Member Application Details Updated Sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While Updating Member Application Details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While Updating Member Application Details', response.status);
        });
    };

    vm.cancel = function () {
      $state.go('app.candidateDetail', {
        candidateID: $state.params.candidate.id
      });
    };

    vm.clear = function () {
      var canvas = document.querySelector('canvas');
      var signaturePad = new SignaturePad(canvas);

      // Clears the canvas
      signaturePad.clear();
      vm.signature.dataUrl = '';
      vm.signPadDisable = false;
    };

    vm.signaturePadDisabled = function () {
      vm.signPadDisable = true;
    };

    vm.clear1 = function () {
      var wrapper = document.getElementById('canvas1');
      var canvas1 = wrapper.querySelector('canvas');
      var signaturePad1 = new SignaturePad(canvas1);

      // Clears the canvas
      signaturePad1.clear();
      vm.signature1.dataUrl = '';
      vm.signPadDisable1 = false;
    };

    vm.signaturePadDisabled1 = function () {
      vm.signPadDisable1 = true;
    };
  }
})();
