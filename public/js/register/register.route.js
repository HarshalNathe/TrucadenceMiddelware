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
      'register', {
        url: '/register',
        templateUrl: 'register/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm'
      });
  }
})();
