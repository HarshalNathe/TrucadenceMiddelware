(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('MemberApplicationServices', MemberApplicationServices);

  MemberApplicationServices.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function MemberApplicationServices(
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
      getMemberApplicationDetails: getMemberApplicationDetails,
      saveMemberApplicationDetails: saveMemberApplicationDetails,
      updateMemberApplicationDetails: updateMemberApplicationDetails
    };
    return service;

    function getMemberApplicationDetails(listParam) {
      var method = 'GET';
      var url = configService.API_URL + '/member';
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

    function saveMemberApplicationDetails(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/member';
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

    function updateMemberApplicationDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/member';
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
