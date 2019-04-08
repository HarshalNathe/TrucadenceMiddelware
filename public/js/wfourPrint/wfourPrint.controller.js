(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('WfourPrintController', WfourPrintController);

  WfourPrintController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state'
  ];

  function WfourPrintController(
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
