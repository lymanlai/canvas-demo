angular.module('yh')
  .directive('yhMatch', [function () {
      return {
          require: 'ngModel',
          link: function (scope, elem, attrs, ctrl) {
            var me = attrs.ngModel;
            var matchTo = attrs.yhMatch;

            scope.$watch( matchTo, function(){
              ctrl.$setValidity('match', scope[me] === scope[matchTo] );
            });
            scope.$watch( me, function(){
              ctrl.$setValidity('match', scope[me] === scope[matchTo] );
            });
          }
      };
  }]);