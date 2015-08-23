angular.module('yh')
  .directive('itemBlur', function () {
    return function (scope, elem, attrs) {
      elem.bind('blur', function () {
        scope.$apply(attrs.itemBlur);
      });
    };
  });