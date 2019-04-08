(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('WfourEighteenController', WfourEighteenController);

  WfourEighteenController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state'
  ];

  function WfourEighteenController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state) {
    var vm = this;
    vm.tagline = 'Dynamic Html Form Example';
  }
})();
