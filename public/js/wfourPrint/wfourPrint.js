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
      'app.wfourPrint', {
        url: '/wfourPrint',
        templateUrl: 'wfourPrint/wfourPrint.html',
        controller: 'WfourPrintController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
