(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('NewCandidateEditController', NewCandidateEditController);

  NewCandidateEditController.$inject = [
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
    '$q',
    '$filter',
    'jobProfileService',
    'lodash'
  ];

  function NewCandidateEditController(
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
    $q,
    $filter,
    jobProfileService,
    _) {
    var vm = this;
    vm.tagline = 'Submitted Patient Details';
    vm.AssignedDate = new Date();
    vm.stateOfIssueList = [];
    vm.stateListByCountryId = [];
    vm.historyCityList = [];
    vm.EmploymentDetails = [];
    var CandidateAttachments = [];
    var BSADisclosureReleases = [];
    var Ref_Channel_Media = [];
    var $ = angular.element;
    vm.emHistorySaveButton = true;
    vm.emHistoryCancelButton = true;
    vm.emHistoryAddMoreButton = false;
    vm.datePicker = {};
    var editIndex = -1;
    var isFormValid = false;
    vm.showOtherField = false;
    vm.signature = '';
    vm.datePicker.date = {
      startDate: null,
      endDate: null
    };
    vm.partialSave = false;
    init();
    getJobProfileList();
    getAllJobProfileList();

    function init() {
      getCountry();
      var options = {};
      vm.mmt = window.moment;
      options.locale = {
        direction: 'ltr',
        format: 'MM/DD/YYYY HH:mm',
        separator: ' - ',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        fromLabel: 'From',
        toLabel: 'To',
        customRangeLabel: 'Custom',
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May',
          'June', 'July', 'August', 'September',
          'October', 'November', 'December'
        ],
        firstDay: 1
      };

      window.jQuery('#datetimepicker1').datetimepicker();
      window.jQuery('#birthdate').datetimepicker({
        format: 'MM/DD/YYYY',
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });
      window.jQuery('#birthdate').on('dp.change', function (e) {
        vm.personalDetails.birthDate = moment(e.date._d).format('MM/DD/YYYY');
      });
      window.jQuery('#datetimepicker10').on('dp.change', function (e) {
        vm.employmentDetails.preApplicationMonth = moment(e.date._d).format('MM/YYYY');
      });
      window.jQuery('#datetimepicker9').on('dp.change', function (e) {
        vm.employmentDetails.exTruecadenceEmployeeYear = moment(e.date._d).format('MM/YYYY');
      });
      window.jQuery('#datetimepicker9').datetimepicker({
        viewMode: 'years',
        minDate: new Date('1900-01-1'),
        format: 'MM/YYYY'
      });
      window.jQuery('#datetimepicker10').datetimepicker({
        viewMode: 'years',
        minDate: new Date('1900-01-1'),
        format: 'MM/YYYY'
      });
      window.jQuery('#datetimepicker6').datetimepicker({
        format: 'MM/DD/YYYY',
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });
      window.jQuery('#datetimepicker7').datetimepicker({
        format: 'MM/DD/YYYY',
        useCurrent: false, // Important! See issue #1075
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });
      window.jQuery('#datetimepicker6').on('dp.change', function (e) {
        window.jQuery('#datetimepicker7').data('DateTimePicker').minDate(e.date);
        vm.Start_Date = moment(e.date._d).format('MM/DD/YYYY');
      });
      window.jQuery('#datetimepicker7').on('dp.change', function (e) {
        window.jQuery('#datetimepicker6').data('DateTimePicker').maxDate(e.date);
        vm.End_Date = moment(e.date._d).format('MM/DD/YYYY');
      });
      window.jQuery('#rootwizard').bootstrapWizard({
        onTabShow: function (tab, navigation, index) {
          var $total = navigation.find('li').length;
          var $current = index + 1;
          var $percent = ($current / $total) * 100;
          window.jQuery('#rootwizard .progress-bar').css({
            width: $percent + '%'
          });
        },
        onNext: function (tab, navigation, index) {
          /* jshint maxcomplexity:10 */
          vm.onnextindex = index + 1;
          window.scrollTo(0, 0);
          switch (index) {
            case 1:

              isFormValid = vm.validateForm($scope.tab1From.$valid);
              vm.partialSave = true;

              if (isFormValid) {
                vm.promise = vm.setEmployeeHistory();
              } else {
                commonService.showSnackbar('error', 'Please fill all mandetory fields', '0');
                isFormValid = false;
              }

              break;

            case 2:
              if ($scope.tab2From.$valid && vm.validateTab2Form() && $scope.tab1From.$valid) {
                isFormValid = true;
                vm.partialSave = true;
                vm.promise = vm.setEmployeeHistory();
              } else {
                commonService.showSnackbar('error', 'Please fill all mandetory fields', '0');
                isFormValid = false;
              }

              break;

            case 3:
              if ($scope.tab1From.$valid && $scope.tab2From.$valid && vm.validateTab2Form()) {
                isFormValid = true;
                vm.partialSave = true;
                vm.promise = vm.setEmployeeHistory();
              } else {
                commonService.showSnackbar('error', 'Please fill all mandetory fields', '0');
                isFormValid = false;
              }

              break;

            case 4:
              if ($scope.tab1From.$valid && $scope.tab2From.$valid && vm
                .validateTab2Form() && $scope.tab4From.$valid) {
                isFormValid = true;
                vm.partialSave = false;
                vm.promise = vm.setEmployeeHistory();
              } else {
                commonService.showSnackbar('error', 'Please fill all mandetory fields', '0');
                isFormValid = false;
              }

              break;

            default:
              isFormValid = false;
          }
          return isFormValid;
        },
        onFinish: function (tab, navigation, index) {
          if ($scope.tab1From.$valid && $scope.tab2From.$valid && $scope.tab4From.$valid) {
            isFormValid = true;
            vm.partialSave = false;
            vm.promise = vm.setEmployeeHistory();
          } else {
            commonService.showSnackbar('error', 'Please fill all mandetory fields', '0');
            isFormValid = false;
          }
        }
      });
      $scope.$watch('vm.signature', function (value) {
      });
    }

    vm.refChannelMedia = [{
      mediaName: 'Web',
      selected: false
    }, {
      mediaName: 'Reference',
      selected: false
    }, {
      mediaName: 'Friend',
      selected: false
    }];

    vm.favourableShifts = [{
      shiftTypeName: '1st',
      selected: false
    }, {
      shiftTypeName: '2nd',
      selected: false
    }, {
      shiftTypeName: '3rd',
      selected: false
    }, {
      shiftTypeName: 'Any',
      selected: false
    }];

    vm.educationLevel = [{
      educationName: 'High School',
      selected: false
    }, {
      educationName: 'Diploma/GED',
      selected: false
    }, {
      educationName: 'College/Degree',
      selected: false
    }, {
      educationName: 'Degree',
      selected: false
    }];

    vm.favourableDays = [{
      shiftTypeName: 'Mon',
      selected: false
    }, {
      shiftTypeName: 'Tue',
      selected: false
    }, {
      shiftTypeName: 'Wed',
      selected: false
    }, {
      shiftTypeName: 'Thu',
      selected: false
    }, {
      shiftTypeName: 'Fri',
      selected: false
    }, {
      shiftTypeName: 'Weekends',
      selected: false
    }];

    vm.modeOfPayments = [{
      paymentType: 'Direct Deposit',
      selected: false
    }, {
      paymentType: 'Mail',
      selected: false
    }];

    vm.workingHours = [{
      workType: 'Full Time',
      selected: false
    }, {
      workType: 'Part Time',
      selected: false
    }];

    vm.salary = [{
      salaryType: 'Annual Salary',
      selected: false
    }, {
      salaryType: 'Hourly Wage',
      selected: false
    }];

    // Test comment
    vm.user = $rootScope.user;
    $scope.amDisabled = true;

    vm.personalDetails = {
      firstName: '',
      middleName: '',
      lastName: '',
      nickName: '',
      email: '',
      phoneNumber: '',
      mobileNumber: '',
      birthDate: '',
      drivingLicence: '',
      gender: '',
      stateOfIssue: '',
      socialSecurity: '',
      currAddress1: '',
      currAddress2: '',
      currState: '',
      currCity: '',
      prevAddress1: '',
      prevAddress2: '',
      prevState: '',
      prevCity: '',
      remark: '',
      isDrivingLicence: '',
      pager: '',
      emergencyContact: '',
      emergencyNumber: ''
    };

    vm.employmentDetails = {
      refChannelMedia: vm.refChannelMedia,
      refChannelMediaWeb: true,
      refChannelMediaReference: false,
      refChannelMediaFriend: false,
      isAppliedBefore: '',
      preApplicationMonth: '',
      preApplicationYear: '',
      exTruecadenceEmployee: '',
      exTruecadenceEmployeeYear: '',
      exTruecadenceEmployeePlace: '',
      exTruecadenceEmployeePosition: '',
      isAdult: true,
      underAgeWorkPermit: null,
      educationLevel: '',
      isUSWorkPermit: '',
      areaOfWork: '',
      positionsInterested: '',
      shiftFirst: '',
      shiftSecond: '',
      shiftThird: '',
      shiftFourth: '',
      mon: '',
      tue: '',
      wed: '',
      thu: '',
      fri: '',
      sat: '',
      sun: '',
      partTimeHrs: '',
      modeOfPayments: '',
      isTransportationAvailable: '',
      isSuspended: '',
      descriptionForSuspention: ''
    };

    vm.Company_Name = '';
    vm.Phone = '';
    vm.Address_1 = '';
    vm.Address_2 = '';
    vm.Country = '';
    vm.State = '';
    vm.City = '';
    vm.ZIP = '';
    vm.Start_Date = '';
    vm.End_Date = '';
    vm.Starting_Salary = '';
    vm.Ending_Salary = 0;
    vm.Starting_Position = '';
    vm.Ending_Position = '';
    vm.Supervisor_Name = '';
    vm.Supervisor_Title = '';
    vm.Job_Description = '';
    vm.Reason_For_Leaving = '';

    vm.validateForm = function (booleanValue) {
      if (booleanValue) {
        isFormValid = true;
      } else {
        commonService.showSnackbar('error', 'Please fill all mandetory fields', '0');
        isFormValid = false;
      }

      return isFormValid;
    };

    vm.validateTab2Form = function () {
      isFormValid = true;

      if (vm.refChannelSelectedCount === 0 || vm.educationLevelArray.length === 0 ||
        vm.favourableShiftsCount === 0 || vm.favShiftDaysCount === 0 ||
        vm.modeOfPaymentArray.length === 0) {
        isFormValid = false;
      }

      return isFormValid;
    };

    function getCountry() {
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCountry()
        .then(function (data) {
          if (data.status === 200) {
            vm.countryList = data.data;

            for (var i = 0; i < vm.countryList.length; i++) {
              if (vm.countryList[i].id === '5a27bc1dca133a14e01bf2df') {
                vm.Country = vm.countryList[i].id;
                vm.getStateByCountryId(vm.Country);
              }
            }

            deferred.resolve(data);
            vm.getState(_.find(vm.countryList, {
              Short_Name: 'US'
            }).id);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
    }

    vm.filterCountry = function (countryID) {
      for (var i = 0; i < vm.countryList.length; i++) {
        if (countryID === vm.countryList[i].id) {
          return vm.countryList[i].Name;
        }
      }
    };

    vm.getState = function (countryId) {
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCountryById(countryId)
        .then(function (data) {
          if (data.status === 200) {
            vm.stateOfIssueList = data.data;
            deferred.resolve(data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
    };

    vm.filterState = function (stateID) {
      for (var i = 0; i < vm.stateOfIssueList.length; i++) {
        if (stateID === vm.stateOfIssueList[i].id) {
          return vm.stateOfIssueList[i].Name;
        }
      }
    };

    vm.getStateByCountryId = function (countryId) {
      vm.stateData = {
        id: countryId,
        state: true
      };

      var deferred = $q.defer();
      vm.promise = newCandidateServices.getStateByCountryId(vm.stateData)
        .then(function (data) {
          if (data.status === 200) {
            vm.stateListByCountryId = data.data;
            deferred.resolve(data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
    };

    vm.filterEmployeeState = function (stateID) {
      for (var i = 0; i < vm.stateListByCountryId.length; i++) {
        if (stateID === vm.stateListByCountryId[i].id) {
          return vm.stateListByCountryId[i].Name;
        }
      }
    };

    vm.getCity = function (stateId) {
      vm.stateData = {
        id: stateId,
        city: true
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCity(vm.stateData)
        .then(function (data) {
          if (data.status === 200) {
            vm.cityList = '';
            vm.cityList = data.data;
            deferred.resolve(data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
    };

    vm.filterCity = function (cityID) {
      if (vm.cityList !== undefined) {
        for (var i = 0; i < vm.cityList.length; i++) {
          if (cityID === vm.cityList[i].id) {
            return vm.cityList[i].Name;
          }
        }
      }
    };

    vm.getPrevCity = function (stateId) {
      vm.stateData = {
        id: stateId,
        city: true
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCity(vm.stateData)
        .then(function (data) {
          if (data.status === 200) {
            vm.prevCityList = data.data;
            deferred.resolve(data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
    };

    vm.getHistoryCity = function (stateId) {
      vm.stateData = {
        id: stateId,
        city: true
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCity(vm.stateData)
        .then(function (data) {
          if (data.status === 200) {
            vm.historyCityList = data.data;
            deferred.resolve(data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
    };

    vm.filterEmployeeCity = function (cityID) {
      for (var i = 0; i < vm.historyCityList.length; i++) {
        if (cityID === vm.historyCityList[i].id) {
          return vm.historyCityList[i].Name;
        }
      }
    };

    function getJobProfileList() {
      var listParam = {
        Is_Active: true
      };
      vm.promise = jobProfileService.getJobList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.positionsApplying = data.data;
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    function getAllJobProfileList() {
      var listParam = {
      };
      vm.promise = jobProfileService.getJobList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.Allpositions = data.data;

            for (var i = 0; i < vm.Allpositions.length; i++) {
              if (vm.Allpositions[i].Profile_Name === 'Other' && vm.Allpositions[i].id === '5c5950be2aeccc616af14468') {
                vm.otherProfilename = vm.Allpositions.splice(i, 1);
              }
            }

            vm.Allpositions.push(vm.otherProfilename[0]);
            getCandidateDetail();
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    vm.filterPosition = function (positionID) {
      for (var i = 0; i < vm.Allpositions.length; i++) {
        if (positionID === vm.Allpositions[i].id) {
          return vm.Allpositions[i].Profile_Name;
        }
      }
    };

    function getCandidateDetail() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: '5a731364f1975b335801cdaa',
        FormMasterID: '5a7073f16fd9811d1c786ffe'
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCandidatDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.candidatDetails = data.data;
            vm.personalDetails.firstName = vm.candidatDetails.First_Name;
            vm.personalDetails.middleName = vm.candidatDetails.Middle_Name;
            vm.personalDetails.lastName = vm.candidatDetails.Last_Name;
            vm.personalDetails.nickName = vm.candidatDetails.Nick_Name;
            vm.personalDetails.otherLastName = vm.candidatDetails.Other_Last_Name;
            vm.personalDetails.email = vm.candidatDetails.Email_ID;
            vm.personalDetails.phoneNumber = vm.candidatDetails.Decription_Pre_Employment;
            vm.personalDetails.otherPhone = vm.candidatDetails.Other_Phone;
            vm.personalDetails.pager = vm.candidatDetails.Pager;

            if (vm.candidatDetails.Cell_Phone === 0) {
              vm.personalDetails.mobileNumber = '';
            } else {
              vm.personalDetails.mobileNumber = vm.candidatDetails.Cell_Phone;
            }

            vm.personalDetails.birthDate = moment(vm.candidatDetails.DOB).format('MM/DD/YYYY');

            if (vm.candidatDetails.Emergency_Phone !== 0) {
              vm.personalDetails.emergencyNumber = vm.candidatDetails.Emergency_Phone;
            }

            vm.personalDetails.emergencyContact = vm.candidatDetails.Emergency_Contact_Name;
            vm.personalDetails.isDrivingLicence = vm.candidatDetails.bSADisclosureReleases[0].
              Is_Driving_License;
            vm.personalDetails.drivingLicence = vm.candidatDetails.bSADisclosureReleases[0].
              Driving_License_No;
            vm.personalDetails.stateOfIssue = vm.candidatDetails.bSADisclosureReleases[0].
              state;
            vm.personalDetails.gender = vm.candidatDetails.Gender;
            vm.personalDetails.socialSecurity = vm.candidatDetails.Social_Security_Number;
            vm.personalDetails.currAddress1 = vm.candidatDetails.Address_1;
            vm.personalDetails.currAddress2 = vm.candidatDetails.Address_2;
            vm.personalDetails.currState = vm.candidatDetails.State;
            vm.getCity(vm.candidatDetails.State);
            vm.personalDetails.currCity = vm.candidatDetails.City;
            vm.personalDetails.currentZipcode = vm.candidatDetails.ZIP;
            vm.personalDetails.prevAddress1 = vm.candidatDetails.Permanent_Address_1;
            vm.personalDetails.prevAddress2 = vm.candidatDetails.Permanent_Address_2;
            vm.personalDetails.prevState = vm.candidatDetails.Permanent_State;
            vm.getPrevCity(vm.candidatDetails.Permanent_State);
            vm.personalDetails.prevCity = vm.candidatDetails.Permanent_City;
            vm.personalDetails.previousZipcode = vm.candidatDetails.Permanent_ZIP;
            vm.personalDetails.remark = vm.candidatDetails.Ref_Description;

            // Employment Details

            vm.refChannelMedia = vm.candidatDetails.Ref_Channel_Media;
            vm.refChannelSelectedCount = $filter('filter')(vm.refChannelMedia, {
              selected: true
            })
              .length;
            vm.employmentDetails.isAppliedBefore = vm.candidatDetails.Is_Applied_Before;
            vm.employmentDetails.preApplicationMonth = vm.candidatDetails.Pre_Application_Month;
            vm.employmentDetails.exTruecadenceEmployee = vm.candidatDetails.Ex_Trucadence_Employee;
            vm.employmentDetails.exTruecadenceEmployeeYear = vm.candidatDetails
              .Ex_Trucadence_Employee_Year;
            vm.employmentDetails.exTruecadenceEmployeePlace = vm.candidatDetails
              .Ex_Trucadence_Employee_Place;
            vm.employmentDetails.exTruecadenceEmployeePosition = vm.candidatDetails
              .Ex_Trucadence_Employee_Position;
            vm.employmentDetails.isAdult = vm.candidatDetails.Is_Adult;
            vm.employmentDetails.underAgeWorkPermit = vm.candidatDetails.Is_US_WorkPermit;
            vm.educationLevel = vm.candidatDetails.Education_Level;
            vm.employmentDetails.isUSWorkPermit = vm.candidatDetails.Is_US_WorkPermit;
            vm.employmentDetails.areaOfWork = vm.candidatDetails.Area_Of_Work;
            vm.employmentDetails.positionsInterested = vm.candidatDetails.positionInterested;
            vm.favourableShifts = vm.candidatDetails.Favourable_Shifts;
            vm.favourableShiftsCount = $filter('filter')(vm.favourableShifts, {
              selected: true
            })
              .length;
            vm.favourableDays = vm.candidatDetails.Favourable_Days;
            vm.favourableDaysCount = $filter('filter')(vm.favourableDays, {
              selected: true
            })
              .length;
            vm.workingHours = vm.candidatDetails.Part_Time_Hour;
            vm.modeOfPayments = vm.candidatDetails.Mode_Of_Payment;
            vm.employmentDetails.isTransportationAvailable = vm.candidatDetails
              .Is_Transportation_Available;
            vm.employmentDetails.isSuspended = vm.candidatDetails.Is_Suspended;
            vm.employmentDetails.descriptionForSuspention = vm.candidatDetails
              .Description_For_Suspension;
            vm.EmploymentDetails = vm.candidatDetails.employmentDetails;
            initializeEmployeeDetailsStateAndCityList();
            vm.getImage = function () {
              return vm.candidatDetails.candidateAttachments[0]
                .Metadata_URL;
            };

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

    function initializeEmployeeDetailsStateAndCityList() {
      if (vm.EmploymentDetails.length > 0) {
        vm.Country1 = vm.EmploymentDetails[0].Country;

        if (vm.Country1) {
          vm.getStateByCountryId(vm.Country1);
        }

        vm.State1 = vm.EmploymentDetails[0].State;

        if (vm.State1) {
          vm.getHistoryCity(vm.State1);
        }
      }
    }

    vm.setEmployeeHistory = function () {
      for (var j = 0; j < vm.EmploymentDetails.length; j++) {
        if (vm.EmploymentDetails[j].hasOwnProperty('Country')) {
          vm.EmploymentDetails[j].Country = vm.EmploymentDetails[j].Country;
        }

        if (vm.EmploymentDetails[j].hasOwnProperty('State')) {
          vm.EmploymentDetails[j].State = vm.EmploymentDetails[j].State;
        }

        if (vm.EmploymentDetails[j].hasOwnProperty('City')) {
          vm.EmploymentDetails[j].City = vm.EmploymentDetails[j].City;
        }

        if (vm.EmploymentDetails[j].hasOwnProperty('id')) {
          vm.EmploymentDetails[j].Ending_Salary = vm.EmploymentDetails[j].Ending_Salary;
          vm.EmploymentDetails[j].Phone = vm.EmploymentDetails[j].Phone.toString();
        }

        if (vm.EmploymentDetails[j].hasOwnProperty('Starting_Position')) {
          vm.EmploymentDetails[j].Starting_Position = vm.EmploymentDetails[j].Starting_Position;
        }

        // Condidate Edit controller
        vm.EmploymentDetails[j].Candidate_ID = vm.candidatDetails.id;
      }

      vm.savePersonalDetails();
    };

    vm.savePersonalDetails = function () {
      /* jshint maxcomplexity:13  */
      var CandidateAttachmentobject = {
        id:
          (vm.candidatDetails.candidateAttachments.length > 0) ? vm.candidatDetails.candidateAttachments[0].id : 'na',
        Candidate_ID: vm.candidatDetails.id,
        Attachment_Type_ID: '5a731364f1975b335801cdaa',
        Attachment_Date: vm.AssignedDate,
        Metadata_URL: vm.signature.dataUrl,
        Form_Master_ID: '5a7073f16fd9811d1c786ffe'
      };
      CandidateAttachments.splice(0, 1, CandidateAttachmentobject);

      var BSADisclosureReleasesObject = {
        id:
          (vm.candidatDetails.bSADisclosureReleases.length > 0) ? vm.candidatDetails.bSADisclosureReleases[0].id : 'na',
        Candidate_ID: vm.candidatDetails.id,
        Driving_License_No: vm.personalDetails.drivingLicence,

        // State_Issuing: vm.personalDetails.stateOfIssue,
        Maiden_Name_Used: '',
        Is_ConsumerReport_Available: false,
        Is_ConsumerReport_Provided: false,
        Is_Driving_License: vm.personalDetails.isDrivingLicence,
        Company_Representative_Name: '',
        Is_DNA_Declaration_Done: false
      };

      BSADisclosureReleasesObject.State_Issuing =
        vm.personalDetails.stateOfIssue ? vm.personalDetails.stateOfIssue.id : undefined;

      BSADisclosureReleases.splice(0, 1, BSADisclosureReleasesObject);
      var sendData = {
        id: vm.candidatDetails.id,
        Application_ID: '',
        Application_Date: moment(new Date()).format('MM/DD/YYYY'),
        Social_Security_Number: vm.personalDetails.socialSecurity,
        First_Name: vm.personalDetails.firstName,
        Middle_Name: vm.personalDetails.middleName,
        Last_Name: vm.personalDetails.lastName,
        Nick_Name: vm.personalDetails.nickName,
        DOB: moment(vm.personalDetails.birthDate).format('MM/DD/YYYY'),
        Gender: vm.personalDetails.gender,
        Marital_Status: vm.candidatDetails.Marital_Status,
        Other_Last_Name: '',
        Address_1: vm.personalDetails.currAddress1,
        Address_2: vm.personalDetails.currAddress2,
        City: vm.personalDetails.currCity,
        State: vm.personalDetails.currState,
        ZIP: vm.personalDetails.currentZipcode,

        // Other_Phone: vm.personalDetails.otherPhone.toString(),
        Cell_Phone: (vm.personalDetails.mobileNumber) ? vm.personalDetails.mobileNumber.toString() : '',
        Pager: vm.personalDetails.pager,
        Emergency_Phone: (vm.personalDetails.emergencyNumber) ? vm.personalDetails.emergencyNumber.toString() : '',
        Emergency_Contact_Name: vm.personalDetails.emergencyContact,
        Email_ID: vm.personalDetails.email,
        Permanent_Address_1: vm.personalDetails.prevAddress1,
        Permanent_Address_2: vm.personalDetails.prevAddress2,
        Permanent_City: vm.personalDetails.prevCity,
        Permanent_State: vm.personalDetails.prevState,
        Permanent_ZIP: vm.personalDetails.previousZipcode,
        Ref_Channel_Media: _.map(vm.refChannelMedia, function (o) {
          return _.omit(o, '$$hashKey');
        }),
        Ref_Description: vm.personalDetails.remark,
        Is_Applied_Before:
          (vm.employmentDetails.isAppliedBefore) ? vm.employmentDetails.isAppliedBefore.toString() : '',
        Pre_Application_Month: vm.employmentDetails.preApplicationMonth
          .toString(),
        Pre_Application_Year: '',
        Ex_Trucadence_Employee: vm.employmentDetails.exTruecadenceEmployee,
        Ex_Trucadence_Employee_Place: vm.employmentDetails.exTruecadenceEmployeePlace,
        Ex_Trucadence_Employee_Year:
          (vm.employmentDetails.exTruecadenceEmployeeYear) ?
            vm.employmentDetails.exTruecadenceEmployeeYear.toString() : '',
        Ex_Trucadence_Employee_Position: vm.employmentDetails.exTruecadenceEmployeePosition,
        Decription_Pre_Employment: vm.personalDetails.phoneNumber,
        Is_Adult: vm.employmentDetails.isAdult,
        Underage_WorkPermit: vm.employmentDetails.underAgeWorkPermit,
        Education_Level: _.map(vm.educationLevel, function (o) {
          return _.omit(o, '$$hashKey');
        }),
        Is_US_WorkPermit: (vm.employmentDetails.isUSWorkPermit) ? vm.employmentDetails.isUSWorkPermit.toString() : '',
        Area_Of_Work: vm.employmentDetails.areaOfWork,
        Favourable_Shifts: _.map(vm.favourableShifts, function (o) {
          return _.omit(o, '$$hashKey');
        }),
        Favourable_Days: _.map(vm.favourableDays, function (o) {
          return _.omit(o, '$$hashKey');
        }),
        Is_Part_Time: true,
        Part_Time_Hour: _.map(vm.workingHours, function (o) {
          return _.omit(o, '$$hashKey');
        }),
        Mode_Of_Payment: _.map(vm.modeOfPayments, function (o) {
          return _.omit(o, '$$hashKey');
        }),
        Is_Transportation_Available: (vm.employmentDetails.isTransportationAvailable) ?
          vm.employmentDetails.isTransportationAvailable.toString() : '',
        Is_Suspended: vm.employmentDetails.isSuspended,
        Description_For_Suspension: vm.employmentDetails.descriptionForSuspention,
        BSADisclosureReleases: BSADisclosureReleases,
        EmploymentDetails: vm.EmploymentDetails,
        CandidateAttachments: CandidateAttachments
      };
      console.log(typeof vm.employmentDetails.positionsInterested);

      if (vm.employmentDetails.positionsInterested !== undefined) {
        sendData.Positions_Interested = vm.employmentDetails.positionsInterested.id;
      }

      sendData.Other_Phone =
        vm.personalDetails.otherPhone ? vm.personalDetails.otherPhone.toString() : undefined;
      vm.promise = newCandidateServices.updateCandidateDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            if (vm.partialSave) {
              vm.EmploymentDetails = response.data.employmentDetails ?
                response.data.employmentDetails : vm.EmploymentDetails;
              commonService.showSnackbar('info', 'Form Saved');
            } else {
              $state.go('app.candidateDetail', {
                candidateID: $state.params.candidate.id
              });
              commonService.showSnackbar('info', 'Candidate details updated sucessfully', response.status);
            }
          } else {
            commonService.showSnackbar('error', 'Error While updating Candidate details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While updating Candidate details', response.status);
        });
    };

    vm.editEmploymentHistory = function (index) {
      vm.emHistorySaveButton = false;
      vm.emHistoryCancelButton = false;
      vm.emHistoryAddMoreButton = true;
      var editEmploymentHistoryObject = '';
      editIndex = index;
      editEmploymentHistoryObject = vm.EmploymentDetails[editIndex];
      vm.Company_Name = editEmploymentHistoryObject.Company_Name;
      vm.Phone = editEmploymentHistoryObject.Phone > 0 ? editEmploymentHistoryObject.Phone : '';
      vm.Address_1 = editEmploymentHistoryObject.Address_1;
      vm.Address_2 = editEmploymentHistoryObject.Address_2;
      vm.Country = editEmploymentHistoryObject.Country;

      if (vm.Country) {
        vm.getStateByCountryId(vm.Country);
      }

      vm.State = editEmploymentHistoryObject.State;

      if (vm.State) {
        vm.getHistoryCity(vm.State);
      }

      vm.City = editEmploymentHistoryObject.City;
      vm.ZIP = editEmploymentHistoryObject.ZIP;
      vm.Start_Date = moment(editEmploymentHistoryObject.Start_Date).format('MM/DD/YYYY');
      vm.End_Date = moment(editEmploymentHistoryObject.End_Date).format('MM/DD/YYYY');
      vm.salary = editEmploymentHistoryObject.Starting_SalaryArray;
      vm.Ending_Salary = Number(editEmploymentHistoryObject.Ending_Salary);
      vm.Starting_Position = editEmploymentHistoryObject.Starting_Position;
      vm.Supervisor_Name = editEmploymentHistoryObject.Supervisor_Name;
      vm.Supervisor_Title = editEmploymentHistoryObject.Supervisor_Title;
      vm.Job_Description = editEmploymentHistoryObject.Job_Description;
      vm.Reason_For_Leaving = editEmploymentHistoryObject.Reason_For_Leaving;
      vm.employment_History_id = editEmploymentHistoryObject.id;
      vm.OtherProfilePosition = editEmploymentHistoryObject.Other_Position;
      vm.showOtherField = vm.OtherProfilePosition ? true : false;
    };

    vm.addEmploymentHistory = function () {
      if ($scope.tab3From.$valid && vm.salaryArray.length !== 0) {
        // Add the new item to the Array.
        var employmentHistory = {};
        employmentHistory.Company_Name = vm.Company_Name;
        employmentHistory.Phone = vm.Phone.toString();
        employmentHistory.Address_1 = vm.Address_1;
        employmentHistory.Address_2 = vm.Address_2;
        employmentHistory.Country = vm.Country;
        employmentHistory.State = vm.State;
        employmentHistory.City = vm.City;
        employmentHistory.ZIP = vm.ZIP.toString();
        employmentHistory.Start_Date = moment(vm.Start_Date).format('MM/DD/YYYY');
        employmentHistory.End_Date = moment(vm.End_Date).format('MM/DD/YYYY');
        employmentHistory.Starting_SalaryArray = _.map(vm.salary, function (o) {
          return _.omit(o, '$$hashKey');
        });
        employmentHistory.Ending_Salary = vm.Ending_Salary;
        employmentHistory.Starting_Position = vm.Starting_Position;
        employmentHistory.Supervisor_Name = vm.Supervisor_Name;
        employmentHistory.Supervisor_Title = vm.Supervisor_Title;
        employmentHistory.Job_Description = vm.Job_Description;
        employmentHistory.Reason_For_Leaving = vm.Reason_For_Leaving;
        employmentHistory.Other_Position = vm.OtherProfilePosition;

        if (editIndex >= 0) {
          employmentHistory.id = vm.employment_History_id;
          employmentHistory.Candidate_ID = vm.candidatDetails.id;
          vm.EmploymentDetails[editIndex] = _.omitBy(employmentHistory, _.isNil);
          vm.emHistorySaveButton = true;
          vm.emHistoryCancelButton = true;
          vm.emHistoryAddMoreButton = false;
          editIndex = -1;
        } else {
          vm.EmploymentDetails.push(_.omitBy(employmentHistory, _.isNil));
        }

        // Clear the TextBoxes.
        vm.clearEmploymentHistoryForm();
        $scope.tab3From.$setPristine();
      } else {
        commonService.showSnackbar('error', 'Please fill all mandetory fields', '0');
      }
    };

    vm.removeEmploymentHistory = function (index) {
      // Find the record using Index from Array.
      var name = vm.EmploymentDetails[index].Company_Name;

      if ($window.confirm('Do you want to delete: ' + name)) {
        // Remove the item from Array using Index.

        var listparam = {
          candidateId: $state.params.candidate.id,
          employmentId: vm.EmploymentDetails[index].id
        };
        var deferred = $q.defer();
        vm.promise = newCandidateServices.removeEmploymentDetails(listparam)
          .then(function (data) {
            if (data.status === 200) {
              deferred.resolve(data);
            } else {
              deferred.reject(data);
            }
          }, function (response) {
            deferred.reject(response);
          });
        vm.EmploymentDetails.splice(index, 1);
      }
    };

    vm.clearEmploymentHistoryForm = function () {
      if (editIndex >= 0) {
        vm.emHistorySaveButton = true;
        vm.emHistoryCancelButton = true;
        vm.emHistoryAddMoreButton = false;
        editIndex = -1;
      }

      vm.Company_Name = '';
      vm.Phone = '';
      vm.Address_1 = '';
      vm.Address_2 = '';
      vm.Country = '';
      vm.State = '';
      vm.City = '';
      vm.ZIP = '';
      vm.Start_Date = '';
      vm.End_Date = '';
      vm.Starting_Salary = '';
      vm.Ending_Salary = 0;
      vm.Starting_Position = '';
      vm.Supervisor_Name = '';
      vm.Supervisor_Title = '';
      vm.Job_Description = '';
      vm.Reason_For_Leaving = '';
      vm.salary[0].selected = false;
      vm.salary[1].selected = false;
      vm.OtherProfilePosition = '';
      vm.showOtherField = false;
    };

    vm.refChannelArray = [];

    vm.validateRefChannel = function (event, value) {
      event.stopPropagation();

      if (value.selected) {
        delete value['$$hashKey'];
        vm.refChannelSelectedCount++;
      } else {
        vm.refChannelSelectedCount--;
      }
    };

    vm.educationLevelArray = vm.educationLevel;

    vm.validateEducationLevel = function (event, value) {
      vm.educationLevelArray[0] = value;

      for (var i = 0; i < vm.educationLevel.length; i++) {
        if (vm.educationLevelArray[0].educationName === vm.educationLevel[i].educationName) {
          vm.educationLevel[i].selected = true;
        } else {
          vm.educationLevel[i].selected = false;
        }
      }
    };

    vm.favourableShiftsArray = [];

    vm.validateFavourableShifts = function (event, value) {
      event.stopPropagation();

      if (value.selected) {
        delete value['$$hashKey'];
        vm.favourableShiftsCount++;
      } else {
        vm.favourableShiftsCount--;
      }
    };

    vm.favShiftDaysArray = [];

    vm.validateFavShiftDays = function (event, value) {
      event.stopPropagation();

      if (value.selected) {
        delete value['$$hashKey'];
        vm.favourableDaysCount++;
      } else {
        vm.favourableDaysCount--;
      }
    };

    vm.modeOfPaymentArray = vm.modeOfPayments;
    vm.validateModeOfPayments = function (event, value) {
      vm.modeOfPaymentArray[0] = value;

      for (var i = 0; i < vm.modeOfPayments.length; i++) {
        if (vm.modeOfPaymentArray[0].paymentType === vm.modeOfPayments[i].paymentType) {
          vm.modeOfPayments[i].selected = true;
        } else {
          vm.modeOfPayments[i].selected = false;
        }
      }
    };

    vm.workingHoursArray = [];

    vm.validateWorkingHour = function (event, value) {
      vm.workingHoursArray[0] = value;

      for (var i = 0; i < vm.workingHours.length; i++) {
        if (vm.workingHoursArray[0].workType === vm.workingHours[i].workType) {
          vm.workingHours[i].selected = true;
        } else {
          vm.workingHours[i].selected = false;
        }
      }
    };

    vm.salaryArray = [];

    vm.validatesalary = function (event, value) {
      vm.salaryArray[0] = value;

      for (var i = 0; i < vm.salary.length; i++) {
        if (vm.salaryArray[0].salaryType === vm.salary[i].salaryType) {
          vm.salary[i].selected = true;
        } else {
          vm.salary[i].selected = false;
        }
      }
    };

    vm.clear = function () {
      var canvas = document.querySelector('canvas');
      var signaturePad = new SignaturePad(canvas);

      // Clears the canvas
      signaturePad.clear();
      vm.signature.dataUrl = '';
      vm.signature = '';
      vm.signPadDisable = false;
    };

    vm.clearDrivingLicenceField = function () {
      vm.personalDetails.drivingLicence = '';
      vm.personalDetails.stateOfIssue = '';
    };

    vm.signaturePadDisabled = function () {
      vm.signPadDisable = true;
    };

    vm.otherFieldInput = function (value) {
      vm.OtherProfilePosition = '';

      if (value === '5c5950be2aeccc616af14468') {
        vm.showOtherField = true;
      } else {
        vm.showOtherField = false;
      }
    };
  }
})();
