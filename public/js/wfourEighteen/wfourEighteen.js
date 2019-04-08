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
      'app.wfourEighteen', {
        url: '/wfourEighteen',
        templateUrl: 'wfourEighteen/wfourEighteen.html',
        controller: 'WfourEighteenController',
        controllerAs: 'vm',
        params: {
          candidate: null
        }
      });
  }
})();
