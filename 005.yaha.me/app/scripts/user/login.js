'use strict';
angular.module('yh.user')
  .config(['$stateProvider', 'yh', function($stateProvider, yh) {
    $stateProvider.state('login', {
      url: '/login/',
      templateUrl: yh.path('user/views/login.html'),
      controller: ['$scope', '$state', 'yhAlert', 'yhUser', '__', function($scope,$state, yhAlert, yhUser, __){
        var isLogin = yhUser.isLoggedIn();
        if( isLogin ){
          yhUser.restoreStateOrToHome();
        }
        $scope.alerts = yhAlert.pull('login');

        $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };

        // $scope.email = '316338109@qq.com';
        // $scope.password = '123456';

        $scope.submit = function(){
          $scope.alerts = [];
          var data = {
            email: $scope.email,
            password: $scope.password
          };

          yhUser.login(data,function(err){
            if (!err) {
              return yhUser.restoreStateOrToHome();
            }
            var msg = err;
            var errHash = {
              'account_not_active' : __("Account isn't active yet."),
              'email_not_exist' : __("Email isn't register yet."),
              'password_not_correct' : __("Password was incorrect.")
            };
            if( err.err && errHash[err.err] ) {
              msg = errHash[err.err];
            }

            $scope.alerts.push({type:'danger', msg: msg});
          });
        };
      }]
    });
  }]);