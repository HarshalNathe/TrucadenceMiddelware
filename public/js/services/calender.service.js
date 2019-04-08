(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('calenderService', calenderService);

  calenderService.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function calenderService($http, configService, utilService, $q) {
    $http.defaults.headers.common['clientId'] = configService.header_clientid;
    $http.defaults.headers.common['clientSecret'] = configService.header_clientsecret;

    var service = {
      saveTimeSheetDetails: saveTimeSheetDetails,
      getTimeSheetDetails: getTimeSheetDetails,
      updateTimeSheetDetails: updateTimeSheetDetails,
      deleteTimeSheetDetails: deleteTimeSheetDetails
    };

    return service;

    function saveTimeSheetDetails(timesheetData) {
      var method = 'POST';
      var url = configService.API_URL + '/timesheet';
      var params = timesheetData || {};
      var promise = $http({ method: method, url: url, data: params }).
        then(function (response) {
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }

    function getTimeSheetDetails(params) {
      var method = 'GET';
      var url = configService.API_URL + '/timesheet';

      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        params: params,
        headers: {
          Authorization: 'Bearer ' + utilService.getItem('userData').token.access_token
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

    function updateTimeSheetDetails(listParam) {
      var method = 'PUT';
      var url = configService.API_URL + '/timesheet';
      var params = listParam || {};
      var promise = $http({ method: method, url: url, data: params }).
        then(function (response) {
          return response;
        },
          function (response) {
            return response;
          });

      return promise;
    }

    function deleteTimeSheetDetails(listParam) {
      var method = 'DELETE';
      var url = configService.API_URL + '/timesheet';
      var deferred = $q.defer();
      $http({
        method: method,
        url: url,
        params: listParam,
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
