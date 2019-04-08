(function () {
  'use strict';

  angular
    .module('trucadence')
    .config(routes);

  routes.$inject = [
    '$stateProvider'
  ];

  function routes($stateProvider) {
    $stateProvider.state(
      'forgotPassword', {
        url: '/forgotPassword',
        templateUrl: 'forgotPassword/forgotPassword.html',
        controller: 'ForgotPasswordController',
        controllerAs: 'vm'
      });
  }
})();
