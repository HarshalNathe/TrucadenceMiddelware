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
      'app.illinois', {
        url: '/illinois',
        templateUrl: 'illinois/illinois.html',
        controller: 'IllinoisController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
