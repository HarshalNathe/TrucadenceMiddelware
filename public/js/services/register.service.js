(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('registerService', registerService);

  registerService.$inject = [
    '$http',
    'configService'
  ];

  function registerService(
    $http, configService) {
    $http.defaults.headers.common['clientId'] = configService.header_clientid;
    $http.defaults.headers.common['clientSecret'] = configService.header_clientsecret;
    var service = {
      register: register
    };

    return service;

    function register(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/signup';
      var params = userData || {};
      console.log('register request' + userData.username);

      var promise = $http({ method: method, url: url, data: params }).
        then(function (response) {
          console.log('register service success');
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }
  }
})();
