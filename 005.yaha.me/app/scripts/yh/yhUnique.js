angular.module('yh')
  .directive('yhUnique', ['$http', '$injector', function ($http, $injector) {
    var yh;
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        elem.bind('keyup', function () {
          var email = attrs.yhUnique;
          if (!email) {
            ctrl.$setValidity('unique', true );
            return;
          }
          yh = yh || $injector.get('yh');
          $http.get( yh.api('user/isExist?email=' + email) ).
            success(function(result){
              ctrl.$setValidity('unique', result.status !== 'is_exist' );
            });
        });
      }
    };
  }]);