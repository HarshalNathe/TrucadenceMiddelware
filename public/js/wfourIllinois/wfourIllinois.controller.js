(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('WfourIllinoisController', WfourIllinoisController);

  WfourIllinoisController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state'
  ];

  function WfourIllinoisController(
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
