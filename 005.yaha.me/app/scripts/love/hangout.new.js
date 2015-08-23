'use strict';
angular.module('yh.love')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('love.hangout.new', {
      url: '/new',
      access: 'user',
      views: {
        '@love': {
          templateUrl: yh.path('love/views/hangout.new.html'),
          controller: ['$scope', '$http', 'yh', 'yhHangout', '__', 'yhModal', '$state', '$timeout', function($scope, $http, yh, yhHangout, __, yhModal, $state, $timeout){
            $scope.formData = {};

            // $scope.formData.title = 'Meet @wanda for chat';
            // $scope.formData.hangoutDate = '2013-10-23';
            // $scope.formData.hangoutStartTime = '18:00';

            $scope.submit = function(){
              $scope.formData.location = yhHangout.getLocation();
              $http.post(yh.api('love/newHangout'), $scope.formData)
                .success(function () {
                  yhModal(__("Success"), __("Add hangout success"));
                  $timeout(function(){
                    $state.transitionTo('love.hangout');
                  }, 2000);
                })
                .error(function () {
                  yhModal(__("Error"), __("Add hangout error"));
                });
            };
          }]
        }
      }      
    });
  }]);