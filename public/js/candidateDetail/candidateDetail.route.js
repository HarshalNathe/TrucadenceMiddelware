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
      'app.candidateDetail', {
        url: '/candidateDetail/:candidateID',
        templateUrl: 'candidateDetail/candidateDetail.html',
        controller: 'CandidateDetailController',
        controllerAs: 'vm'
      });
  }
})();
