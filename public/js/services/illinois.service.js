(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('illinoisServices', illinoisServices);

  illinoisServices.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function illinoisServices(
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
      saveIllinoisDetails: saveIllinoisDetails,
      getIllinoisDetails: getIllinoisDetails,
      updateIllinoisDetails: updateIllinoisDetails
    };
    return service;

    function init() {
      console.log('Illinois Service called');
    }

    function saveIllinoisDetails(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/illinoisAllowancesWorksheet';
      var params = userData || {};
      console.log('saveIllinoisDetails service request', JSON.stringify(userData));

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
          console.log('saveIllinoisDetails service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function updateIllinoisDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/illinoisAllowancesWorksheet';
      var params = userData || {};
      console.log('UpdateIllinoisDetails service request', JSON.stringify(userData));

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
          console.log('updateIllinoisDetails service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getIllinoisDetails(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/illinoisAllowancesWorksheet';
      var params = listParam || {};
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
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }
  }
})();
