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
      'app.employerProfile', {
        url: '/employerProfile',
        templateUrl: 'employerProfile/employerProfile.html',
        controller: 'EmployerProfileController',
        controllerAs: 'vm',
      });
  }
})();
