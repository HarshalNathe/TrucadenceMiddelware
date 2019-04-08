(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('HomeController', HomeController);

  HomeController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    'Auth',
    'Idle',
    'DashboardService',
    'commonService'
  ];

  function HomeController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    Auth,
    Idle,
    DashboardService,
    commonService
  ) {
    var vm = this;
    vm.tagline = 'Dynamic Html Form Example';

    $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
      if (!value && oldValue) {
        $state.go('login');
      }
    }, true);
    Idle.watch();

    $scope.labels = ['Today', 'This Week', 'This Month', 'This Year'];
    $scope.series = ['Series A'];

    $scope.barlabels = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.barseries = ['Series A'];

    $scope.barChartColour = [{
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)', 'rgba(215, 99, 132, 0.2)', 'rgba(200, 159, 64, 0.2)',
        'rgba(155, 205, 86, 0.2)', 'rgba(175, 192, 192, 0.2)', 'rgba(154, 162, 235, 0.2)',
        'rgba(183, 102, 255, 0.2)'],
      borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)',
        'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)',
        'rgba(200, 159, 64)', 'rgba(155, 205, 86)', 'rgba(175, 192, 192)',
        'rgba(154, 162, 235)', 'rgba(183, 102, 255)'],
      borderWidth: 1
    }];

    $scope.pieChartColour = [{
      backgroundColor: ['rgb(54, 162, 235)', 'rgba(54, 162, 235, 0.2)'],
      borderColor: 'white'
    }];

    $scope.doughnutChartColour = [{
      backgroundColor: ['white', 'rgba(30, 144, 255, 0.8)']
    }];

    $scope.lineChartColour = [{
      backgroundColor: ['rgba(175, 192, 192, 0.2)'],
      borderColor: 'MediumSeaGreen'
    }];

    $scope.doughnutlabels = ['Number of incomplete profiles', 'Number of completed profiles'];

    $scope.pielabels = ['Recently updated profiles', 'Total number of profiles'];

    init();

    function init() {
      // Calling service for doughnutchart
      DashboardService.getProfileStat()
      .then(function (data) {
        if (data.status === 200) {
          try {
            var total = data.data.candidate;
            var completed = data.data.completed;
            var incomplete = data.data.incompleted;
            var completePercent = (completed / total) * 100;
            var incompletePercent = 100 - completePercent;
            $scope.doughnutchart = [
              [incomplete, completed]
            ];
          }catch (err) {
            console.error('doughnutchart data is not good');
            $scope.doughnutchart = [
              [100, 0]
            ];
          }
        } else {
          commonService.showSnackbar('error', data.statusText, data.status);
        }
      }, function (response) {
        commonService.showSnackbar('error', response.statusText, response.status);
      });

      // Calling service for pie chart
      DashboardService.getCandidateStat()
      .then(function (data) {
        if (data.status === 200) {
          try {
            var total = data.data.totalCandidate;
            var recentlyUpdated = data.data.recentlyUpdated[0].count;
            var remaining = total - recentlyUpdated;
            $scope.piedata = [
              [recentlyUpdated, remaining]
            ];
          }catch (err) {
            console.error('pie chart data is not good');
            $scope.piedata = [
              [20, 80]
            ];
          }
        } else {
          commonService.showSnackbar('error', data.statusText, data.status);
        }
      }, function (response) {
        commonService.showSnackbar('error', response.statusText, response.status);
      });

      // Calling service for bar chart
      DashboardService.getCandidateRegStat()
      .then(function (data) {
        if (data.status === 200) {
          try {
            var list = data.data;
            var months = [];
            var rec = [];
            list.forEach(function (elem, index) {
              months.push($scope.barlabels[elem._id - 1]);
              rec.push(elem.count);
            });
            $scope.barMonths = months;
            $scope.barchart = rec;
          }catch (err) {
            console.error('bar chart data is not good');
            $scope.barMonths = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
            $scope.barchart = [
              [15, 25, 80, 41, 56, 55, 40, 60, 72, 78, 88, 100]
            ];
          }
        } else {
          commonService.showSnackbar('error', data.statusText, data.status);
        }
      }, function (response) {
        commonService.showSnackbar('error', response.statusText, response.status);
      });

      // Calling service for line chart
      DashboardService.getUserRegStat()
      .then(function (data) {
        if (data.status === 200) {
          try {
            var list = data.data;
            var label = [];
            var rec = [];

            for (var property in list) {
              if (list.hasOwnProperty(property)) {
                if (Array.isArray(list[property])) {
                  if (list[property].length > 0) {
                    rec.push(list[property][0].count);
                  }else {
                    rec.push(0);
                  }
                }else {
                  rec.push(0);
                }

                label.push(property);
              }
            }

            $scope.labels = label;
            $scope.data = rec;
          }catch (err) {
            console.error('line chart data is not good');
            $scope.data = [
              [500, 2500, 5000, 10000]
            ];
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
