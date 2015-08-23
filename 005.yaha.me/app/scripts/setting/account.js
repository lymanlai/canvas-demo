'use strict';
angular.module('yh.setting')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('setting.account', {
      url: '',
      access: 'user',
      templateUrl: yh.path('setting/views/account.html'),
      controller: ['$scope', 'yhUser', function($scope, yhUser){
        $scope.formData = yhUser.getMe();
        
        if (!$scope.formData) {
          return;
        }
        
        $scope.formData.changePassword = true;
        // $scope.oldPassword = '123456';
        // $scope.newPassword = '123456';
        // $scope.verifyPassword = '123456';

        $scope.submit = function(){
          var data = {
            oldPassword: $scope.oldPassword,
            newPassword: $scope.newPassword
          };
          yhUser.changePassword(data, function(err) {    
            if( !err ){
              $scope.formData.changePassword = false;
              $scope.oldPassword = '';
              $scope.newPassword = '';
              $scope.verifyPassword = '';
            }
          });
        };
      }]
    });
  }]);