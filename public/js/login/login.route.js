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
      'login', {
        url: '/login',
        templateUrl: 'login/login.html',
        controller: 'loginController',
        controllerAs: 'vm'
      }).state('verifyUser', {
        url: '/verifyUser/:token',
        templateUrl: 'login/login.html',
        title: 'Login',
        controller: 'loginController',
        controllerAs: 'vm',
        params: {
          token: null
        }
      });
  }
})();
