(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('UserProfileController', UserProfileController);

  UserProfileController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    'utilService',
    'commonService',
    'loginService',
    '$q'
  ];

  function UserProfileController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    utilService,
    commonService,
    loginService,
    $q) {
    var vm = this;
    vm.tagline = 'Dynamic Html Form Example';
    vm.userFirstName = '';
    vm.userLastName = '';
    vm.userEmail = '';
    vm.userMobileNo = '';
    vm.userAddress = '';
    vm.currentPassword = '';
    vm.newPassword = '';
    vm.confirmPassword = '';

    init();

    function init() {
      vm.userData = utilService.getItem('userData');
    }

    vm.userFirstName = vm.userData.user[0].firstName;
    vm.userLastName = vm.userData.user[0].lastName;
    vm.userEmail = vm.userData.user[0].email;
    vm.userAddress = vm.userData.user[0].address;
    vm.userMobileNo = vm.userData.user[0].mobileNo;

    vm.updateUserDetails = function () {
      if (vm.newPassword !== vm.confirmPassword) {
        commonService.showSnackbar('error', 'Password does not match', '0');
      } else {
        var listParams = {
          active: true,
          email: vm.userData.user[0].email,
          firstName: vm.userData.user[0].firstName,
          id: vm.userData.user[0].id,
          lastName: vm.userData.user[0].lastName,
          password: vm.confirmPassword,
          role: vm.userData.user[0].role.toString(),
          username: vm.userData.user[0].username,
        };

        vm.promise = loginService.updateUserDetails(listParams)
          .then(function (data) {
            if (data.status === 200) {
              commonService.showSnackbar('info', 'Password Changed sucessfully', data.status);
              vm.newPassword = '';
              vm.confirmPassword = '';
            } else {
              commonService.showSnackbar('error', 'Error While Changing Password', data.status);
            }
          }, function (response) {
            commonService.showSnackbar('error', response.statusText, response.status);
          });
      }
    };

    vm.updateDetails = function () {
      var listParams = {
        active: true,
        email: vm.userEmail,
        firstName: vm.userFirstName,
        address: vm.userAddress,
        id: vm.userData.user[0].id,
        lastName: vm.userLastName,
        role: vm.userData.user[0].role.toString(),
        username: vm.userData.user[0].username,
        mobileNo: vm.userMobileNo.toString(),
      };
      var deferred = $q.defer();
      vm.promise = loginService.updateDetails(listParams)
        .then(function (data) {
          if (data.status === 200) {
            commonService.showSnackbar('info', 'User details updated sucessfully', data.status);
            var userData = {
              token: vm.userData.token,
              user: []
            };
            userData.user.push(data.data);
            localStorage.setItem('userData', JSON.stringify(userData));
            deferred.resolve(data.data);
          } else {
            commonService.showSnackbar('error', 'Error While updating User details', data.status);
            deferred.reject(data.data);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
          deferred.reject(response.data);
        });
    };
  }
})();
