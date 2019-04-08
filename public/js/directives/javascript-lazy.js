/*global angular */
(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  app.directive('script', function ($timeout) {
    return {
      restrict: 'E',
      scope: false,
      link: function (scope, elem, attr) {
        if (attr.type === 'text/javascript') {
          var code = elem.text();
          /*jslint evil: true */
          var f = new Function(code);
          $timeout(function () {
            f();
          });
        }
      }
    };
  });
}(angular));
