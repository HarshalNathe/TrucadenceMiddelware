(function () {
  'use strict';

  angular
    .module('trucadence')
    .directive('timepicker', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
          window.jQuery(function () {
            element.timepicker({
              onSelect: function (time) {
                ngModelCtrl.$setViewValue(time);
                scope.$apply();
              }
            });
          });
        }
      };
    });
})();
