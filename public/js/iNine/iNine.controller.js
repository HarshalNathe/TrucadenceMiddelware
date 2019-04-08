(function () {
  'use strict';

  angular
    .module('trucadence')
    .controller('INineController', INineController);

  INineController.$inject = [
    '$scope',
    '$http',
    '$compile',
    '$rootScope',
    '$location',
    '$state',
    '$window',
    'newCandidateServices',
    'iNineService',
    'commonService',
    'toastr',
    'bsaDisclosureServices',
    'candidateAttachmentServices',
    '$q',
    'Upload',
    '$timeout',
    'FileSaver',
    'Blob',
    'lodash',
    'utilService'
  ];

  function INineController(
    $scope,
    $http,
    $compile,
    $rootScope,
    $location,
    $state,
    $window,
    newCandidateServices,
    iNineService,
    commonService,
    toastr,
    bsaDisclosureServices,
    candidateAttachmentServices,
    $q,
    Upload,
    $timeout,
    FileSaver,
    Blob,
    _,
    utilService) {
    var vm = this;
    vm.isEdit = false;
    vm.showUpdateButton = false;
    vm.hidePopUp = false;
    vm.securePassword = '';
    vm.ssn = '';
    vm.IS_Citizen_US = '';
    vm.Alien_Reg_No = '';
    vm.Alien_Reg_No_point4 = '';
    vm.AlienWork_Expiry_Date = null;
    vm.FormI94_Admission_No = '';
    vm.Foreign_Passport_No = '';
    vm.Issuance_Country = '';
    vm.listA_Document_Id = '';
    vm.listA_Document_Title = '';
    vm.listA_Issuing_Authority = '';
    vm.listA_Document_Number = '';
    vm.listA_Expiration_Date = null;
    vm.listB_Document_Id = '';
    vm.listB_Document_Title = '';
    vm.listB_Issuing_Authority = '';
    vm.listB_Document_Number = '';
    vm.listB_Expiration_Date = null;
    vm.listC_Document_Id = '';
    vm.listC_Document_Title = '';
    vm.listC_Issuing_Authority = '';
    vm.listC_Document_Number = '';
    vm.listC_Expiration_Date = null;
    vm.hideDate = true;

    vm.SignatureAttachment = {
      Attachment_Type_ID: '',
      Candidate_ID: '',
      Attachment_Date: '',
      Metadata_URL: '',
      Form_Master_ID: ''
    };

    // Test comment
    vm.user = $rootScope.user;
    vm.showUpdateButton = false;
    vm.AssignedDate = new Date();

    window.jQuery('#listAExpirationDate').datetimepicker({
      format: 'MM/DD/YYYY',
      minDate: new Date('1900-01-1')
    });

    window.jQuery('#listBExpirationDate').datetimepicker({
      format: 'MM/DD/YYYY',
      minDate: new Date('1900-01-1')
    });

    window.jQuery('#listCExpirationDate').datetimepicker({
      format: 'MM/DD/YYYY',
      minDate: new Date('1900-01-1')
    });

    init();

    function init() {
      vm.signature = {
        dataUrl: ''
      };

      vm.userName = utilService.getItem('userData');
      vm.showAdministratorSignature = false;

      if (vm.userName.user[0].role === '1' || vm.userName.user[0].role === 1) {
        vm.showAdministratorSignature = true;
      } else if (vm.userName.user[0].role === '0' || vm.userName.user[0].role === 0) {
        vm.showAdministratorSignature = false;
      }

      vm.candidateID = $state.params.candidate;
      getDocumentList();
      getFormMaster('Employment Eligibility Verification');

      if ($state.params.candidate.view) {
        vm.isEdit = true;
      }
    }

    vm.goToCandidateDetail = function () {
      $state.go('app.candidateDetail', {
        candidateID: $state.params.candidate.id
      });
    };

    vm.edit = function () {
      vm.isEdit = false;
      vm.showUpdateButton = true;
      vm.promise = $timeout(function () {}, 200);
    };

    function getCandidateDetail() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: $state.params.attachmentTypeId,
        FormMasterID: $state.params.formId
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getCandidatDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.candidatDetails = data.data;
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

    function getDocumentList() {
      var deferred = $q.defer();
      vm.promise = iNineService.getDocumentList()
        .then(function (data) {
          if (data.status === 200) {
            vm.documentList = data.data;
            deferred.resolve(data.data);
          } else {
            commonService.showSnackbar('error', 'Error While getting Document List details', data.status);
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    function getFormMaster(formName) {
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getFormMaster(formName)
        .then(function (data) {
          if (data.status === 200) {
            vm.formId = data.data[0].id;
            deferred.resolve(data.data);
            getAttachmentType('Emloyment_Eligibility_Doc');
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
            getInineDetails();
            getCandidateDetail();
          } else {
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    function getInineDetails() {
      var listParam = {
        candidateId: $state.params.candidate.id,
        AttachmentTypeID: vm.attachmentTypeId,
        FormMasterID: vm.formId
      };
      var deferred = $q.defer();
      vm.promise = iNineService.getInineDetails(listParam)
        .then(function (data) {
          if (data.status === 200) {
            vm.inineDetails = data.data;

            for (var i = 0; i < vm.inineDetails.CandidateAttachments.length; i++) {
              if (vm.inineDetails.CandidateAttachments[i].Document_List_ID === undefined) {
                vm.SignatureAttachment = vm.inineDetails.CandidateAttachments.splice(i, 1);
                vm.signature_ID = vm.SignatureAttachment[0].id;
                vm.AssignedDate = vm.SignatureAttachment[0].Attachment_Date;
                vm.getImage = function () {
                  return vm.SignatureAttachment[0].Metadata_URL;
                };
              }
            }

            vm.IS_Citizen_US = vm.inineDetails.EligibilityVerification[0].IS_Citizen_US;

            if (vm.inineDetails.EligibilityVerification[0].IS_Citizen_US === '3') {
              vm.Alien_Reg_No = vm.inineDetails.EligibilityVerification[0].
              Alien_Reg_No;
            }

            if (vm.inineDetails.EligibilityVerification[0].IS_Citizen_US === '4') {
              vm.Alien_Reg_No_point4 = vm.inineDetails.EligibilityVerification[0].
              Alien_Reg_No;
            }

            vm.AlienWork_Expiry_Date = vm.inineDetails.EligibilityVerification[0].
            AlienWork_Expiry_Date;
            vm.FormI94_Admission_No = vm.inineDetails.EligibilityVerification[0].
            FormI94_Admission_No;
            vm.Foreign_Passport_No = vm.inineDetails.EligibilityVerification[0].
            Foreign_Passport_No;
            vm.Issuance_Country = vm.inineDetails.EligibilityVerification[0].
            Issuance_Country;

            if (vm.inineDetails.CandidateAttachments.length === 1) {
              vm.listValue = 'A';
              vm.listADiplay = true;
              vm.listBCDiplay = false;
              vm.listA_Document_Id = vm.inineDetails.CandidateAttachments[0].Document_List_ID;
              vm.fileA_Name = vm.inineDetails.CandidateAttachments[0].Document_Name;
              vm.listA_Document_Title = vm.inineDetails.CandidateAttachments[0].Document_Title;
              vm.listA_Issuing_Authority = vm.inineDetails.CandidateAttachments[0].Issuing_Authority;
              vm.listA_Document_Number = vm.inineDetails.CandidateAttachments[0].Document_Number;
              vm.listA_Expiration_Date = vm.inineDetails.CandidateAttachments[0].Expiration_Date;
            } else {
              vm.listValue = 'B';
              vm.listADiplay = false;
              vm.listBCDiplay = true;
              vm.listB_Document_Id = vm.inineDetails.CandidateAttachments[0].Document_List_ID;
              vm.fileB_Name = vm.inineDetails.CandidateAttachments[0].Document_Name;
              vm.listB_Document_Title = vm.inineDetails.CandidateAttachments[0].Document_Title;
              vm.listB_Issuing_Authority = vm.inineDetails.CandidateAttachments[0].Issuing_Authority;
              vm.listB_Document_Number = vm.inineDetails.CandidateAttachments[0].Document_Number;
              vm.listB_Expiration_Date = vm.inineDetails.CandidateAttachments[0].Expiration_Date;

              vm.listC_Document_Id = vm.inineDetails.CandidateAttachments[1].Document_List_ID;
              vm.fileC_Name = vm.inineDetails.CandidateAttachments[1].Document_Name;
              vm.listC_Document_Title = vm.inineDetails.CandidateAttachments[1].Document_Title;
              vm.listC_Issuing_Authority = vm.inineDetails.CandidateAttachments[1].Issuing_Authority;
              vm.listC_Document_Number = vm.inineDetails.CandidateAttachments[1].Document_Number;
              vm.listC_Expiration_Date = vm.inineDetails.CandidateAttachments[1].Expiration_Date;
            }

            deferred.resolve(data.data);
          } else {
            commonService.showSnackbar('error', 'Error While geting Inine details', data.status);
            deferred.reject(data.data);
          }
        }, function (response) {
          deferred.reject(response.data);
        });
    }

    window.jQuery('#listAExpirationDate').on('dp.change', function (e) {
      vm.listA_Expiration_Date = moment(e.date._d).format('MM/DD/YYYY');
    });
    window.jQuery('#listBExpirationDate').on('dp.change', function (e) {
      vm.listB_Expiration_Date = moment(e.date._d).format('MM/DD/YYYY');
    });
    window.jQuery('#listCExpirationDate').on('dp.change', function (e) {
      vm.listC_Expiration_Date = moment(e.date._d).format('MM/DD/YYYY');
    });

    vm.listA = {
      Attachment_Date: '',
      Attachment_Type_ID: '',
      Candidate_ID: '',
      Form_Master_ID: '',
      Metadata_URL: '',
      Document_List_ID: '',
      Document_Title: '',
      Issuing_Authority: '',
      Document_Number: '',
      Expiration_Date: '',
      Document_Name: '',
      Document_Type: ''
    };

    vm.listB = {
      Attachment_Date: '',
      Attachment_Type_ID: '',
      Candidate_ID: '',
      Form_Master_ID: '',
      Metadata_URL: '',
      Document_List_ID: '',
      Document_Title: '',
      Issuing_Authority: '',
      Document_Number: '',
      Expiration_Date: '',
      Document_Name: '',
      Document_Type: ''
    };

    vm.listC = {
      Attachment_Date: '',
      Attachment_Type_ID: '',
      Candidate_ID: '',
      Form_Master_ID: '',
      Metadata_URL: '',
      Document_List_ID: '',
      Document_Title: '',
      Issuing_Authority: '',
      Document_Number: '',
      Expiration_Date: '',
      Document_Name: '',
      Document_Type: ''
    };

    var CandidateAttachmentsArray = [];
    vm.fileA = '';
    vm.fileB = '';
    vm.fileC = '';

    vm.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      alert('this is handler for file reader onload event!');
    };

    vm.uploadImageA = function (element) {
      if (vm.fileA[0].filesize > 500000) {
        commonService.showSnackbar('error', 'File is greater than 500 KB', '0');
        vm.fileA = [];
      } else {
        vm.fileA_Name = '';
        var attachmentType = 'Emloyment_Eligibility_Doc';
        var deferred = $q.defer();
        vm.promise = newCandidateServices.getAttachmentType(attachmentType)
          .then(function (data) {
            if (data.status === 200) {
              vm.listA.Attachment_Date = new Date();
              vm.listA.Attachment_Type_ID = data.data[0].id;
              vm.listA.Candidate_ID = vm.candidatDetails.id;
              vm.listA.Form_Master_ID = vm.formId;
              vm.listA.Metadata_URL = vm.fileA[0].base64;
              vm.listA.Document_List_ID = vm.listA_Document_Id;
              vm.listA.Document_Name = vm.fileA[0].filename;
              vm.listA.Document_Type = vm.fileA[0].filetype;
              deferred.resolve(data.data);
            } else {
              deferred.reject(data.data);
              $state.go('app.candidate');
            }
          }, function (response) {
            deferred.reject(response.data);
          });
      }
    };

    vm.uploadImageB = function (element) {
      if (vm.fileB[0].filesize > 500000) {
        commonService.showSnackbar('error', 'File is greater than 500 KB', '0');
        vm.fileB = [];
      } else {
        vm.fileB_Name = '';
        var attachmentType = 'Emloyment_Eligibility_Doc';
        var deferred = $q.defer();
        vm.promise = newCandidateServices.getAttachmentType(attachmentType)
          .then(function (data) {
            if (data.status === 200) {
              vm.listB.Attachment_Date = new Date();
              vm.listB.Attachment_Type_ID = data.data[0].id;
              vm.listB.Candidate_ID = vm.candidatDetails.id;
              vm.listB.Form_Master_ID = vm.formId;
              vm.listB.Metadata_URL = vm.fileB[0].base64;
              vm.listB.Document_List_ID = vm.listB_Document_Id;
              vm.listB.Document_Name = vm.fileB[0].filename;
              vm.listB.Document_Type = vm.fileB[0].filetype;
              deferred.resolve(data.data);
            } else {
              deferred.reject(data.data);
              $state.go('app.candidate');
            }
          }, function (response) {
            deferred.reject(response.data);
          });
      }
    };

    vm.uploadImageC = function (element) {
      if (vm.fileC[0].filesize > 500000) {
        commonService.showSnackbar('error', 'File is greater than 500 KB', '0');
        vm.fileC = [];
      } else {
        vm.fileC_Name = '';
        var attachmentType = 'Emloyment_Eligibility_Doc';
        var deferred = $q.defer();
        vm.promise = newCandidateServices.getAttachmentType(attachmentType)
          .then(function (data) {
            if (data.status === 200) {
              vm.listC.Attachment_Date = new Date();
              vm.listC.Attachment_Type_ID = data.data[0].id;
              vm.listC.Candidate_ID = vm.candidatDetails.id;
              vm.listC.Form_Master_ID = vm.formId;
              vm.listC.Metadata_URL = vm.fileC[0].base64;
              vm.listC.Document_List_ID = vm.listC_Document_Id;
              vm.listC.Document_Title = vm.listC_Document_Title;
              vm.listC.Issuing_Authority = vm.listC_Issuing_Authority;
              vm.listC.Document_Number = vm.listC_Document_Number;
              vm.listC.Expiration_Date = vm.listC_Expiration_Date;
              vm.listC.Document_Name = vm.fileC[0].filename;
              vm.listC.Document_Type = vm.fileC[0].filetype;
              deferred.resolve(data.data);
            } else {
              deferred.reject(data.data);
              $state.go('app.candidate');
            }
          }, function (response) {
            deferred.reject(response.data);
          });
      }
    };

    vm.download = function (file) {
      var data = base64toBlob([file.Metadata_URL],
        file.Document_Type);
      FileSaver.saveAs(data, file.Document_Name);
    };

    function base64toBlob(base64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 1024;
      var byteCharacters = atob(base64Data);
      var bytesLength = byteCharacters.length;
      var slicesCount = Math.ceil(bytesLength / sliceSize);
      var byteArrays = new Array(slicesCount);

      for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);

        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
        }

        byteArrays[sliceIndex] = new Uint8Array(bytes);
      }

      return new Blob(byteArrays, {
        type: contentType

      });
    }

    vm.submit = function () {
      if (vm.listA.Metadata_URL !== '') {
        vm.listA.Document_Title = vm.listA_Document_Title;
        vm.listA.Issuing_Authority = vm.listA_Issuing_Authority;
        vm.listA.Document_Number = vm.listA_Document_Number;
        vm.listA.Expiration_Date = vm.listA_Expiration_Date;
        CandidateAttachmentsArray.push(_.omitBy(vm.listA, _.isNil));
      }

      if (vm.listB.Metadata_URL !== '') {
        vm.listB.Document_Title = vm.listB_Document_Title;
        vm.listB.Issuing_Authority = vm.listB_Issuing_Authority;
        vm.listB.Document_Number = vm.listB_Document_Number;
        vm.listB.Expiration_Date = vm.listB_Expiration_Date;
        CandidateAttachmentsArray.push(_.omitBy(vm.listB, _.isNil));
      }

      if (vm.listC.Metadata_URL !== '') {
        vm.listC.Document_Title = vm.listC_Document_Title;
        vm.listC.Issuing_Authority = vm.listC_Issuing_Authority;
        vm.listC.Document_Number = vm.listC_Document_Number;
        vm.listC.Expiration_Date = vm.listC_Expiration_Date;
        CandidateAttachmentsArray.push(_.omitBy(vm.listC, _.isNil));
      }

      if (vm.signature.dataUrl !== '') {
        vm.SignatureAttachment.Attachment_Type_ID = vm.attachmentTypeId;
        vm.SignatureAttachment.Candidate_ID = vm.candidatDetails.id;
        vm.SignatureAttachment.Attachment_Date = vm.AssignedDate;
        vm.SignatureAttachment.Metadata_URL = vm.signature.dataUrl;
        vm.SignatureAttachment.Form_Master_ID = vm.formId;
        CandidateAttachmentsArray.push(_.omitBy(vm.SignatureAttachment, _.isNil));
      }

      var sendData = {
        Candidate_ID: $state.params.candidate.id,
        IS_Citizen_US: vm.IS_Citizen_US,
        Alien_Reg_No: '',
        AlienWork_Expiry_Date: vm.AlienWork_Expiry_Date,
        FormI94_Admission_No: vm.FormI94_Admission_No,
        Foreign_Passport_No: vm.Foreign_Passport_No,
        Issuance_Country: vm.Issuance_Country,
        CandidateAttachments: CandidateAttachmentsArray
      };

      if (vm.Alien_Reg_No !== '') {
        sendData.Alien_Reg_No = vm.Alien_Reg_No;
      }

      if (vm.Alien_Reg_No_point4 !== '') {
        sendData.Alien_Reg_No = vm.Alien_Reg_No_point4;
      }

      var deferred = $q.defer();
      vm.promise = iNineService
        .saveiNineDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidateID || $state.params.candidate.id
            });
            deferred.resolve(response.data);
            commonService.showSnackbar('info', 'I9 Form details added sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While adding I9 Form details', response.status);
            deferred.reject(response.data);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While adding I9 Form details', response.status);
          deferred.reject(response.data);
        });

      var formStatus = {
        id: vm.candidatDetails.formStatuses[0].id,
        Candidate_ID: vm.candidatDetails.id,
        Is_EmploymentEligibilityVerification_Fill: true,
      };

      vm.promise = newCandidateServices
        .updateFormStatus(_.omitBy(formStatus, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
          }
        }, function (response) {});
    };

    vm.update = function () {
      if (vm.inineDetails.CandidateAttachments.length > 0) {
        vm.updateFileAandB();
      } else {
        vm.createNewFiles();
      }
    };

    vm.updateDetails = function () {
      if (vm.inineDetails.CandidateAttachments.length <= 1 && vm.listC.Metadata_URL !== '') {
        vm.listC.Document_Title = vm.listC_Document_Title;
        vm.listC.Issuing_Authority = vm.listC_Issuing_Authority;
        vm.listC.Document_Number = vm.listC_Document_Number;
        vm.listC.Expiration_Date = vm.listC_Expiration_Date;
        CandidateAttachmentsArray.push(_.omitBy(vm.listC, _.isNil));
      } else if (vm.inineDetails.CandidateAttachments.length === 2 && vm.listC.Metadata_URL !== '') {
        vm.inineDetails.CandidateAttachments[1].
        Document_Title = vm.listC_Document_Title;
        vm.inineDetails.CandidateAttachments[1].
        Issuing_Authority = vm.listC_Issuing_Authority;
        vm.inineDetails.CandidateAttachments[1].
        Document_Number = vm.listC_Document_Number;
        vm.inineDetails.CandidateAttachments[1].
        Expiration_Date = vm.listC_Expiration_Date;
        vm.inineDetails.CandidateAttachments[1].
        Attachment_Date = new Date();
        vm.inineDetails.CandidateAttachments[1].
        Document_List_ID = vm.listC.Document_List_ID;
        vm.inineDetails.CandidateAttachments[1].
        Metadata_URL = vm.listC.Metadata_URL;
        vm.inineDetails.CandidateAttachments[1].
        Document_Name = vm.listC.Document_Name;
        vm.inineDetails.CandidateAttachments[1].
        Document_Type = vm.listC.Document_Type;
        CandidateAttachmentsArray.push(_.omit(vm.inineDetails.CandidateAttachments[1], ['$$hashKey']));
      }

      if (vm.signature.dataUrl !== '') {
        vm.SignatureAttachment = {};
        vm.SignatureAttachment.id = vm.signature_ID;
        vm.SignatureAttachment.Attachment_Type_ID = vm.attachmentTypeId;
        vm.SignatureAttachment.Candidate_ID = vm.candidatDetails.id;
        vm.SignatureAttachment.Attachment_Date = vm.AssignedDate;
        vm.SignatureAttachment.Metadata_URL = vm.signature.dataUrl;
        vm.SignatureAttachment.Form_Master_ID = vm.formId;
        CandidateAttachmentsArray.push(_.omitBy(vm.SignatureAttachment, _.isNil));
      }

      var sendData = {
        id: vm.inineDetails.EligibilityVerification[0].id,
        Candidate_ID: $state.params.candidate.id,
        IS_Citizen_US: vm.IS_Citizen_US,
        Alien_Reg_No: '',
        AlienWork_Expiry_Date: vm.AlienWork_Expiry_Date,
        FormI94_Admission_No: vm.FormI94_Admission_No,
        Foreign_Passport_No: vm.Foreign_Passport_No,
        Issuance_Country: vm.Issuance_Country,
        CandidateAttachments: CandidateAttachmentsArray
      };

      if (vm.Alien_Reg_No !== '') {
        sendData.Alien_Reg_No = vm.Alien_Reg_No;
      }

      if (vm.Alien_Reg_No_point4 !== '') {
        sendData.Alien_Reg_No = vm.Alien_Reg_No_point4;
      }

      vm.promise = iNineService
        .updateiNineDetails(_.omitBy(sendData, _.isNil))
        .then(function (response) {
          if (response.status === 200) {
            $state.go('app.candidateDetail', {
              candidateID: $state.params.candidate.id
            });
            commonService.showSnackbar('info', 'I9 Form details updated sucessfully', response.status);
          } else {
            commonService.showSnackbar('error', 'Error While adding I9 Form details', response.status);
          }
        }, function (response) {
          commonService.showSnackbar('error', 'Error While adding I9 Form details', response.status);
        });
    };

    vm.getSecurePassword = function () {
      var userData = JSON.parse(localStorage.getItem('userData'));
      var listParam = {
        userId: userData.user[0].id,
        secureFieldPassword: vm.securePassword
      };
      var deferred = $q.defer();
      vm.promise = newCandidateServices.getsecurefieldpassword(listParam)
        .then(function (data) {
          if (utilService.checkSecurePassword(vm.securePassword)) {
            vm.userDetails = data.data;
            vm.hidePopUp = true;
            vm.ssn = vm.candidatDetails.Social_Security_Number;
            deferred.resolve(data.data);
          } else {
            deferred.reject(data.data);
            $state.go('app.candidate');
          }
        }, function (response) {
          if (utilService.checkSecurePassword(vm.securePassword)) {
            vm.hidePopUp = true;
            vm.ssn = vm.candidatDetails.Social_Security_Number;
            deferred.resolve(response.data);
          } else {
            toastr.error('Please enter valid secure password.');
            deferred.reject(response.data);
          }
        });
    };

    vm.createNewFiles = function () {
      if (vm.listA.Metadata_URL !== '') {
        vm.listA.Document_Title = vm.listA_Document_Title;
        vm.listA.Issuing_Authority = vm.listA_Issuing_Authority;
        vm.listA.Document_Number = vm.listA_Document_Number;
        vm.listA.Expiration_Date = vm.listA_Expiration_Date;
        CandidateAttachmentsArray.push(_.omitBy(vm.listA, _.isNil));
      }

      if (vm.listB.Metadata_URL !== '') {
        vm.listB.Document_Title = vm.listB_Document_Title;
        vm.listB.Issuing_Authority = vm.listB_Issuing_Authority;
        vm.listB.Document_Number = vm.listB_Document_Number;
        vm.listB.Expiration_Date = vm.listB_Expiration_Date;
        CandidateAttachmentsArray.push(_.omitBy(vm.listB, _.isNil));
      }

      if (vm.listC.Metadata_URL !== '') {
        vm.listC.Document_Title = vm.listC_Document_Title;
        vm.listC.Issuing_Authority = vm.listC_Issuing_Authority;
        vm.listC.Document_Number = vm.listC_Document_Number;
        vm.listC.Expiration_Date = vm.listC_Expiration_Date;
        CandidateAttachmentsArray.push(_.omitBy(vm.listC, _.isNil));
      }
    };

    vm.updateFileAandB = function () {
      if (vm.listA.Metadata_URL !== '') {
        if (vm.inineDetails.CandidateAttachments.length === 2) {
          var listParam = {
            candidateId: vm.inineDetails.CandidateAttachments[1].Candidate_ID,
            candidateAttachmentId: vm.inineDetails.CandidateAttachments[1].id
          };

          vm.promise = iNineService.deleteAttachmentDetails(listParam)
            .then(function (data) {
              if (data.status === 200) {
                vm.inineDetails.CandidateAttachments.splice(1, 1);
                vm.attachmentListDetails(vm.inineDetails.CandidateAttachments);
              } else {
                toastr.error('Please enter valid candidate ID or Attachment ID.');
              }
            }, function (response) {
              toastr.error('Please enter valid candidate ID or Attachment ID.');
            });
        } else {
          vm.attachmentListDetails(vm.inineDetails.CandidateAttachments);
        }
      } else {
        vm.attachmentListDetails(vm.inineDetails.CandidateAttachments);
      }
    };

    vm.attachmentListDetails = function (data) {
      vm.inineDetails.CandidateAttachments = data;

      if (vm.listA.Metadata_URL !== '') {
        vm.inineDetails.CandidateAttachments[0].
        Document_Title = vm.listA_Document_Title;
        vm.inineDetails.CandidateAttachments[0].
        Issuing_Authority = vm.listA_Issuing_Authority;
        vm.inineDetails.CandidateAttachments[0].
        Document_Number = vm.listA_Document_Number;
        vm.inineDetails.CandidateAttachments[0].
        Expiration_Date = vm.listA_Expiration_Date;
        vm.inineDetails.CandidateAttachments[0].
        Attachment_Date = new Date();
        vm.inineDetails.CandidateAttachments[0].
        Document_List_ID = vm.listA.Document_List_ID;
        vm.inineDetails.CandidateAttachments[0].
        Metadata_URL = vm.listA.Metadata_URL;
        vm.inineDetails.CandidateAttachments[0].
        Document_Name = vm.listA.Document_Name;
        vm.inineDetails.CandidateAttachments[0].
        Document_Type = vm.listA.Document_Type;
        CandidateAttachmentsArray.push(_.omit(vm.inineDetails.CandidateAttachments[0], ['$$hashKey']));
      }

      if (vm.listB.Metadata_URL !== '') {
        vm.inineDetails.CandidateAttachments[0].
        Document_Title = vm.listB_Document_Title;
        vm.inineDetails.CandidateAttachments[0].
        Issuing_Authority = vm.listB_Issuing_Authority;
        vm.inineDetails.CandidateAttachments[0].
        Document_Number = vm.listB_Document_Number;
        vm.inineDetails.CandidateAttachments[0].
        Expiration_Date = vm.listB_Expiration_Date;
        vm.inineDetails.CandidateAttachments[0].
        Attachment_Date = new Date();
        vm.inineDetails.CandidateAttachments[0].
        Document_List_ID = vm.listB.Document_List_ID;
        vm.inineDetails.CandidateAttachments[0].
        Metadata_URL = vm.listB.Metadata_URL;
        vm.inineDetails.CandidateAttachments[0].
        Document_Name = vm.listB.Document_Name;
        vm.inineDetails.CandidateAttachments[0].
        Document_Type = vm.listB.Document_Type;
        CandidateAttachmentsArray.push(_.omit(vm.inineDetails.CandidateAttachments[0], ['$$hashKey']));
      }

      vm.updateDetails();
    };

    vm.cancel = function () {
      $state.go('app.candidateDetail', {
        candidateID: $state.params.candidate.id
      });
    };

    vm.close = function () {
      vm.ssn = '';
      vm.hidePopUp = false;
      vm.securePassword = '';
    };

    vm.selectList = function (listValue) {
      $scope.iNineForm.$setPristine();

      if (listValue === 'A') {
        vm.listB_Document_Id = '';
        vm.listB_Document_Title = '';
        vm.listB_Issuing_Authority = '';
        vm.listB_Document_Number = '';
        vm.listB_Expiration_Date = '';
        vm.listC_Document_Id = '';
        vm.listC_Document_Title = '';
        vm.listC_Issuing_Authority = '';
        vm.listC_Document_Number = '';
        vm.listC_Expiration_Date = '';
        vm.listADiplay = true;
        vm.listBCDiplay = false;
        vm.fileA_Name = '';
        vm.fileB_Name = '';
        vm.fileC_Name = '';
        document.getElementById('exampleInputFileB').value = null;
        document.getElementById('exampleInputFileC').value = null;
      } else {
        vm.listADiplay = false;
        vm.listBCDiplay = true;
        vm.listA_Document_Id = '';
        vm.listA_Document_Title = '';
        vm.listA_Issuing_Authority = '';
        vm.listA_Document_Number = '';
        vm.listA_Expiration_Date = '';
        vm.fileA_Name = '';
        vm.fileB_Name = '';
        vm.fileC_Name = '';
        document.getElementById('exampleInputFileA').value = null;
      }
    };

    vm.hideExpirationDate = function (value) {
      if (value === '5aa21e92a327d3aca8bcc813' || value === '5aa21e92a327d3aca8bcc816' ||
        value === '5aa21e91a327d3aca8bcc810') {
        vm.hideDate = false;
        vm.listC_Expiration_Date = '';
      } else {
        vm.hideDate = true;
      }
    };

    vm.clear = function () {
      var canvas = document.querySelector('canvas');
      var signaturePad = new SignaturePad(canvas);

      // Clears the canvas
      signaturePad.clear();
      vm.signature.dataUrl = '';
      vm.signPadDisable = false;
    };

    vm.signaturePadDisabled = function () {
      vm.signPadDisable = true;
    };
  }
})();
