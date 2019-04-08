(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('addEmployeeService', addEmployeeService);

  addEmployeeService.$inject = [
    '$http',
    'configService',
    'utilService',
    '$q'
  ];

  function addEmployeeService(
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

    //TODO:   var userDataObject = {
    //     "Employer_Id" : "5c249908b98a650f4f6372ef",
    //     "Employer_Shift_Id" : "5c249cabb98a650f4f6372f1",
    //     "Shift_Job_Profile_Id" : "5c5d75a0e74af42d7c6b1220",
    //     "Start_Date" : "2002-04-28T15:52:41.884Z",
    //     "End_Date" :"2001-04-18T12:41:59.065Z",
    //     "Job_Type" : "part time",
    //     "Regular_Pay" : 1020,
    //     "Over_Time_Pay" : 210,
    //     "Terminated" : true,
    //     "Created_At" : "2010-01-05T04:36:05.176Z",
    //     "LastModified_Date" :"2017-10-02T00:27:33.138Z"
    // }
    var service = {
      saveNewEmpDetails: saveNewEmpDetails,
      employerName: employerName,

      //TODO: getEmployerListProfile: getEmployerListProfile,
      getEmployersList: getEmployersList,
      updateEmployeeDetails: updateEmployeeDetails,
      getEmployeesList: getEmployeesList
    };
    return service;

    function saveNewEmpDetails(userData) {
      var method = 'POST';
      var url = configService.API_URL + '/employersEmployee';
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

    function employerName() {
      var method = 'GET';
      var url = configService.API_URL + '/employersEmployee?employerId=5c249908b98a650f4f6372ef';
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

    //TODO: function getEmployerListProfile(listParam) {
    //   var method = 'GET';
    //   var url = configService.API_URL + '/employerProfile?employerId=' + listParam.employerId;
    //   var params = {};
    //   var deferred = $q.defer();
    //   $http({
    //     method: method,
    //     url: url,
    //     params: params,
    //     headers: {
    //       Authorization: 'Bearer ' + utilService.getItem('userData')
    //         .token.access_token
    //     }
    //   }).
    //     then(function (response) {
    //       deferred.resolve(response);
    //     },
    //       function (response) {
    //         deferred.reject(response);
    //       });

    //TODO:   return deferred.promise;
    // }

    function getEmployersList() {
      var method = 'GET';
      var url = configService.API_URL + '/employer';
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

    function getEmployeesList(listParam) {
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

    function updateEmployeeDetails(userData) {
      var method = 'PUT';
      var url = configService.API_URL + '/employersEmployee';
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
