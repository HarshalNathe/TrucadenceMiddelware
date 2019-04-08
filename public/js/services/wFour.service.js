(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('wFourServices', wFourServices);

  wFourServices.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function wFourServices(
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
      saveWFourDetails: saveWFourDetails,
      getWFourDetails: getWFourDetails,
      updateWFourDetails: updateWFourDetails
    };
    return service;

    function init() {
      console.log('Illinois Service called');
    }

    function saveWFourDetails(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/personalAllowancesWorksheet';
      var params = userData || {};
      console.log('saveWFourDetails service request', JSON.stringify(userData));

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
          console.log('saveWFourDetails service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function updateWFourDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/personalAllowancesWorksheet';
      var params = userData || {};
      console.log('saveWFourDetails service request', JSON.stringify(userData));

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
          console.log('saveWFourDetails service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getWFourDetails(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/personalAllowancesWorksheet';
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
