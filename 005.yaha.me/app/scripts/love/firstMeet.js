'use strict';
angular.module('yh.love')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('love.firstMeet', {
      url: '/firstMeet',
      access: 'user',
      templateUrl: yh.path('love/views/firstMeet.html'),
      controller: ['$scope', '$http', 'yh', 'yhFirstMeet', 'yhUser', '__', 'yhModal', function($scope, $http, yh, yhFirstMeet, yhUser, __, yhModal){        

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

          $scope.finishedStep = 1;
          $scope.sid = yhUser.Sid();            
          $scope.uid = yhUser.Uid();         
        };

        $scope.uploadComplete = function(){
          yhModal(__("Success"), __("Success upload photo!"));
          $scope.finishedStep = 4;
        };

        $scope.showStep = function( step ){
          if ( $scope.finishedStep < step ) {
            return true;
          }
          return false;
        };

        $scope.completeStep = function( step ){   
          var args = {
            id: $scope.firstMeetItem.id,
            step: step
          }; 
          yhFirstMeet.completeStep( args, function(){
            $scope.finishedStep = step;
          });
        };

        $scope.joinFirstMeet = function(id){
          yhFirstMeet.join(id, function(result){
            switch(result.err) {
              case 'user_do_not_have_first_meet_ticket':
                $scope.ticketEmpty = true;
                break;
              default:
                $scope.alreadyJoin = true;
                break;
            }
          });
        };

        $scope.update = function(type, value){          
          yhFirstMeet.updateUserInfo(type, value);
          $scope.firstMeet[type] = value;
          $scope.queryFirstMeetItem();
        };

        $scope.queryFirstMeetItem = function( index ){          
          if (index === 0) {
            $scope.pagerError = 'alreadyFirst';
            return;
          }

          $scope.firstMeetItemIndex = index;
          if (index === undefined) {
            $scope.firstMeetItemIndex = 1;
          }

          var day = $scope.firstMeet.day ? $scope.firstMeet.day.key : '';
          var query = {
            city: $scope.firstMeet.city,
            day: day,
            time: $scope.firstMeet.time,
            station: $scope.firstMeet.station,
            index: $scope.firstMeetItemIndex
          };        

          yhFirstMeet.getFirstMeetItem(query, function(item){
            $scope.ticketEmpty = false;

            if (item.length === 0) {
              $scope.pagerError = 'noMore';              
              $scope.firstMeetItemIndex -= 1;
              if (index === undefined) {
                $scope.firstMeetItemZero = true;
                $scope.firstMeetItem = false;
                $scope.query = query;
              }
              return;
            }

            if (item.members[ yhUser.Uid() ]) {
              $scope.alreadyJoin = true;
              $scope.yourCode = 'M1'; //todo: make the code?
              $scope.takePhotoOf = 'F5'; //todo: make the take photo of?
              if (item.members[ yhUser.Uid() ]['step']) {
                $scope.finishedStep = parseInt( item.members[ yhUser.Uid() ]['step'], 10 );
              }
              $scope.uploadUrl = API + 'love/firstMeetPhoto?id=' + item.id;
            } else {
              $scope.alreadyJoin = false;
            }
            $scope.pagerError = false;
            $scope.firstMeetItemZero = false;
            $scope.firstMeetItem = item;
          });
        };

        $scope.updateCity = function(value){
          yhFirstMeet.updateStationList(value, function(stationList){
            $scope.stationList = stationList;
          });
          yhFirstMeet.updateUserInfo('station','');
          yhFirstMeet.updateUserInfo('day', '');
          yhFirstMeet.updateUserInfo('time', '');
          $scope.firstMeet = {};
          $scope.update('city', value);
        };

        $scope.showAddStationForm = function(){
          console.log('zzzz');
        };

        // every ctrl should have a init() function
        $scope.init();
      }]
    });
  }]);