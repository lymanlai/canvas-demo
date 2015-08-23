angular.module('yh')
  .directive('itemFocus', function ($timeout) {
    return function (scope, elem, attrs) {
      scope.$watch(attrs.itemFocus, function (newVal) {
        if (newVal) {
          $timeout(function () {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  });