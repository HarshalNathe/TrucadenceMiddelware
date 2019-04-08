(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('InineDocumentController', InineDocumentController);

  InineDocumentController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'wFourServices',
    'newCandidateServices',
    'commonService',
    'toastr',
    '$q',
    'Upload',
    'lodash'
  ];

  function InineDocumentController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    wFourServices,
    newCandidateServices,
    commonService,
    toastr,
    $q,
    Upload,
    _) {
    var vm = this;
    vm.file = '';
    init();

    function init() {
      console.log('inside init I9 controller');
      console.log('I9 view ', $state.params.candidate);

      if ($state.params.candidate.view) {
        vm.isEdit = true;
      }
    }

    // Test comment
    vm.user = $rootScope.user;

    vm.uploadImage = function (element) {
      console.log('file data', vm.file);
    };
    
    vm.upload = function (file) {
      console.log('file', file);
      Upload.base64DataUrl(file).then(function (urls) {
        console.log('urls', urls);
      });
    };
  }
})();
