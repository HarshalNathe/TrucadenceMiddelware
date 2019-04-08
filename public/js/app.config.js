(function () {
  'use strict';

  angular
    .module('trucadence')
    .config(configure);

  configure.$inject = [
    '$httpProvider',
    'IdleProvider',
    'KeepaliveProvider'
  ];

  function configure(
    $httpProvider, IdleProvider, KeepaliveProvider) {
    activate();

    function activate() {
    }

    IdleProvider.idle(600);
    IdleProvider.timeout(1);
    KeepaliveProvider.interval(10);
  }
})();
