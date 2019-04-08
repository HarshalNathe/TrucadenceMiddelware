(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('AppContainerController', AppContainerController);

  AppContainerController.$inject = [
    'utilService',
    '$http',
    '$state',
    '$location',
    '$window',
    'Auth',
    'newCandidateServices',
    'commonService',
    '$scope'
  ];

  function AppContainerController(utilService,
    $http,
    $state,
    $location,
    $window,
    Auth,
    newCandidateServices,
    commonService,
    $scope) {
    var vm = this;
    init();

    function init() {
      vm.userName = utilService.getItem('userData');
      vm.showJObProfile = false;
      vm.showCandidateList = false;
      vm.showDashboard = false;

      if (vm.userName.user[0].role === '1' || vm.userName.user[0].role === 1) {
        vm.showJObProfile = true;
        vm.showCandidateList = true;
        vm.showDashboard = true;
      } else if (vm.userName.user[0].role === '0' || vm.userName.user[0].role === 0) {
        vm.showJObProfile = false;
        vm.showDashboard = false;
        vm.showCandidateList = false;
        vm.candidateList = {
          count: 0,
          list: []
        };
      }
    }

    $scope.$on('IdleTimeout', function () {
      vm.logOut();
    });

    function getCandidateList() {
      var listParam = {
        limit: 2,
        skip: 0,
        role: Number(vm.userName.user[0].role),
        userId: vm.userName.user[0].id
      };
      vm.promise = newCandidateServices.getCandidateList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            if (data.data.list.length === 0) {
              $state.go('app.newCandidate');
            } else {
              vm.candidateList.list = data.data.list;
              vm.candidateId = vm.candidateList.list[0].id;
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

    vm.logOut = function () {
      utilService.setItem('userData', '');
      localStorage.clear();
      sessionStorage.clear();
      Auth.setUser(undefined);

      // $window.history.go(-($window.history.lenght));
      // $window.location.reload();
      $state.go('login');
    };

    vm.goToCandidateDetail = function () {
      getCandidateList();
    };
  }
})();
