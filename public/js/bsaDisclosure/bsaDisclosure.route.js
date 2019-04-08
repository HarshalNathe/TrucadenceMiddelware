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
      'app.bsaDisclosure', {
        url: '/bsaDisclosure',
        templateUrl: 'bsaDisclosure/bsaDisclosure.html',
        controller: 'BsaDisclosureController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
