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
      'app.iNine', {
        url: '/iNine',
        templateUrl: 'iNine/iNine.html',
        controller: 'INineController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
