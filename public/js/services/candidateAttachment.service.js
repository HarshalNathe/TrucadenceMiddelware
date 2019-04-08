(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('candidateAttachmentServices', candidateAttachmentServices);

  candidateAttachmentServices.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function candidateAttachmentServices(
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
      saveCandidateAttachments: saveCandidateAttachments,
      getCandidateAttachments: getCandidateAttachments,
      updateCandidateAttachments: updateCandidateAttachments
    };
    return service;

    function init() {
      console.log('candidateAttachmentServices Service called');
    }

    function saveCandidateAttachments(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/candidateAttachments';
      var params = userData || {};
      console.log('saveCandidateAttachments service request', JSON.stringify(userData));

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
          console.log('saveCandidateAttachments service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getCandidateAttachments(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/candidateAttachments';
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

    function updateCandidateAttachments(listParam) {
      var method = 'PUT';
      var url = configService.API_URL + '/candidateAttachments';
      var params = listParam || {};
      console.log(params);

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
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }
  }
})();
