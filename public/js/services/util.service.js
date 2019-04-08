(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('utilService', utilService);

  utilService.$inject = [
    'lodash'
  ];

  function utilService(
    _) {
    var service = {
      findObject: findObject,
      setItem: setItem,
      getItem: getItem,
      checkSecurePassword: checkSecurePassword
    };

    return service;

    function findObject(collection, criteria) {
      return _.find(collection, criteria);
    }

    function setItem(key, value) {
      localStorage.setItem(key, value);
    }

    function getItem(key) {
      return JSON.parse(localStorage.getItem(key));
    }

    function checkSecurePassword(securePassword) {
      var userData = JSON.parse(localStorage.getItem('userData'));
      var userPassword = userData.user[0].password;
      var result = false;

      if (userPassword === securePassword) {
        result = true;
      } else {
        result = false;
      }
      
      return result;
    }
  }
})();
