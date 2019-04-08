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
        'app.employerList', {
          url: '/employerList',
          templateUrl: 'employerList/employerList.html',
          controller: 'EmployerListController',
          controllerAs: 'vm',
          params: {
            candidate: null
          }
        });
    }
  })();
  