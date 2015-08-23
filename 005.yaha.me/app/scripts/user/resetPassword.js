'use strict';
angular.module('yh.user')
  .config(['$stateProvider', 'yh', function($stateProvider, yh) {
    $stateProvider.state('resetPassword', {
      url: '/resetPassword/:email/:resetPasswordKey/',
      access: 'anon',
      templateUrl: yh.path('user/views/resetPassword.html'),
      controller: ['$scope', '$state', 'yhAlert', 'yhUser', '__', '$stateParams', '$http', 'yhModal', '$timeout', function($scope,$state, yhAlert, yhUser, __, $stateParams, $http, yhModal, $timeout){
        $scope.email = $stateParams.email;
        $scope.resetPasswordKey = $stateParams.resetPasswordKey;
        // $scope.password = '123456';
        // $scope.confirmPassword = '123456';

        $scope.submit = function(){
          $scope.alerts = [];
          var data = {
            email: $scope.email,
            resetPasswordKey: $scope.resetPasswordKey,
            password: $scope.password
          };
          $http.post( yh.api('user/resetPassword'), data )
            .success(function(){              
              yhModal( __('Success'), __('Update password success, please wait while auto login.') );
              yhUser.login(data, function(err, user){
                if(err){
                  yhModal( __('Failure'), __('Email or Password was incorrect.') );
                }else{
                  $timeout(yhUser.restoreStateOrToHome, 1000);
                }
              });
            })
            .error(function(){
              $scope.alerts.push({type:'danger', msg: __('Reset Key is not correct or expired already.')});
            });

        };
      }]
    });
  }]);