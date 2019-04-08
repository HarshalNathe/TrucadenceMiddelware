(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('AddEmployeeController', AddEmployeeController);
  AddEmployeeController.$inject = [

    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    'loginService',
    'commonService',
    'toastr',
    'addEmployeeService',
    'employerListService',
    'utilService',
    '$q',
    '$timeout',
    'lodash'
  ];

  function AddEmployeeController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    loginService,
    commonService,
    toastr,
    addEmployeeService,
    employerListService,
    utilService,
    $q,
    $timeout,
    _) {
    var vm = this;
    var index;

    vm.newEmpDetailObject = {
      Employer_Id: '',
      Employer_Shift_Id: '',
      Shift_Job_Profile_Id: '',
      Candidate_Id: '',
      Start_Date: '',
      End_Date: '',
      Job_Type: '',
      Regular_Pay: '',
      Over_Time_Pay: '',
      Terminated: false,
      Created_At: new Date(),
      LastModified_Date: new Date()
    };

    //TODO: vm.newEmpDetails = [];

    vm.newEmpDetailsArray = [];
    vm.empTempArray = [];

    vm.employeeList = '';
    vm.profileList = '';

    vm.Shift_Job_Profile = [];
    vm.sendData = {};
    vm.showTable = false;
    vm.edit = true;
    vm.saveNewEmpDetails = vm.saveNewEmpDetails;
    vm.addEmployeeEdit = vm.addEmployeeEdit;

    // V vm.addEmployeeDelete = vm.addEmployeeDelete;
    vm.editNewEmpDetails = vm.editNewEmpDetails;
    vm.dltConfirm = vm.dltConfirm;
    vm.employerName = vm.employerName;
    vm.clientDetails = $rootScope.employer;
    init();

    function init() {
      vm.userData = utilService.getItem('userData');
      employersList();
      employee_Shift_list();
      employee_JobType_List();

      window.jQuery('#StartDateDatePicker').datetimepicker({
        format: 'MM/DD/YYYY',
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });

      window.jQuery('#EndDateDatePicker').datetimepicker({
        format: 'MM/DD/YYYY',
        useCurrent: false, // Important! See issue #1075
        minDate: new Date('1900-01-1'),
        maxDate: moment()
      });

      window.jQuery('#StartDateDatePicker').on('dp.change', function (e) {
        window.jQuery('#EndDateDatePicker').data('DateTimePicker').minDate(e.date);
        vm.newEmpDetailObject.Start_Date = moment(e.date._d).format('MM/DD/YYYY');
      });
      window.jQuery('#EndDateDatePicker').on('dp.change', function (e) {
        window.jQuery('#StartDateDatePicker').data('DateTimePicker').maxDate(e.date);
        vm.newEmpDetailObject.End_Date = moment(e.date._d).format('MM/DD/YYYY');
      });
    }

    function employersList() {
      vm.promise = addEmployeeService.getEmployersList()
        .then(function (data) {
            if (data.status === 200) {
              vm.employerList = data.data;

              if (vm.clientDetails.id) {
                vm.newEmpDetailObject.Employer_Id = _.find(vm.employerList, function (obj) {
                  return obj.id === vm.clientDetails.id;
                });

                delete vm.newEmpDetailObject.Employer_Id.$$hashKey;

                setTimeout(function () {
                  window.jQuery('#employerName').select2();
                  vm.employerName(vm.newEmpDetailObject.Employer_Id);
                }, 500);
              }
            }
          },
          function (response) {
            commonService.showSnackbar('error', response.statusText, response.status);
          });
    }

    //TODO: function shift_Job_ProfileList() {
    //   vm.Shift_Job_Profile = [{
    //     Profile_Name: 'Fitter'
    //   }, {
    //     Profile_Name: 'Crew member'
    //   }, {
    //     Profile_Name: 'Welder'
    //   }];
    // }

    function employee_Shift_list() {
      vm.Employee_ShiftList = [{
        shift_Name: 'Morning'
      }, {
        shift_Name: 'General'
      }, {
        shift_Name: 'night'
      }];
    }

    function employee_JobType_List() {
      vm.Employee_JobTypeList = [{
        JobType_Name: 'Full Time'
      }, {
        JobType_Name: 'Part Time'
      }];
    }

    vm.saveNewEmpDetails = function () {
      vm.employeeObj = {
        Employer_Id: vm.newEmpDetailObject.Employer_Id.id,
        Employer_Shift_Id: vm.newEmpDetailObject.Employer_Shift_Id,
        Shift_Job_Profile_Id: vm.profileList.id,
        Candidate_Id: vm.employeeList.id,
        Start_Date: vm.newEmpDetailObject.Start_Date,
        End_Date: vm.newEmpDetailObject.End_Date,
        Job_Type: vm.newEmpDetailObject.Job_Type,
        Regular_Pay: vm.newEmpDetailObject.Regular_Pay,
        Over_Time_Pay: vm.newEmpDetailObject.Over_Time_Pay,
        Terminated: vm.newEmpDetailObject.Terminated
      };

      var deferred = $q.defer();

      vm.promise = addEmployeeService.saveNewEmpDetails(vm.employeeObj)
        .then(function (data) {
          if (data.status === 200) {
            getEmployerEmployees(vm.employerId);
            commonService.showSnackbar('info', 'Employee Details Saved Sucessfully', data.status);
            deferred.resolve(data);
          } else {
            commonService.showSnackbar('error', 'Error While Adding Employee Details', data.status);
            deferred.reject(data);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While Adding Employee Details', response.status);
          deferred.reject(response);
        });

      vm.cancelEmpDetails();
    };

    vm.employerName = function (employer) {
      var deferred = $q.defer();
      vm.employerId = employer.id;
      var listParam = {
        employerId: vm.employerId
      };

      // V window.jQuery.fn.dataTable.ext.errMode = 'none';
      vm.promise = employerListService.getEmployerProfileDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.profileListData = data.data.employersProfiles[0].employerShifts[0].shiftJobProfiles;
            deferred.resolve(data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });

      getEmployerEmployees(employer.id);
    };

    //TODO: vm.selectProfile = function (option) {
    //   console.log('option 123', option);
    //   //  vm.profileList = data.data;
    //   var deferred = $q.defer();
    //   vm.promise = addEmployeeService.selectProfile()
    //     .then(function (data) {
    //       if (data.status === 200) {
    //         console.log('1111 checkEmployeeService');
    //         console.log('data', data);
    //         console.log('data', data.data);

    //       //  vm.employeeList = data.data;
    //         // vm.profileList = data.data;

    //TODO:         deferred.resolve(data);
    //       } else {
    //         deferred.reject(data);
    //       }
    //     }, function (response) {
    //       deferred.reject(response);
    //     });

    // };

    vm.cancelEmpDetails = function () {
      window.jQuery('#employeeName').select2('val', '');
      window.jQuery('#empJobProfile').select2('val', '');
      window.jQuery('#empJobType').select2('val', '');
      vm.newEmpDetailObject.Shift_Job_Profile_Id = '';
      vm.newEmpDetailObject.Start_Date = '';
      vm.newEmpDetailObject.End_Date = '';
      vm.newEmpDetailObject.Employer_Shift_Id = '';
      vm.newEmpDetailObject.Job_Type = '';
      vm.newEmpDetailObject.Regular_Pay = undefined;
      vm.newEmpDetailObject.Over_Time_Pay = undefined;
      vm.newEmpDetailObject.Employer_Id = '';
      vm.employeeList = '';
      vm.profileList = '';
      vm.edit = true;
      vm.employerReadonly = false;
      $scope.addEmployeeForm.$setPristine();
    };

    vm.editNewEmpDetails = function () {
      vm.employeeObj = {
        id: vm.editEmployeeId,
        Employer_Id: vm.newEmpDetailObject.Employer_Id.id,
        Employer_Shift_Id: vm.newEmpDetailObject.Employer_Shift_Id,
        Shift_Job_Profile_Id: vm.profileList.id,
        Candidate_Id: vm.employeeList.id,
        Start_Date: vm.newEmpDetailObject.Start_Date,
        End_Date: vm.newEmpDetailObject.End_Date,
        Job_Type: vm.newEmpDetailObject.Job_Type,
        Regular_Pay: vm.newEmpDetailObject.Regular_Pay,
        Over_Time_Pay: vm.newEmpDetailObject.Over_Time_Pay,
        Terminated: vm.newEmpDetailObject.Terminated
      };
      var deferred = $q.defer();
      vm.promise = addEmployeeService.updateEmployeeDetails(vm.employeeObj)
        .then(function (data) {
          if (data.status === 200) {
            getEmployerEmployees(vm.employerId);
            commonService.showSnackbar('info', 'Employee Details Updated Sucessfully', data.status);
            deferred.resolve(data);
          } else {
            commonService.showSnackbar('error', 'Error While Updating Employee Details', data.status);
            deferred.reject(data);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While Updating Employee Details', response.status);
          deferred.reject(response);
        });
      vm.edit = true;
      vm.employerReadonly = false;
      vm.cancelEmpDetails();
    };

    vm.addEmployeeEdit = function (index, obj) {
      // V window.jQuery('#employeeName').select2('val', 'vm.employeeList.Last_Name');
      window.scrollTo(0, 0);
      vm.edit = false;
      vm.editIndex = index;
      vm.editEmployeeId = obj.id;
      vm.employeeList = obj.candidateMasters;
      vm.profileList = obj.shiftJobProfiles;
      vm.newEmpDetailObject.Start_Date = moment(obj.Start_Date).format('MM/DD/YYYY');
      vm.newEmpDetailObject.End_Date = moment(obj.End_Date).format('MM/DD/YYYY');
      vm.newEmpDetailObject.Employer_Shift_Id = obj.Employer_Shift_Id;
      vm.newEmpDetailObject.Job_Type = obj.Job_Type;
      vm.newEmpDetailObject.Regular_Pay = obj.Regular_Pay;
      vm.newEmpDetailObject.Over_Time_Pay = obj.Over_Time_Pay;
      vm.newEmpDetailObject.Terminated = obj.Terminated;
      setTimeout(function () {
        window.jQuery('#employeeName').select2();
        window.jQuery('#empJobProfile').select2();
      }, 100);
      vm.employerReadonly = true;
    };

    vm.dltConfirm = function (status) {
      if (status === 'confirm') {
        vm.deleteEmployerEmployee(vm.deleteID);
        vm.deleteID = '';
      } else if (status === 'close') {
        vm.deleteID = '';
        vm.cancelEmpDetails();
      }
    };

    getEmployees();

    function getEmployees() {
      var listParam = {
        limit: 10,
        skip: 0,
        role: 1
      };

      vm.promise = addEmployeeService.getEmployeesList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.employeesList = data.data.list;
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    function getEmployerEmployees(id) {
      var listParam = {
        employerId: id
      };

      vm.promise = employerListService.getEmployeeList(listParam)
        .then(function (data) {
          if (data.status === 200) {
            $timeout(function () {
              vm.table = window.jQuery('#example1').DataTable({
                searching: true

              });
            }, 200);
            vm.employerEmployees = data.data;
            vm.employerEmployees.reverse();

            if (window.jQuery('#example1').length > 0) {
              if (vm.table) {
                vm.table.destroy();
              }
            }

            // V window.jQuery('#example1').dataTable().Destroy()
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    }

    vm.delete = function (deleteID) {
      vm.deleteID = deleteID;
    };

    vm.deleteEmployerEmployee = function (id) {
      var listParam = {
        id: id
      };

      vm.promise = employerListService.deleteEmployerEmployee(listParam)
        .then(function (data) {
          if (data.status === 200) {
            getEmployerEmployees(vm.employerId);
            vm.cancelEmpDetails();
            commonService.showSnackbar('info', 'Employee Details Deleted Sucessfully', data.status);
          } else {
            commonService.showSnackbar('error', data.statusText, data.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', response.statusText, response.status);
        });
    };
  }
})();
