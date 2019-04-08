(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('DashboardService', DashboardService);

  DashboardService.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function DashboardService(
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
      getProfileStat: getProfileStat,
      getCandidateStat: getCandidateStat,
      getUserRegStat: getUserRegStat,
      getCandidateRegStat: getCandidateRegStat
    };
    return service;

    function init() {
      console.log('jobProfile Service called');
    }

    function getProfileStat(userData) {
      var method = 'GET';
      var url = configService.API_URL + '/profileStatistics';
      var params = userData || {};
      console.log('getProfileStat service request', JSON.stringify(userData));

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData')
            .token.access_token
        }
      }).
      then(function (response) {
          console.log('getProfileStat service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getCandidateStat(userData) {
      var method = 'GET';
      var url = configService.API_URL + '/candidateStatistics';
      var params = userData || {};
      console.log('getCondidateStat service request', JSON.stringify(userData));

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData')
            .token.access_token
        }
      }).
      then(function (response) {
          console.log('getCondidateStat service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getUserRegStat(userData) {
      var method = 'GET';
      var url = configService.API_URL + '/userRegisterStats';
      var params = userData || {};
      console.log('getUserRegStat service request', JSON.stringify(userData));

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData')
            .token.access_token
        }
      }).
      then(function (response) {
          console.log('getUserRegStat service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getCandidateRegStat(userData) {
      var method = 'GET';
      var url = configService.API_URL + '/candidateRegisterStats';
      var params = userData || {};
      console.log('getCandidateRegStat service request', JSON.stringify(userData));

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        data: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData')
            .token.access_token
        }
      }).
      then(function (response) {
          console.log('getCandidateRegStat service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }
  }
})();
