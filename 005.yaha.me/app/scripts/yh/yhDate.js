angular.module('yh')
  .directive('yhDate', ['$http', '$injector', function ($http, $injector) {    
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        function parseDate(str) {
          if (str === undefined) {
            str = '';
          }
          var m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!m) {
            return null;
          }
          var theDate = new Date(m[1], m[2]-1, m[3]);
          var year = theDate.getFullYear();
          var month = ('0' + (theDate.getMonth() + 1 )).slice(-2);
          var day = ('0' + theDate.getDate()).slice(-2);
          var formatedDate = year + '-' + month + '-' + day;

          return formatedDate;
        }

        function isDateValidate(originalDate, formatedDate) {
          if (!formatedDate) {
            return false;
          }
          if (originalDate === formatedDate) {
            return true;
          }

          return false;
        }

        elem.bind('keyup', function () {
          scope.$apply(function(){
            var originalDate = ctrl.$viewValue;
            var formatedDate = parseDate( ctrl.$viewValue );
            var isValidate = isDateValidate( originalDate, formatedDate );
            ctrl.$setValidity('yhDate', isValidate );
          });
        });
      }
    };
  }]);