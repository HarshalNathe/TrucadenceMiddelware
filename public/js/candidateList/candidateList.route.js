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
      'app.candidate', {
        url: '/candidate',
        templateUrl: 'candidateList/candidateList.html',
        controller: 'CandidateListController',
        controllerAs: 'vm'
      });
  }
})();
