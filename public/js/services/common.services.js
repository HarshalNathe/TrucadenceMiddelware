(function () {
  'use strict';

  angular
    .module('trucadence')
    .factory('commonService', commonService);

  commonService.$inject = [
    '$q',
    '$window',
    '$http',
    '$httpParamSerializer'
  ];

  function commonService(
    $q,
    $window,
    $http,
    $httpParamSerializer) {
    var snackbar = $window.Snackbar,
      service = {
        showSnackbar: showSnackbar
      };

    function showSnackbar(type, message, status, duration) {
      var colorCode = {
        success: {
          backgroundColor: '#EAF5E2',
          borderColor: '#66BB6A'
        },
        error: {
          backgroundColor: '#ffe5e5',
          borderColor: '#ff4c4c'
        },
        info: {
          backgroundColor: '#e0e9fb',
          borderColor: '#83aaf0'
        },
        warning: {
          backgroundColor: '#ffece5',
          borderColor: '#ffa27f'
        }
      };

      duration = duration ? '8000' : '3000';

      if (status === -1) {
        message = 'Check your internet connection!!!';
      } else if (status === 2) {
        message = 'Applicant is required to present Trucadence with a legal government document' +
          'indicating tax exempt status. If the document is not with them at time of application,' +
          'the selection will removed until the document is submitted to Trucadence';
      }

      snackbar.show({
        text: '<div class="col-sm-2 text-center"><img class="" src="assets/img/icon/' + type +
          '.png" alt="' + type + '"></div>' +
          '<div class="col-sm-10 text-left" style="margin-top:5px">' + message + '</div>',
        pos: 'top-center',
        showAction: false,
        backgroundColor: colorCode[type].backgroundColor,
        borderColor: colorCode[type].borderColor,
        textColor: '#000',
        duration: duration
      });
    }

    return service;
  }
})();
