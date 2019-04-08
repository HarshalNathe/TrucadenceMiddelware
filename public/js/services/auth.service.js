(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('Auth', authService);

  authService.$inject = [];

  function authService() {
    var user;

    return {
      setUser: function (aUser) {
        user = aUser;
      },
      isLoggedIn: function () {
        return (user) ? user : false;
      }
    };
  }
})();
