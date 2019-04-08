(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('loginController', loginController);

  loginController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$stateParams',
    'loginService',
    'configService',
    'utilService',
    'commonService',
    'toastr',
    'Auth',
    'newCandidateServices'
  ];

  function loginController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $stateParams,
    loginService,
    configService,
    utilService,
    commonService,
    toastr,
    Auth,
    newCandidateServices) {
    /* jshint validthis: true */
    var vm = this;
    vm.login = login;
    /* Vm.rememberMe = rememberMe;
       vm.forgotPassword = forgotPassword; */
    vm.token = $stateParams.token ? $stateParams.token : false;
    activate();
    vm.user = {
      username: '',
      password: '',
      clientId: configService.header_clientid,
      clientSecret: configService.header_clientsecret
    };

    function activate() {
      if (vm.token && $stateParams.token !== 'failed') {
        vm.promise = loginService.verifyUser(vm.token)
          .then(verifyUserSuccess, verifyUserError);
      } else if ($stateParams.token === 'failed') {
        commonService.showSnackbar('error', 'Login Failed', '0');
      }

      function verifyUserSuccess(data) {
        if (data.data) {
          if (data.data.success) {
            commonService.showSnackbar('info', data.data.message, '0');
          } else {
            $state.go('forgotPassword');
            commonService.showSnackbar('error', data.data.message, '0');
          }
        }
      }

      function verifyUserError(error) {
        commonService.showSnackbar('error', 'User verification failed !', '0');
      }
    }

    function login() {
      vm.promise = loginService.login(vm.user)
        .then(function (data) {
          if (data.status === 200) {
            commonService.showSnackbar('info', 'Login successfully', data.status);
            utilService.setItem('userData', JSON.stringify(data.data));
            navigateToDashboard();
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    /* A function rememberMe() {
       console.log('rememberMe Under Construction');
     }

     function forgotPassword() {
       console.log('Under Construction');
     } */

    function navigateToDashboard() {
      var userData = utilService.getItem('userData');
      var accessToken = userData.token ? JSON.stringify(userData.token) : '';
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('loginTime', new Date().getTime());
      sessionStorage.setItem('expires_in', userData.token.expires_in);

      if (userData.user[0].role === '1' || userData.user[0].role === 1) {
        $state.go('app.home');
      } else if (userData.user[0].role === '0' || userData.user[0].role === 0) {
        getCandidateList(userData);
      }

      $location.replace();
      Auth.setUser('true');
      refreshTokenTimer((userData.token.expires_in - 50) * 1000);
    }

    function refreshTokenTimer(timeoutSeconds) {
      if (sessionStorage.token) {
        const that = this;

        setTimeout(function () {
          loginService.resetToken(JSON.parse(sessionStorage.token).refresh_token)
            .then(function (newtoken) {
              if (newtoken.data.token_type) {
                var oldToken = JSON.parse(localStorage.getItem('userData'));
                oldToken.token = newtoken.data;
                localStorage.setItem('userData', JSON.stringify(oldToken));
                sessionStorage.setItem('token', JSON.stringify(newtoken.data));
                sessionStorage.setItem('loginTime', new Date().getTime().toString());
                sessionStorage.setItem('expires_in', newtoken.data.expires_in);
                var expires_in = Number(sessionStorage.getItem('expires_in'));
                refreshTokenTimer((expires_in - 50) * 1000);
              }
            }, function (response) {
            });
        }, timeoutSeconds);
      }
    }

    function getCandidateList(userData) {
      var listParam = {
        limit: 200,
        skip: 0,
        role: Number(userData.user[0].role),
        userId: userData.user[0].id
      };
      vm.promise = newCandidateServices.getCandidateList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            if (data.data.list.length === 0) {
              $state.go('app.newCandidate');
            } else {
              vm.candidateList = data.data.list;
              vm.candidateId = vm.candidateList[0].id;
              $state.go('app.candidateDetail', {
                candidateID: vm.candidateId
              });
            }
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }
  }
})();
