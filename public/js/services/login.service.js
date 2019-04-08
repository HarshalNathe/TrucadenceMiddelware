(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('loginService', loginService);

  loginService.$inject = [
    '$http',
    'configService',
    '$httpParamSerializer',
    'utilService'
  ];

  function loginService(
    $http, configService, $httpParamSerializer, utilService) {
    $http.defaults.headers.common['clientId'] = configService.header_clientid;
    $http.defaults.headers.common['clientSecret'] = configService.header_clientsecret;

    var service = {
      login: login,
      verifyUser: verifyUser,
      forgotPassword: forgotPassword,
      resetToken: resetToken,
      updateUserDetails: updateUserDetails,
      updateDetails: updateDetails
    };

    return service;

    function login(user) {
      var method = 'POST';
      var url = configService.API_URL + '/login';
      var params = user || {};

      var promise = $http({ method: method, url: url, data: params }).
        then(function (response) {
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }

    function verifyUser(token) {
      var method = 'GET';
      var url = configService.API_URL + '/verify/' + token;
      var params = token || {};
      var promise = $http({ method: method, url: url, params: params }).
        then(function (response) {
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }

    function forgotPassword(email) {
      var method = 'POST';
      var url = configService.API_URL + '/forgotPassword';
      var param = { email: email };
      var promise = $http({
        method: method,
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (obj) {
          var str = [];

          for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
              str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
          }

          return str.join('&');
        },
        data: param
      }).
        then(function (response) {
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }

    function resetToken(token) {
      var method = 'POST';
      var url = configService.Refresh_URL;
      var param = {
        client_id: configService.header_clientid,
        client_secret: configService.header_clientsecret,
        scope: 'scope1',
        grant_type: 'refresh_token',
        refresh_token: token
      };
      var promise = $http({
        method: method,
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (obj) {
          var str = [];

          for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
              str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
          }

          return str.join('&');
        },
        data: param
      }).
        then(function (response) {
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }

    function updateUserDetails(user) {
      var method = 'POST';
      var url = configService.API_URL + '/resetPassword';
      var params = user || {};

      var promise = $http({ method: method, url: url, data: params }).
        then(function (response) {
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }

    function updateDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/users';
      var params = userData || {};

      var promise = $http({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData')
            .token.access_token
        }
      }).
        then(function (response) {
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }
  }
})();
