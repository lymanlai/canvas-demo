'use strict';
angular.module('yh.user')
  .config(['$stateProvider', 'yh', function($stateProvider, yh) {
    $stateProvider.state('logout', {
      url: '/logout/',
      access: 'user',
      templateUrl: yh.path('user/views/logout.html'),
      controller: ['$scope', '$state', '$timeout', 'yhAlert', 'yhUser', '__', function($scope, $state, $timeout, yhAlert, yhUser, __){

        $scope.alerts = [
          {type:'success', msg: __('Loggout success, redirecting!')}
        ];

        $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };

        var totalSeconds = 100;
        var currentSeconds = 0;
        var doTimeOut = function(){   
          $scope.logoutProgress = (currentSeconds/totalSeconds) * 100 ;
          if( currentSeconds === totalSeconds ){
            yhUser.restoreStateOrToHome();
          }else{
            currentSeconds++;
            $timeout(doTimeOut, 10);
          }
        };

        yhUser.logout(function(){
          doTimeOut();
        });
      }]
    });
  }]);