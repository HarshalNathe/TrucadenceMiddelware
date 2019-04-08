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
      'app.jobprofile', {
        url: '/jobProfile',
        templateUrl: 'jobProfile/jobProfileList.html',
        controller: 'JobProfileListController',
        controllerAs: 'vm'
      });
  }
})();
