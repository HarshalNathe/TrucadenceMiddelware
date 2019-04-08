(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  app.directive('ssnInput', function ($timeout) {
    return {
      require: 'ngModel',
      link: function (scop, elem, attr, ngModel) {
        var $ = window.jQuery;
        $(elem).mask('999-99-9999');
        var temp;
        var regxa = /^(\d{3}-?\d{2}-?\d{4})$/;
        $(elem).focusin(function () {
          $(elem).val(temp);
        });
        $(elem).on('blur', function () {
          temp = $(elem).val();
          
          if (regxa.test($(elem).val())) {
            ngModel.$setViewValue(temp);
            $(elem).val('XXX-XX' + temp.slice(6));
          }
        });
      }
    };
  });
}(angular));
