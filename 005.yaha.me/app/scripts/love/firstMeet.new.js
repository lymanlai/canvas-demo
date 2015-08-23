'use strict';
angular.module('yh.love')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('love.firstMeet', {
      url: '/firstMeet',
      access: 'user',
      templateUrl: yh.path('love/views/firstMeet.html'),
      controller: ['$scope', '$http', 'yh', 'yhFirstMeet', 'yhUser', '__', function($scope, $http, yh, yhFirstMeet, yhUser, __){        

        $scope.init = function(){
          
          $scope.cityList = [
            '厦门',
            '泉州',          
            '福州',
            '莆田',
            '仙游'
          ];
          $scope.dayList = [
           {key:'today', label: __('Today')},
           {key:'tomorrow', label: __('Tomorrow')}
          ];

          $scope.timeList = [
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30'
          ];

          $scope.firstMeet = yhFirstMeet.getFirstMeetQueryInfo();

          if ($scope.firstMeet.city) {
            yhFirstMeet.updateStationList($scope.firstMeet.city, function(stationList){
              $scope.stationList = stationList;
            });
            $scope.queryFirstMeetItem();
          }
        };

       
        // every ctrl should have a init() function
        $scope.init();
      }]
    });
  }]);