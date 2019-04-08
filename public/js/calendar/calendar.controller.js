(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('CalendarController', CalendarController);

  CalendarController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    'loginService',
    'commonService',
    'toastr',
    'employerListService',
    'utilService',
    'calenderService',
    '$timeout',
    '$q'
  ];

  function CalendarController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    loginService,
    commonService,
    toastr,
    employerListService,
    utilService,
    calenderService,
    $timeout,
    $q
  ) {
    var vm = this;
    vm.selectedEmployerId = '';
    vm.getEmployerDetails = getEmployerDetails;
    $scope.client = true;
    $scope.dateRangePicker = {
      startDate: '',
      endDate: ''
    };
    vm.dateRange = '';
    init();

    function init() {
      vm.userData = utilService.getItem('userData');
      window.jQuery('#DateRange_datepicker001').datetimepicker({
        format: 'MM/DD/YYYY',
      });

      // Get the value of Start and End of Week

      window.jQuery('#DateRange_datepicker001').on('dp.change', function (e) {
        var value = window.jQuery('#weeklyDatePicker').val();
        var firstDate = moment(value, 'MM-DD-YYYY').day(0).format('MM-DD-YYYY');
        var lastDate = moment(value, 'MM-DD-YYYY').day(6).format('MM-DD-YYYY');
        vm.dateRange = firstDate + ' - ' + lastDate;
        window.jQuery('#weeklyDatePicker').val(vm.dateRange);
        $scope.dateRangePicker.startDate = firstDate;
        $scope.dateRangePicker.endDate = lastDate;
      });
      getEmployerList();
    }

    vm.day = moment();

    function getEmployerList() {
      var listParam = {
        role: Number(vm.userData.user[0].role),
        userId: vm.userData.user[0].id
      };
      vm.promise = employerListService.getEmployerList(listParam)
        .then(function (data) {
            if (data.status === 200) {
              vm.employerList = data.data;
            } else {
              commonService.showSnackbar('error', data.statusText, data.status);
            }
          },
          function (response) {
            commonService.showSnackbar('error', response.statusText, response.status);
          });
    }

    $scope.setNullEmployerId = function () {
      $scope.selectedEmployer = '';
      vm.calenderData = [];
    };

    // Get Timesheet Details
    function getEmployerDetails() {
      $scope.selectedEmployer = JSON.parse(vm.selectedEmployerId);
      $scope.client = false;
      let formData = {
        employerId: $scope.selectedEmployer.id,
        startDate: $scope.dateRangePicker.startDate._d ?
          $scope.dateRangePicker.startDate._d : $scope.dateRangePicker.startDate,
        endDate: $scope.dateRangePicker.endDate
      };
      vm.promise = calenderService.getTimeSheetDetails(formData).then(function (data) {
        if (data.status === 200) {
          vm.calenderData = data.data;
        } else {
          vm.calenderData = [];
          commonService.showSnackbar('error', data.statusText, data.status);
        }
      }, function (response) {
        vm.calenderData = [];
        commonService.showSnackbar('error', response.statusText, response.status);
      });
    }
  }
})();
