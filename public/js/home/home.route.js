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
      'app.home', {
        url: '/home',
        templateUrl: 'home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      });
  }
})();
