angular.module('yh')
  .directive('yhFocusByOver', function ($timeout) {
    return function (scope, elem, attrs) {
      elem.bind('mouseover', function () {
        elem[0].focus();
      });
    };
  });