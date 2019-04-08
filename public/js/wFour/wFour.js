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
      'app.wFour', {
        url: '/wFour',
        templateUrl: 'wFour/wFour.html',
        controller: 'WFourController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
