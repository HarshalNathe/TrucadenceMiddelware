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
      'app.newCandidateEdit', {
        url: '/newCandidateEdit',
        templateUrl: 'newCandidateEdit/newCandidateEdit.html',
        controller: 'NewCandidateEditController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
