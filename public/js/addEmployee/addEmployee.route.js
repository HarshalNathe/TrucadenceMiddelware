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
        'app.addEmployee', {
          url: '/addEmployee',
          templateUrl: 'addEmployee/addEmployee.html',
          controller: 'AddEmployeeController',
          controllerAs: 'vm'
        });
    }
  })();
  