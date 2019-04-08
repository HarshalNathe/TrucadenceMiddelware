(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('jobProfileService', jobProfileService);

  jobProfileService.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function jobProfileService(
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
      saveJobProfile: saveJobProfile,
      updateJobDetails: updateJobDetails,
      getJobList: getJobList
    };
    return service;

    function init() {
      console.log('jobProfile Service called');
    }

    function saveJobProfile(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/jobProfiles';
      var params = userData || {};
      console.log('saveJobProfile service request', JSON.stringify(userData));

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
          console.log('saveJobProfile service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function updateJobDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/jobProfiles';
      var params = userData || {};
      console.log('updateJobDetails service request', JSON.stringify(userData));

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
          console.log('updateJobDetails service success');
          deferred.resolve(response);
        },
        function (response) {
          deferred.reject(response);
        });

      return deferred.promise;
    }

    function getJobList(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/jobProfiles';
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
