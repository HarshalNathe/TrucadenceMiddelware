(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('changePasswordService', changePasswordService);

  changePasswordService.$inject = [
    '$http',
    'configService',
    '$httpParamSerializer'
  ];

  function changePasswordService(
    $http, configService, $httpParamSerializer) {
    $http.defaults.headers.common['clientId'] = configService.header_clientid;
    $http.defaults.headers.common['clientSecret'] = configService.header_clientsecret;

    var service = {
      changePassword: changePassword
    };

    return service;

    function changePassword(token, newPassword) {
      var method = 'POST';
      var url = configService.API_URL + '/changePassword/' + token;
      console.log('Change Password request ' + url);
      var param = { password: newPassword };
      var promise = $http({
        method: method,
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (obj) {
          var str = [];

          for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
              str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
          }

          return str.join('&');
        },
        data: param
      }).
        then(function (response) {
          console.log('Change Password service success');
          return response;
        },
        function (response) {
          return response;
        });

      return promise;
    }
  }
})();
