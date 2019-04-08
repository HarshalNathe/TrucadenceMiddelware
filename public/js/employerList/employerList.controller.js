(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('EmployerListController', EmployerListController);

  EmployerListController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'commonService',
    'toastr',
    'lodash',
    '$timeout',
    'utilService',
    'employerListService'
  ];

  function EmployerListController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    commonService,
    toastr,
    _,
    $timeout,
    utilService,
    employerListService) {
    var vm = this;
    vm.employerList = {
      count: 0,
      list: []
    };
    vm.search = '';
    init();

    function init() {
      vm.userData = utilService.getItem('userData');
      vm.globalLimit = 2000;
      vm.globalSkip = 0;
      vm.employerList = {
        count: 0,
        list: []
      };
      getEmployerList();
    }

    // Test comment
    vm.user = $rootScope.user;

    vm.goToEmployeeDetail = function (employerID) {
      $rootScope.employerID = employerID;
      $state.go('app.employerProfile', {
        employerId: employerID
      });
    };

    vm.gotoAddEmployee = function (employer) {
      $rootScope.employer = employer;
      $state.go('app.addEmployee', {
        employer: employer
      });
    };

    function getEmployerList() {
      var listParam = {
        role: Number(vm.userData.user[0].role),
        userId: vm.userData.user[0].id
      };
      vm.promise = employerListService.getEmployerList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.employerList.list = data.data;
            console.log('vm.employerList.list:', vm.employerList.list);

            if (data.length) {
              vm.temp = [];
              vm.temp = vm.employerList.list;
              vm.employerList.count = data.count || vm.employerList.count;
              vm.employerList.list = _.unionBy(vm.temp, data, 'id');
              vm.globalSkip += data.data.list.length;
              getEmployerList();
            } else {
              $timeout(function () {
                vm.table = window.jQuery('#empList').DataTable({
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
      var listParam = searchText;
      vm.promise = employerListService.globalSearch(listParam)
        .then(function (data) {
          if (data.status === 200) {
            if (data.data.length > 0) {
              vm.table.destroy();
              vm.employerList.list = data.data;
              $timeout(function () {
                var tab = window.jQuery('#empList');
                vm.table = tab.DataTable({
                  searching: false
                });
              }, 200);
            } else {
              vm.table.clear().draw();
              vm.table.rows.add(data.data); // Add new data
              vm.table.columns.adjust().draw(); // Redraw the DataTable
            }
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    };
  }
})();

//TODO:
//     vm.userFirstName = vm.userData.user[0].firstName;
//     vm.userLastName = vm.userData.user[0].lastName;
//     vm.userEmail = vm.userData.user[0].email;
//     vm.userAddress = vm.userData.user[0].address;
//     vm.userMobileNo = vm.userData.user[0].mobileNo;

//TODO:
//       vm.updateUserDetails = function () {
//       if (vm.newPassword !== vm.confirmPassword) {
//         commonService.showSnackbar('error', 'Password does not match', '0');
//       } else {
//         var listParams = {
//           active: true,
//           email: vm.userData.user[0].email,
//           firstName: vm.userData.user[0].firstName,
//           id: vm.userData.user[0].id,
//           lastName: vm.userData.user[0].lastName,
//           password: vm.confirmPassword,
//           role: vm.userData.user[0].role.toString(),
//           username: vm.userData.user[0].username,
//         };

//TODO:
//           vm.promise = loginService.updateUserDetails(listParams)
//           .then(function (data) {
//             if (data.status === 200) {
//               commonService.showSnackbar('info', 'Password Changed sucessfully', data.status);
//               vm.newPassword = '';
//               vm.confirmPassword = '';
//             } else {
//               commonService.showSnackbar('error', 'Error While Changing Password', data.status);
//             }
//           }, function (response) {
//             commonService.showSnackbar('error', response.statusText, response.status);
//           });
//       }
//     };

//TODO:
//       vm.updateDetails = function () {
//       var listParams = {
//         active: true,
//         email: vm.userEmail,
//         firstName: vm.userFirstName,
//         address: vm.userAddress,
//         id: vm.userData.user[0].id,
//         lastName: vm.userLastName,
//         role: vm.userData.user[0].role.toString(),
//         username: vm.userData.user[0].username,
//         mobileNo: vm.userMobileNo
//   };

//TODO:
//         vm.promise = loginService.updateDetails(listParams)
//         .then(function (data) {
//           if (data.status === 200) {
//             commonService.showSnackbar('info', 'User details updated sucessfully', data.status);
//           } else {
//             commonService.showSnackbar('error', 'Error While updating User details', data.status);
//           }
//         }, function (response) {
//           commonService.showSnackbar('error', response.statusText, response.status);
//         });
//     };

// TODO: vm.goToEmployeeDetail = function () {
//       $state.go('app.empAddShift', {

//         // TODO:
//         //  employerId: $state.params.employee.id
//       });
//     };
// })();
