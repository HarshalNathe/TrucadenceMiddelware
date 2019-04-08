(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('CandidateListController', CandidateListController);

  CandidateListController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'newCandidateServices',
    'commonService',
    'toastr',
    'lodash',
    '$timeout',
    'utilService'
  ];

  function CandidateListController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    newCandidateServices,
    commonService,
    toastr,
    _,
    $timeout,
    utilService) {
    var vm = this;
    vm.candidateList = {
      count: 0,
      list: []
    };
    vm.search = '';
    init();

    function init() {
      vm.userData = utilService.getItem('userData');
      vm.globalLimit = 2000;
      vm.globalSkip = 0;
      vm.candidateList = {
        count: 0,
        list: []
      };
      getCandidateList();
    }

    // Test comment
    vm.user = $rootScope.user;

    vm.goToCandidateDetail = function (candidateId) {
      $rootScope.candidate_ID = candidateId;
      $state.go('app.candidateDetail', {
        candidateID: candidateId
      });
    };

    function getCandidateList() {
      var listParam = {
        limit: vm.globalLimit,
        skip: vm.globalSkip,
        role: Number(vm.userData.user[0].role),
        userId: vm.userData.user[0].id
      };
      vm.promise = newCandidateServices.getCandidateList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            if (data.data.list.length) {
              vm.temp = [];
              vm.temp = vm.candidateList.list;
              vm.candidateList.count = data.data.count || vm.candidateList.count;
              vm.candidateList.list = _.unionBy(vm.temp, data.data.list, 'id');
              vm.globalSkip += data.data.list.length;
              getCandidateList();
            } else {
              $timeout(function () {
                vm.table = window.jQuery('#example').DataTable({
                  searching: false
                });
              }, 200);
            }
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    vm.globalSearch = function (searchText) {
      // TODO:var len = searchText.length;
      var listParam = searchText;

      if (listParam) {
        vm.promise = newCandidateServices.globalSearch(listParam)
          .then(function (data) {
            if (data.status === 200) {
              if (data.data.length > 0) {
                if (vm.table) {
                  vm.table.destroy();
                  vm.table = '';
                }

                vm.candidateList.list = data.data;
                /* $timeout(function () {
                  var tab = window.jQuery('#example');
                  vm.table = tab.DataTable({
                    searching: false
                  });
                }, 200); */
              } else {
                if (vm.table) {
                  vm.table.clear().draw();
                  vm.table.rows.add(data.data); // Add new data
                  vm.table.columns.adjust().draw(); // Redraw the DataTable
                }
              }
            } else {
              commonService.showSnackbar('error', data.statusText, data.status);
            }
          }, function (response) {
            commonService.showSnackbar('error', response.statusText, response.status);
          });
      } else {
        $state.go($state.current, {}, {
          reload: true
        });
      }
    };
  }
})();
