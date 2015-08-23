'use strict';
angular.module('yh.love')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    //hangout item's node system
    $stateProvider.state('love.hangout.item', {
      url: '/:hangoutId', // love/hangout/:hangoutId
      views: {
        '@love':{
          templateUrl: yh.path('love/views/hangout.item.html'),
          controller: ['$scope', '$http', 'yh', 'yhCache', '$stateParams', 'yhUser', '__', 'yhModal', '$timeout', function($scope, $http, yh, yhCache, $stateParams, yhUser, __, yhModal, $timeout){

            $scope.step = 1;
            $scope.showGenderSetup = false;
            $scope.alreadyJoin = {};

            var query = {
              id: $stateParams.hangoutId
            };
            $http.get( yh.api( 'love/getHangout', query ) )
              .success(function(result){
                var data = result.data;
                var userData = yhUser.getMe();

                $scope.data = data;
                $scope.male = {count: data.alreadyJoinCount.male, str: ""};
                $scope.female = {count: data.alreadyJoinCount.female, str: ""};

                var gender = 'male';
                var id = '';
                for (id in data.alreadyJoin) {
                  gender = data.alreadyJoin[id]['gender'];
                  $scope[ gender ]['str'] += peopleImg(id);
                  if (id === userData.id) {
                    $scope.step = data.alreadyJoin[id]['step'];
                  }
                }
              });

            //step 1
            function peopleImg(id){
              return '<img src="' + yh.avatarUrl(id) + '" class="avatar" />';
            }

            $scope.joinHangout = function(){
              var userData = yhUser.getMe();
              if (!userData.gender) {
                //show gender input form
                $scope.showGenderSetup = true;
                yhModal(__("Error"), __("You need to setup your gender first"));
                return;
              }

              $http.post(yh.api('love/joinHangout'), {id: $scope.data.id})
                .success(function () {
                  var userData = yhUser.getMe();
                  yhModal(__("Success"), __("Join hangout success"));
                  $scope.step = 2;
                  $scope[userData.gender]['str'] += peopleImg(userData.id);
                  $scope[userData.gender]['count'] += 1;
                })
                .error(function () {
                  yhModal(__("Error"), __("Join hangout error"));
                });
            };

            $scope.setupGender = function(gender){
              var data = {
                gender: gender
              };

              yhUser.update(data, function(err){
                if (err) {
                  yhModal(__("Error"), __("Setup gender error"));
                } else {
                  yhModal(__("Success"), __("Setup gender success"));
                  $scope.showGenderSetup = false;
                }
              });
            };

            //step 2
            $scope.enjoyHangout = function(){
              yhModal(__("Notice"), __("Remember that you need to take a Hangout Photo Before go back home.(Include all other members except you)"));
              $timeout(function(){
                yhModal(__("Notice"), __("Now you should go to the hangout, and enjoy it!"));
              }, 50);
            };

            //step 3
            $scope.uploadUrl = API + 'love/hangoutPhoto?id=' + $stateParams.hangoutId;
            $scope.sid = yhUser.Sid();
            $scope.uploadComplete = function(){
              $scope.$apply(function(){
                yhModal(__("Success"), __("Success upload hangout photo, now you can make some comment for the hangout!"));
                $scope.step = 4;
                queryHangoutComment();
              });
            };

            //step 4
            function queryHangoutComment(){
              var query = {
                id: $stateParams.hangoutId
              };
              $http.get( yh.api( 'love/getHangoutComment', query ) )
                .success(function(data){
                  $scope.hangoutCommentList = data;                
                });
            }
            queryHangoutComment();
            
            $scope.addHangoutComment = function(){
              $scope.formData.id = $stateParams.hangoutId;
              $http.post(yh.api('love/addHangoutComment'), $scope.formData)
                .success(function () {
                  yhModal(__("Success"), __("Add hangout comment success"));
                  $scope.step = 5;
                  $scope.formData.title = '';
                })
                .error(function () {
                  yhModal(__("Error"), __("Add hangout comment error"));
                });
            };

            //step 5
            $scope.rate = {};

            $scope.submitRating = function(){
              var data = {
                id: $stateParams.hangoutId,
                rate: $scope.rate
              };

              $http.post(yh.api('love/addHangoutPeopleRating'), data)
                .success(function () {
                  yhModal(__("Success"), __("Add hangout rating success"));
                  $scope.step = 6;
                })
                .error(function () {
                  yhModal(__("Error"), __("Add hangout rating error"));
                });
            };
          }]
        }
      }
    });
  }]);