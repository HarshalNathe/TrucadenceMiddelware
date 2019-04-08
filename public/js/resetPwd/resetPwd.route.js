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
      'resetPwd', {
        url: '/resetPwd/:token',
        templateUrl: 'resetPwd/resetPwd.html',
        controller: 'ResetPwdController',
        controllerAs: 'vm',
        params: {
          token: null
        }
      });
  }
})();
