(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('CandidateDetailController', CandidateDetailController);

  CandidateDetailController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'newCandidateServices',
    'candidateDetailServices',
    'commonService',
    'toastr',
    '$timeout',
    '$q',
    'lodash',
    'utilService'
  ];

  function CandidateDetailController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    newCandidateServices,
    candidateDetailServices,
    commonService,
    toastr,
    $timeout,
    $q,
    _,
    utilService) {
    var vm = this;
    vm.isEdit = false;
    vm.temp = '';
    vm.candidatDetails = '';
    init();

    function init() {
      //  GetCandidateList();
      vm.userName = utilService.getItem('userData');
      getFormMaster('Employment Application', 'Application_Signature');
    }

    // Test comment
    vm.user = $rootScope.user;

    function getFormMaster(formName, attacmentTypeName) {
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getFormMaster(formName)
        .then(function (data) {
          if (data.status === 200) {
            vm.formId = data.data[0].id;
            deferred.resolve(data.data);
            getAttachmentType(attacmentTypeName);
          } else {
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    function getAttachmentType(attachmentType) {
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getAttachmentType(attachmentType)
        .then(function (data) {
          if (data.status === 200) {
            vm.attachmentTypeId = data.data[0].id;
            deferred.resolve(data.data);
            getCandidateDetail();
          } else {
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    function getCandidateDetail() {
      var listParam = {
        candidateId: $state.params.candidateID || $state.params.candidate.id,
        AttachmentTypeID: vm.attachmentTypeId,
        FormMasterID: vm.formId
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCandidatDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.candidatDetails = data.data;
            vm.AssignedDate = vm.candidatDetails.candidateAttachments[0]
              .Attachment_Date;
            vm.getImage = function () {
              return vm.candidatDetails.candidateAttachments[0]
                .Metadata_URL;
            };

            deferred.resolve(data.data);
          } else {
            commonService.showSnackbar('error', 'Error While getting Candidate details', data.status);
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    function getCountryName(countryId) {
      var param = {
        id: countryId,
        state: false
      };
      var deferred = $q.defer();
      candidateDetailServices.getCountryById(param)
        .then(function (data) {
          if (data.status === 200) {
            deferred.resolve(data.data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
      return deferred.promise;
    }

    function getStateName(stateId) {
      var param = {
        id: stateId,
        city: false
      };
      var deferred = $q.defer();
      candidateDetailServices.getStateById(param)
        .then(function (data) {
          if (data.status === 200) {
            deferred.resolve(data.data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
      return deferred.promise;
    }

    function getCityName(cityId) {
      var param = {
        cityId: cityId
      };
      var deferred = $q.defer();
      candidateDetailServices.getCityById(param)
        .then(function (data) {
          if (data.status === 200) {
            deferred.resolve(data.data);
          } else {
            deferred.reject(data);
          }
        }, function (response) {
          deferred.reject(response);
        });
      return deferred.promise;
    }

    var param = {
      id: $state.params.candidateID,
      formId: vm.formId,
      attachmentTypeId: vm.attachmentTypeId,
      view: false
    };

    var paramView = {
      id: $state.params.candidateID,
      formId: vm.formId,
      attachmentTypeId: vm.attachmentTypeId,
      view: true
    };

    vm.goToDisclosure = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.bsaDisclosure', {
        candidate: param
      });
    };

    vm.goToDisclosureView = function () {
      paramView.formId = vm.formId;
      paramView.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.bsaDisclosure', {
        candidate: paramView
      });
    };

    vm.goToSelfIdentification = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.selfIdentification', {
        candidate: param
      });
    };

    vm.goToSelfIdentificationView = function () {
      paramView.formId = vm.formId;
      paramView.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.selfIdentification', {
        candidate: paramView
      });
    };

    vm.goToDrugTesting = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.drugTesting', {
        candidate: param
      });
    };

    vm.goToDrugTestingView = function () {
      paramView.formId = vm.formId;
      paramView.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.drugTesting', {
        candidate: paramView
      });
    };

    vm.goToSaftyRules = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.safetyRules', {
        candidate: param
      });
    };

    vm.goToSaftyRulesView = function () {
      paramView.formId = vm.formId;
      paramView.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.safetyRules', {
        candidate: paramView
      });
    };

    vm.goToInineDoc = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.iNine', {
        candidate: param
      });
    };

    vm.goToInineDocView = function () {
      paramView.formId = vm.formId;
      paramView.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.iNine', {
        candidate: paramView
      });
    };

    vm.goToIllinois = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.illinois', {
        candidate: param
      });
    };

    vm.goToIllinoisView = function () {
      paramView.formId = vm.formId;
      paramView.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.illinois', {
        candidate: paramView
      });
    };

    vm.goToWFourIllinois = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.wFour', {
        candidate: param
      });
    };

    vm.goToWFourIllinoisView = function () {
      paramView.formId = vm.formId;
      paramView.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.wFour', {
        candidate: paramView
      });
    };

    vm.goTonewCandidateEdit = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.newCandidateEdit', {
        candidate: param
      });
    };

    vm.goToMemberApplication = function () {
      param.formId = vm.formId;
      param.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.memberApplication', {
        candidate: param
      });
    };

    vm.goToMemberApplicationView = function () {
      paramView.formId = vm.formId;
      paramView.attachmentTypeId = vm.attachmentTypeId;
      $state.go('app.memberApplication', {
        candidate: paramView
      });
    };
  }
})();
