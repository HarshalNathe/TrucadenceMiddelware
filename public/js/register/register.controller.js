(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    'registerService',
    'configService',
    'utilService',
    'commonService',
    'toastr'
  ];

  function RegisterController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    registerService,
    configService,
    utilService,
    commonService,
    toastr) {
    var vm = this;
    vm.userData = {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      clientId: configService.header_clientid,
      clientSecret: configService.header_clientsecret
    };

    vm.register = register;

    function register() {
      vm.userData.username = vm.userData.email;
      vm.promise = registerService.register(vm.userData)
        .then(function (response) {
          if (response.status === 200) {
            $state.go('login');
            commonService.showSnackbar('info', response.data.message, response.status);
          } else {
            commonService.showSnackbar('error', response.data.message, response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }
  }
})();
