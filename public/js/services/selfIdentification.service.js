(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('selfIdentificationServices', selfIdentificationServices);

  selfIdentificationServices.$inject = [
    '$http',
    'configService',
    'utilService'
  ];

  function selfIdentificationServices(
    $http,
    configService,
    utilService) {
    var userData = '';
    var accessToken = '';
    userData = utilService.getItem('userData');
    accessToken = userData.token ? userData.token.access_token : '';
    $http.defaults.headers.common['clientId'] = configService.header_clientid;
    $http.defaults.headers.common['clientSecret'] = configService.header_clientsecret;
    $http.defaults.headers.common['authorization'] = 'Bearer ' + accessToken;

    var service = {
      init: init,
      saveSelfidentificationDetails: saveSelfidentificationDetails,
      getSelfIdentificationDetails: getSelfIdentificationDetails,
      updateSelfidentificationDetails: updateSelfidentificationDetails
    };
    return service;

    function init() {
      console.log('self identification Service called');
    }

    function saveSelfidentificationDetails(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/selfIdentification';
      var params = userData || {};
      console.log('saveSelfidentificationDetails service request', JSON.stringify(userData));

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
          console.log('saveSelfidentificationDetails service success');
          return response;
        },
        function (response) {
          return response;
        });

      return promise;
    }

    function getSelfIdentificationDetails(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/selfIdentification';
      var params = listParam || {};
      console.log(params);

      var promise = $http({
        method: method,
        url: url,
        params: params,
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

    function updateSelfidentificationDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/selfIdentification';
      var params = userData || {};
      console.log('saveSelfidentificationDetails service request', JSON.stringify(userData));

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
          console.log('saveSelfidentificationDetails service success');
          return response;
        },
        function (response) {
          return response;
        });

      return promise;
    }
  }
})();
