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
      'app.newCandidate', {
        url: '/newCandidate',
        templateUrl: 'newCandidate/newCandidate.html',
        controller: 'NewCandidateController',
        controllerAs: 'vm'
      });
  }
})();
