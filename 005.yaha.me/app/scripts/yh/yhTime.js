angular.module('yh')
  .directive('yhTime', ['$http', '$injector', function ($http, $injector) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        function isTimeValidate(time) {
          if (time === undefined) {
            time = '';
          }
          
          var result = false, m;
          var re = /^\s*([01]?\d|2[0-3])[:：]?([0-5]\d)\s*$/;
          if ((m = time.match(re))) {
              result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
          }          
          if (result === false) {
            return false;
          }
          return true;
        }

        elem.bind('keyup', function () {
          scope.$apply(function(){
            var isValidate = isTimeValidate( ctrl.$viewValue );
            ctrl.$setValidity('yhTime', isValidate );
          });
        });
      }
    };
  }]);