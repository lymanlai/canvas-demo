angular.module('yh')
  .directive('yhNowYear', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<span>{{now}}</span>',
      link: function(scope) {
        scope.now = (new Date()).getFullYear();
      }
    };
  });