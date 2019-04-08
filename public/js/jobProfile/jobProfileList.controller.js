(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('JobProfileListController', JobProfileListController);

  JobProfileListController.$inject = [
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
    'lodash',
    '$timeout',
    'jobProfileService'
  ];

  function JobProfileListController(
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
    _,
    $timeout,
    jobProfileService
  ) {
    var vm = this;
    init();

    function init() {
      vm.globalLimit = 2000;
      vm.globalSkip = 0;
      getJobProfileList();
      vm.addProfileButtonDisabled = true;
      vm.updateProfileButtonDisabled = false;
    }

    // Test comment
    vm.user = $rootScope.user;
    vm.newProfileName = '';
    vm.updateProfileName = '';
    vm.Data = {};

    vm.goToCandidateDetail = function (candidateId) {
      $state.go('app.candidateDetail', {
        candidateID: candidateId
      });
    };

    function getJobProfileList() {
      var listParam = {};
      vm.promise = jobProfileService.getJobList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            $timeout(function () {
              vm.table = window.jQuery('#example').DataTable();
            }, 200);
            vm.filteredJobProfile = data.data;

            for (var i = 0; i < vm.filteredJobProfile.length; i++) {
              if (vm.filteredJobProfile[i].id === '5c5950be2aeccc616af14468') {
                vm.filteredJobProfile.splice(i, 1);
                vm.jobProfileList = vm.filteredJobProfile;
              }
            }
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    vm.newProfileButton = function (ProfileName) {
      vm.addProfileButtonDisabled = ProfileName ? false : true;
    };

    vm.updateProfileButton = function (ProfileName) {
      vm.updateProfileButtonDisabled = ProfileName ? false : true;
    };

    vm.saveJobProfile = function () {
      var jobProfile = {
        Profile_Name: vm.newProfileName,
        Is_Active: true
      };

      vm.promise = jobProfileService.saveJobProfile(jobProfile)
        .then(function (data) {
          if (data.status === 200) {
            vm.jobProfileList = '';
            vm.table.destroy();
            commonService.showSnackbar('info', 'Job Profile Added Sucessfully', data.status);
            getJobProfileList();
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    };

    vm.open = function (data) {
      vm.Data = data;
      vm.updateProfileName = data.Profile_Name;
    };

    vm.updateJobProfile = function (data) {
      var jobProfile = {};

      if (data === undefined) {
        jobProfile = {
          Profile_Name: vm.updateProfileName,
          Is_Active: vm.Data.Is_Active,
          id: vm.Data.id,
        };
      } else {
        jobProfile = {
          Is_Active: data.Is_Active,
          id: data.id,
        };
      }

      vm.promise = jobProfileService.updateJobDetails(jobProfile)
        .then(function (data) {
          if (data.status === 200) {
            vm.updateProfileName = '';
            vm.jobProfileList = '';
            vm.table.destroy();
            commonService.showSnackbar('info', 'Job Profile Updated Sucessfully', data.status);
            getJobProfileList();
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    };

    vm.clear = function () {
      vm.newProfileName = '';
      vm.addProfileButtonDisabled = true;
    };
  }
})();
