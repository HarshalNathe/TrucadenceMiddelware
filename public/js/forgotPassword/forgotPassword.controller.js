(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('ForgotPasswordController', ForgotPasswordController);

  ForgotPasswordController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    'loginService',
    'commonService',
    'toastr'
  ];

  function ForgotPasswordController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    loginService,
    commonService,
    toastr) {
    var vm = this;
    vm.email = '';
    vm.forgotPassword = forgotPassword;

    function forgotPassword() {
      vm.promise = loginService.forgotPassword(vm.email)
        .then(function (data) {
          if (data.status === 200) {
            commonService.showSnackbar('info', data.data.message, data.status);
          } else {
            commonService.showSnackbar('error', data.data.message, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }
  }
})();
