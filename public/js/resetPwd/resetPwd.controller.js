(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('ResetPwdController', ResetPwdController);

  ResetPwdController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$stateParams',
    'changePasswordService',
    'configService',
    'utilService',
    'commonService',
    'toastr'
  ];

  function ResetPwdController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $stateParams,
    changePasswordService,
    configService,
    utilService,
    commonService,
    toastr) {
    var vm = this;
    vm.token = $stateParams.token ? $stateParams.token : false;
    vm.newPassword = '';
    vm.changePassword = changePassword;

    function changePassword() {
      if (vm.token && $stateParams.token !== 'failed') {
        vm.promise = changePasswordService.changePassword(vm.token, vm.newPassword)
          .then(verifyUserSuccess, verifyUserError);
      } else if ($stateParams.token === 'failed') {
        commonService.showSnackbar('error', 'Change password failed !', '0');
      }

      function verifyUserSuccess(data) {
        if (data.data) {
          if (data.data.success) {
            commonService.showSnackbar('info', data.data.message, '0');
            $state.go('login');
          } else {
            $state.go('forgotPassword');
            commonService.showSnackbar('error', data.data.message, '0');
          }
        }
      }

      function verifyUserError(error) {
        commonService.showSnackbar('error', 'Change password failed !', '0');
      }
    }
  }
})();
