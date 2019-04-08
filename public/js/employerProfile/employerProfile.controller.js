(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('EmployerProfileController', EmployerProfileController);

  EmployerProfileController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'loginService',
    'commonService',
    'toastr',
    'EmployeeProfileService',
    'jobProfileService'
  ];

  function EmployerProfileController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    loginService,
    commonService,
    toastr,
    EmployeeProfileService,
    jobProfileService) {
    var vm = this;
    vm.showConversionList = false;
    vm.editConversionTime = false;
    vm.editJobDescription = false;
    vm.editJobDescriptionTime = false;
    vm.shiftEdit = false;
    vm.editConversionTimeIndex = 0;
    vm.editDescriptionTimeIndex = 0;
    vm.shiftEditIndex = 0;
    var isFormValid = false;
    vm.editForm = false;

    vm.clientProfile = {
      Balance_With_Jobs: '',
      Billing_Address: '',
      Email: '',
      Employer_Name: '',
      Family_Name: '',
      Is_Active: '',
      Primary_Phone: '',
      Shipping_Address: '',
      Taxable: '',
      employersProfiles: [],
      id: ''
    };

    vm.ConversionTimeDetails = {
      Conversion_Fee: 0,
      Employer_Profile_Id: '',
      From_Hours: '',
      To_Hours: ''
    };

    vm.employersProfiles = {
      Employer_Id: $rootScope.employerID,
      Over_Time_Scheme: '',
      Regular_Commision: 0,
      Over_Time_Commision: 0,
      Background_Test_Cost: 0,
      Drug_Test_Cost: 0,
      Minimum_Work_Hours: 0,
      conversionTimes: [],
      employerShifts: [],
      id: ''
    };

    vm.employerShifts = {
      Employer_Profile_Id: '',
      Shift: '',
      Days: '',
      Start_Time: '',
      End_Time: '',
      Break: 0,
      shiftJobProfiles: []
    };

    vm.shiftJobProfiles = {
      Regular_Pay: '',
      Over_Time_Pay: '',
      Job_Profile_Id: ''
    };

    $window.jQuery('[data-toggle="tooltip"]').tooltip();

    init();

    function init() {
      $window.jQuery('#addProfileStartTimeDatePicker').datetimepicker({
        format: 'LT'
      });
      $window.jQuery('#addProfileEndTimeDatePicker').datetimepicker({
        format: 'LT'
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
          vm.onnextindex = index + 1;
          window.scrollTo(0, 0);
          switch (index) {
            case 1:
              if ($scope.addProfileForm.$valid && vm.employersProfiles.conversionTimes.length) {
                isFormValid = true;
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
          if ($scope.addProfileForm.$valid && vm.employersProfiles.conversionTimes.length &&
            vm.employersProfiles.employerShifts.length) {
            vm.saveOrUpdateEmployerProfile();
          } else {
            commonService.showSnackbar('error', 'Please fill all mandetory fields', '0');
          }
        }
      });

      getJobProfileList();
      getEmployerProfileDetails();
    }

    window.jQuery('#addProfileStartTimeDatePicker').on('dp.change', function (e) {
      vm.employerShifts.Start_Time = formatAMPM(new Date(e.date._d));
    });

    window.jQuery('#addProfileEndTimeDatePicker').on('dp.change', function (e) {
      vm.employerShifts.End_Time = formatAMPM(new Date(e.date._d));
    });

    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // The hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }

    function getJobProfileList() {
      var listParam = {
        Is_Active: true
      };
      vm.promise = jobProfileService.getJobList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.JobProfiles = data.data;
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    vm.filterJobProfile = function (profileID) {
      if (vm.JobProfiles !== undefined) {
        for (var i = 0; i < vm.JobProfiles.length; i++) {
          if (profileID === vm.JobProfiles[i].id) {
            return vm.JobProfiles[i].Profile_Name;
          }
        }
      }
    };

    function getEmployerProfileDetails() {
      var employerID = $rootScope.employerID;
      vm.promise = EmployeeProfileService.getEmployerProfile(employerID)
        .then(function (data) {
          if (data.status === 200) {
            vm.employerData = data.data;
            vm.clientProfile.Employer_Name = vm.employerData.Employer_Name;
            vm.employersProfiles.id = vm.employerData.employersProfiles[0].id ?
              vm.employerData.employersProfiles[0].id : '';
            vm.employersProfiles.Over_Time_Scheme = vm.employerData.employersProfiles[0].Over_Time_Scheme;
            vm.employersProfiles.Regular_Commision = vm.employerData.employersProfiles[0].Regular_Commision;
            vm.employersProfiles.Over_Time_Commision = vm.employerData.employersProfiles[0].Over_Time_Commision;
            vm.employersProfiles.Background_Test_Cost = vm.employerData.employersProfiles[0].Background_Test_Cost;
            vm.employersProfiles.Drug_Test_Cost = vm.employerData.employersProfiles[0].Drug_Test_Cost;
            vm.employersProfiles.Minimum_Work_Hours = vm.employerData.employersProfiles[0].Minimum_Work_Hours;
            vm.employersProfiles.conversionTimes = vm.employerData.employersProfiles[0].conversionTimes;
            vm.employersProfiles.employerShifts = vm.employerData.employersProfiles[0].employerShifts;
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    $scope.isObjectEmpty = function (card) {
      return Object.keys(card).length === 0;
    };

    vm.addConversionTimeList = function () {
      if (!$scope.isObjectEmpty(vm.ConversionTimeDetails)) {
        if (vm.editConversionTime) {
          vm.employersProfiles.conversionTimes[vm.editConversionTimeIndex].From_Hours =
            vm.ConversionTimeDetails.From_Hours;
          vm.employersProfiles.conversionTimes[vm.editConversionTimeIndex].To_Hours =
            vm.ConversionTimeDetails.To_Hours;
          vm.employersProfiles.conversionTimes[vm.editConversionTimeIndex].Conversion_Fee =
            vm.ConversionTimeDetails.Conversion_Fee;
        } else {
          vm.employersProfiles.conversionTimes.push(vm.ConversionTimeDetails);
        }

        vm.editConversionTime = false;
        vm.editForm = false;
        vm.ConversionTimeDetails = {};
        $scope.conversionform.$setPristine(true);
      }
    };

    vm.deleteConversionTime = function (index) {
      vm.employersProfiles.conversionTimes.splice(index, 1);
    };

    vm.editConversionData = function (index) {
      vm.editConversionTimeIndex = index;
      vm.editConversionTime = true;
      vm.editForm = true;
      vm.ConversionTimeDetails.From_Hours =
        vm.employersProfiles.conversionTimes[index].From_Hours;
      vm.ConversionTimeDetails.To_Hours =
        vm.employersProfiles.conversionTimes[index].To_Hours;
      vm.ConversionTimeDetails.Conversion_Fee =
        vm.employersProfiles.conversionTimes[index].Conversion_Fee;
    };

    vm.findIndex = function (index) {
      vm.shiftEditIndex = index;
    };

    vm.addJobDescription = function () {
      if (!$scope.isObjectEmpty(vm.shiftJobProfiles)) {
        if (vm.editJobDescriptionTime) {
          vm.employersProfiles.employerShifts[vm.shiftEditIndex].
          shiftJobProfiles[vm.editDescriptionTimeIndex].Regular_Pay =
            vm.shiftJobProfiles.Regular_Pay;
          vm.employersProfiles.employerShifts[vm.shiftEditIndex].
          shiftJobProfiles[vm.editDescriptionTimeIndex].Over_Time_Pay =
            vm.shiftJobProfiles.Over_Time_Pay;
          vm.employersProfiles.employerShifts[vm.shiftEditIndex].
          shiftJobProfiles[vm.editDescriptionTimeIndex].Job_Profile_Id =
            vm.shiftJobProfiles.Job_Profile_Id;
        } else {
          vm.employersProfiles.employerShifts[vm.shiftEditIndex].
          shiftJobProfiles.push(vm.shiftJobProfiles);
        }

        vm.editJobDescriptionTime = false;
      }
    };

    vm.editJobDescription = function (index) {
      vm.editDescriptionTimeIndex = index;
      vm.editJobDescriptionTime = true;

      vm.shiftJobProfiles = {
        Employer_Shift_Id: '',
        Regular_Pay: vm.employersProfiles.employerShifts[vm.shiftEditIndex].
        shiftJobProfiles[index].Regular_Pay,
        Over_Time_Pay: vm.employersProfiles.employerShifts[vm.shiftEditIndex].
        shiftJobProfiles[index].Over_Time_Pay,
        Job_Profile_Id: vm.employersProfiles.employerShifts[vm.shiftEditIndex].
        shiftJobProfiles[index].Job_Profile_Id
      };
    };

    vm.cancelJobDescription = function () {
      vm.editJobDescriptionTime = false;
    };

    vm.deleteJobDescription = function (index) {
      vm.employersProfiles.employerShifts[vm.shiftEditIndex].shiftJobProfiles.splice(index, 1);
    };

    vm.saveShiftDetails = function () {
      if (vm.shiftEdit) {
        vm.employersProfiles.employerShifts[vm.shiftEditIndex].Shift = vm.employerShifts.Shift;
        vm.employersProfiles.employerShifts[vm.shiftEditIndex].Days = vm.employerShifts.Days;
        vm.employersProfiles.employerShifts[vm.shiftEditIndex].Start_Time = vm.employerShifts.Start_Time;
        vm.employersProfiles.employerShifts[vm.shiftEditIndex].End_Time = vm.employerShifts.End_Time;
        vm.employersProfiles.employerShifts[vm.shiftEditIndex].Break = vm.employerShifts.Break;
        vm.shiftEdit = false;
      } else {
        vm.employersProfiles.employerShifts.push(vm.employerShifts);
      }

      vm.employerShifts = {
        Employer_Profile_Id: '',
        Shift: '',
        Days: '',
        Start_Time: '',
        End_Time: '',
        Break: 0,
        shiftJobProfiles: []
      };
      vm.editForm = false;
      vm.activeEditMenu = '';
      vm.activeMenu = '';
      $scope.shiftform.$setPristine();
    };

    vm.editshift = function (index, shift) {
      vm.shiftEdit = true;
      vm.editForm = true;
      vm.shiftEditIndex = index;
      vm.activeEditMenu = shift;
      vm.activeMenu = '';
      vm.employerShifts.Shift = vm.employersProfiles.employerShifts[index].Shift;
      vm.employerShifts.Days = vm.employersProfiles.employerShifts[index].Days;
      vm.employerShifts.Start_Time = vm.employersProfiles.employerShifts[index].Start_Time;
      vm.employerShifts.End_Time = vm.employersProfiles.employerShifts[index].End_Time;
      vm.employerShifts.Break = vm.employersProfiles.employerShifts[index].Break;
    };

    vm.deleteShift = function (index) {
      vm.employersProfiles.employerShifts.splice(index, 1);
    };

    vm.showShiftJobDescription = function (index, shift) {
      vm.shiftEditIndex = index;
      vm.activeMenu = shift;
      vm.shiftJobProfiles = {
        Employer_Shift_Id: '',
        Regular_Pay: undefined,
        Over_Time_Pay: undefined,
        Job_Profile_Id: ''
      };

      $scope.jobDescriptionForm.$setPristine();
      vm.activeEditMenu = '';
    };

    vm.saveOrUpdateEmployerProfile = function () {
      for (var i = 0; i < vm.employersProfiles.employerShifts.length; i++) {
        for (var j = 0; j < vm.employersProfiles.employerShifts[i].shiftJobProfiles.length; j++) {
          delete vm.employersProfiles.employerShifts[i].shiftJobProfiles[j].jobProfiles;
        }
      }

      var sendData = {
        Balance_With_Jobs: vm.employerData.Balance_With_Jobs,
        Billing_Address: vm.employerData.Billing_Address,
        Created_At: vm.employerData.Created_At,
        Email: vm.employerData.Email,
        Employer_Name: vm.employerData.Employer_Name,
        Family_Name: vm.employerData.Family_Name,
        Is_Active: vm.employerData.Is_Active,
        LastModified_At: vm.employerData.LastModified_At,
        Primary_Phone: vm.employerData.Primary_Phone,
        Shipping_Address: vm.employerData.Shipping_Address,
        Taxable: vm.employerData.Taxable,
        employersProfiles: vm.employersProfiles,
        id: vm.employerData.id
      };
      console.log('saveOrUpdateEmployerProfile-->', sendData); // Save object for POST service

      vm.promise = EmployeeProfileService.updateEmployersProfileDetails(sendData)
        .then(function (data) {
          if (data.status === 200) {
            commonService.showSnackbar('info', 'Employer Profile Updated Sucessfully', data.status);
          } else {
            commonService.showSnackbar('error', 'Error While Updating Employer Profile', data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });

      $state.go('app.employerList');
    };
  }
})();
