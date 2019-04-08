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
      'app.inineDocument', {
        url: '/inineDocument',
        templateUrl: 'inineDocument/inineDocument.html',
        controller: 'InineDocumentController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
