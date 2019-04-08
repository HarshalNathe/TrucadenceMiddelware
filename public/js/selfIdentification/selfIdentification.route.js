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
      'app.selfIdentification', {
        url: '/selfIdentification',
        templateUrl: 'selfIdentification/selfIdentification.html',
        controller: 'SelfIdentificationController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
