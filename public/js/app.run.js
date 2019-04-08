(function () {
  'use strict';

  angular
    .module('trucadence')
    .run(runBlock);

  runBlock.$inject = ['$rootScope', 'Auth', '$state', '$transitions'];

  function runBlock($rootScope, Auth, $state, $transitions) {
    var localizationConfig = {
      locale: navigator.language || '',
      path: 'locales/'
    };

    $transitions.onStart({}, function (trans) {
      var names = ['register', 'forgotPassword', 'verifyUser', 'resetPwd'];

      if (!Auth.isLoggedIn() && names.indexOf(trans.$to().name) === -1) {
        $state.go('login');
      }
    });
  }
})();
