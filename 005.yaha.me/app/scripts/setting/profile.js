'use strict';
angular.module('yh.setting')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('setting.profile', {
      url: '/profile',
      access: 'user',
      templateUrl: yh.path('setting/views/profile.html'),
      controller: ['$scope', 'yhUser', '__', '$timeout', function($scope, yhUser, __, $timeout){
        $scope.formData = yhUser.getMe();

        // $scope.formData = {
        //   city: '厦门',
        //   website: 'http://yaha.me/',
        //   slogan: 'Ironman do not have a heart',
        //   bio: 'JavaScript Ninja(AngularJS, Node.js), Geek of many things, Hockey, Guitar'
        // };

        $scope.sid = yhUser.Sid();
        $scope.avatarUrl = yh.staticUrl( 'avatar/' + yhUser.Uid() );
        $scope.uploadActionUrl = yh.api( 'static/avatar' );

        $scope.updateAvatar = function(){
          $scope.avatarUrl = yh.staticUrl( 'avatar/' +  yhUser.Uid() + '?rand=' + Math.random() );
          $scope.$digest();
        };

        $scope.submit = function(){
          yhUser.update($scope.formData);
        };
      }]
    });
  }])
  ;