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
      'app.memberApplication', {
        url: '/memberApplication',
        templateUrl: 'memberApplication/memberApplication.html',
        controller: 'MemberApplicationController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
