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
      'app.drugTesting', {
        url: '/drugTesting',
        templateUrl: 'drugTesting/drugTesting.html',
        controller: 'DrugTestingController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
