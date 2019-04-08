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
      'app.userProfile', {
        url: '/userProfile',
        templateUrl: 'userProfile/userProfile.html',
        controller: 'UserProfileController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
