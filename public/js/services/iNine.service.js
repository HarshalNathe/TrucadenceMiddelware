(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('iNineService', iNineService);

  iNineService.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function iNineService(
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
      saveiNineDetails: saveiNineDetails,
      updateInineDetails: updateInineDetails,
      updateFormStatus: updateFormStatus,
      getDocumentList: getDocumentList,
      getInineDetails: getInineDetails,
      updateiNineDetails: updateiNineDetails,
      deleteAttachmentDetails: deleteAttachmentDetails
    };
    return service;

    function init() {
      console.log('new candidate Service called');
    }

    function saveiNineDetails(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/employmentEligibilityVerification';
      var params = userData || {};
      console.log('saveCandidateDetails service request', JSON.stringify(userData));

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
          console.log('saveiNineDetails service success');
          deferred.resolve(response);
        },
          function (response) {
            deferred.reject(response);
          });

      return deferred.promise;
    }

    function updateiNineDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/employmentEligibilityVerification';
      var params = userData || {};
      console.log('updateiNineDetails service request', JSON.stringify(userData));

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
          console.log('updateiNineDetails service success');
          deferred.resolve(response);
        },
          function (response) {
            deferred.reject(response);
          });

      return deferred.promise;
    }

    function getInineDetails(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/employmentEligibilityVerification';
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

    function updateInineDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/candidate';
      var params = userData || {};
      console.log('saveCandidateDetails service request', JSON.stringify(userData));

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
          console.log('updateCandidateDetails service success');
          deferred.resolve(response);
        },
          function (response) {
            deferred.reject(response);
          });

      return deferred.promise;
    }

    function updateFormStatus(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/formStatus';
      var params = userData || {};
      console.log('updateFormStatus service request', JSON.stringify(userData));

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
          console.log('updateFormStatus service success');
          deferred.resolve(response);
        },
          function (response) {
            deferred.reject(response);
          });

      return deferred.promise;
    }

    function getDocumentList(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/documentLists';
      var params = listParam || {};
      console.log(params);

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
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

    function deleteAttachmentDetails(userData) {
      var method = 'DELETE';
      var url = configService.API_URL + '/candidate/' + userData.candidateId +
        '/candidateAttachment/' + userData.candidateAttachmentId;
      var params = {};
      console.log('deleteAttachmentDetails service request', JSON.stringify(userData));

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
          console.log('deleteAttachmentDetails service success');
          deferred.resolve(response);
        },
          function (response) {
            deferred.reject(response);
          });

      return deferred.promise;
    }
  }
})();
