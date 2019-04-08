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
      'app.wfourIllinois', {
        url: '/wfourIllinois',
        templateUrl: 'wfourIllinois/wfourIllinois.html',
        controller: 'WfourIllinoisController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
