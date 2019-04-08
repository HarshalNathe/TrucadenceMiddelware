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
      'app.safetyRules', {
        url: '/safetyRules',
        templateUrl: 'safetyRules/safetyRules.html',
        controller: 'SafetyRulesController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
