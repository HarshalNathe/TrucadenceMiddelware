(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('candidateDetailServices', candidateDetailServices);

  candidateDetailServices.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function candidateDetailServices(
    $http,
    configService,
    utilService,
    $q) {
    var userData = '';
    var accessToken = '';
    userData = utilService.getItem('userData');
    accessToken = userData.token ? userData.token.access_token : '';
    $http.defaults.headers.common['clientId'] = configService.header_clientid;
    $http.defaults.headers.common['clientSecret'] = configService.header_clientsecret;
    $http.defaults.headers.common['authorization'] = 'Bearer ' + accessToken;

    var service = {
      init: init,
      getCountryById: getCountryById,
      getStateById: getStateById,
      getCityById: getCityById
    };
    return service;

    function init() {
      console.log('candidateDetail Service called');
    }

    function getCountryById(countryData) {
      var method = 'GET';
      var url = configService.API_URL + '/country';
      var params = countryData || {};
      console.log(params);

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        params: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData')
            .token.access_token
        }
      }).
      then(function (response) {
          console.log(response);
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getStateById(stateData) {
      var method = 'GET';
      var url = configService.API_URL + '/state';
      var params = stateData || {};
      console.log(params);

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        params: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData')
            .token.access_token
        }
      }).
      then(function (response) {
          console.log(response);
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getCityById(cityData) {
      var method = 'GET';
      var url = configService.API_URL + '/city';
      var params = cityData || {};
      console.log(params);

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        params: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData')
            .token.access_token
        }
      }).
      then(function (response) {
          console.log(response);
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }
  }
})();
