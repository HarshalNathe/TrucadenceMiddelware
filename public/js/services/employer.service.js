(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('employerListService', employerListService);

  employerListService.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function employerListService(
    $http,
    configService,
    utilService,
    $q) {
    var userData = '';
    var accessToken = '';
    userData = utilService.getItem('userData');
    accessToken = userData && userData.token ? userData.token.access_token : '';
    $http.defaults.headers.common['clientId'] = configService.header_clientid;
    $http.defaults.headers.common['clientSecret'] = configService.header_clientsecret;
    $http.defaults.headers.common['authorization'] = 'Bearer ' + accessToken;

    var service = {
      getEmployerList: getEmployerList,
      getEmployeeList: getEmployeeList,
      getEmployerProfileDetails: getEmployerProfileDetails,
      deleteEmployerEmployee: deleteEmployerEmployee

    };
    return service;

    function getEmployerList(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/employer';
      var params = listParam || {};

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
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getEmployeeList(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/employersEmployee';
      var params = listParam || {};

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
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getEmployerProfileDetails(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/employerProfile';
      var params = listParam || {};

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
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function deleteEmployerEmployee(listParam) {
      var method = 'DELETE';
      var url = configService.API_URL + '/employersEmployee';
      var params = listParam || {};

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
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }
  }
})();
