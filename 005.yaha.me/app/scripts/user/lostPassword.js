'use strict';
angular.module('yh.user')
  .config(['$stateProvider', 'yh', function($stateProvider, yh) {
    $stateProvider.state('lostPassword', {
      url: '/lostPassword/',
      access: 'anon',
      templateUrl: yh.path('user/views/lostPassword.html'),
      controller: ['$scope', '$state', 'yhAlert', 'yhUser', '__', '$http', function($scope,$state, yhAlert, yhUser, __, $http){
        // $scope.email = 'lyman.lai2@yaha.me';

        $scope.submit = function(){
          $scope.alerts = [];
          var data = {
            email: $scope.email
          };

          $http.post( yh.api('user/lostPassword'), data )
            .success(function(){
              $scope.done = true;
              $scope.alerts.push({type:'success', msg: __('Reset password success! Please check your email, click on the verify link to reset password.')});
            })
            .error(function(result){
              var err = result.err;
              var msg = __('Unknown Error');
              var errHash = {
                'account_not_active' : __("Account isn't active yet."),
                'email_not_exist' : __("Email isn't register yet.")
              };

              if (errHash[err]) {
                msg = errHash[err];
              }
              $scope.alerts.push({type:'danger', msg: msg});
            });
        };
      }]
    });
  }]);