'use strict';
angular.module('yh.user')
  .config(['$stateProvider', 'yh', function($stateProvider, yh) {
    $stateProvider.state('activeAccount', {
      url: '/activeAccount/:email/:activeKey/',
      access: 'anon',
      templateUrl: yh.path('user/views/activeAccount.html'),
      controller: ['$scope', '$state', 'yhAlert', 'yhUser', '__', '$stateParams', '$http', 'yhModal', '$timeout', function($scope,$state, yhAlert, yhUser, __, $stateParams, $http, yhModal, $timeout){
        $scope.email = $stateParams.email;
        $scope.activeKey = $stateParams.activeKey;

        $scope.submit = function(){
          $scope.alerts = [];
          var data = {
            email: $scope.email,
            activeKey: $scope.activeKey
          };
          $http.post( yh.api('user/activeAccount'), data )
            .success(function(result){
              yhModal( __('Success'), __('Active account success, please wait while auto login.') );
              yhUser.UpdateSid( result.sid );
              yhUser.GetFromServer(function(){
                $timeout(yhUser.restoreStateOrToHome, 1000);
              });
            })
            .error(function(result){
              var err = result.err;
              var msg = __('Unknown Error');
              var errHash = {
                'email_not_exist' : __("Email isn't register yet."),
                'activeKey_not_validate' : __("Active Key is not correct or expired already.")
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