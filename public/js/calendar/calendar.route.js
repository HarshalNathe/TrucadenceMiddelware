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
      'app.calendar', {
        url: '/calendar',
        templateUrl: 'calendar/calendar.html',
        controller: 'CalendarController',
        controllerAs: 'vm'
      });
  }
})();
