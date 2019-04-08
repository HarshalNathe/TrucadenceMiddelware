(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('EmployeeProfileService', EmployeeProfileService);

  EmployeeProfileService.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function EmployeeProfileService(
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
      getEmployerProfile: getEmployerProfile,
      updateEmployersProfileDetails: updateEmployersProfileDetails
    };
    return service;

    function getEmployerProfile(employerId) {
      var method = 'GET';
      var url = configService.API_URL + '/employerProfile?employerId=' + employerId;
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

    function updateEmployersProfileDetails(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/employerProfile';
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
  }
})();
