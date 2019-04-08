  (function () {
    'use strict';

    angular
      .module('trucadence')
      .config(routes);

    routes.$inject = ['$stateProvider',
      '$urlRouterProvider',
      '$locationProvider',
    ];

    function routes($stateProvider,
      $urlRouterProvider,
      $locationProvider) {
      $locationProvider.hashPrefix('');

      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

      // Each tab has its own nav history stack which is defined in the corresponding module.

      // If none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/login');
    }
  })();
  