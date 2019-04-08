(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('newCandidateServices', newCandidateServices);

  newCandidateServices.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function newCandidateServices(
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
      init: init,
      getCountry: getCountry,
      getCountryById: getCountryById,
      getState: getState,
      getCity: getCity,
      getStateByCountryId: getStateByCountryId,
      saveCandidateDetails: saveCandidateDetails,
      getCandidateList: getCandidateList,
      getCandidatDetails: getCandidatDetails,
      removeEmploymentDetails: removeEmploymentDetails,
      updateFormStatus: updateFormStatus,
      getFormMaster: getFormMaster,
      getAttachmentType: getAttachmentType,
      getsecurefieldpassword: getsecurefieldpassword,
      updateCandidateDetails: updateCandidateDetails,
      globalSearch: globalSearch
    };
    return service;

    function init() {
    }

    function getCountry() {
      var method = 'GET';
      var url = configService.API_URL + '/country';
      var params = {
        id: null,
        state: false
      };
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

    function getCountryById(countryId) {
      var method = 'GET';
      var url = configService.API_URL + '/country';
      var params = {
        id: countryId,
        state: true
      };
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

    function getState() {
      var method = 'GET';
      var url = configService.API_URL + '/state';
      var params = {};

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

    function getStateByCountryId(CountryId) {
      var method = 'GET';
      var url = configService.API_URL + '/country';
      var params = CountryId;

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

    function getCity(stateId) {
      var method = 'GET';
      var url = configService.API_URL + '/state';
      var params = stateId || {};

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

    function saveCandidateDetails(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/candidate';
      var params = userData || {};

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

    function updateCandidateDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/candidate';
      var params = userData || {};

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

    function updateFormStatus(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/formStatus';
      var params = userData || {};

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

    function getCandidateList(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/candidate';
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

    function getFormMaster(formName) {
      var method = 'GET';
      var url = configService.API_URL + '/formMasters';
      var params = {
        formMaster_Name: formName
      };

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

    function getAttachmentType(attachmentType_Name) {
      var method = 'GET';
      var url = configService.API_URL + '/attachmentTypes';
      var params = {
        attachmentType_Name: attachmentType_Name
      };

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

    function getCandidatDetails(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/candidateDetailsById/' + listParam.candidateId;
      var params = {
        AttachmentTypeID: listParam.AttachmentTypeID,
        FormMasterID: listParam.FormMasterID
      };

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

    function getsecurefieldpassword(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/users';
      var params = listParam;

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

    function removeEmploymentDetails(listParam) {
      var method = 'DELETE';
      var url = configService.API_URL + '/employmentDetails';
      var params = {
        candidateId: listParam.candidateId,
        employmentId: listParam.employmentId
      };

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

    function globalSearch(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/globalSearch';
      var params = {
        keyValue: listParam
      };
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
