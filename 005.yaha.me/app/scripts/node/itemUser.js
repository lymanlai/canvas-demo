'use strict';
angular.module('yh.node')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('node.itemUser', {
      url: '/user/:id/',
      templateUrl: yh.path('node/views/itemUser.html'),
      controller: ['$scope', '$http', 'yh', 'yhJobs', '$location', '$stateParams', '__', 'yhModal', '$modal', '$state', 'yhUser', '$timeout', function($scope, $http, yh, yhJobs, $location, $stateParams, __, yhModal, $modal, $state, yhUser, $timeout){

        $scope.init = function(){
          var id = $stateParams.id;
          $scope.item = {};
          $scope.recruitmentList = [];

          var bannerPath = 'jobsBanner/' + id;
          $scope.sid = yhUser.Sid();
          $scope.uploadActionUrl = yh.api( 'static/jobsBanner' );
          $scope.photoUrl = yh.staticUrl( bannerPath );

          $timeout(function(){
            $('.imgLiquid').imgLiquid({fill:true});
          });
          $scope.updatePhoto = function(){
            $scope.photoUrl = yh.staticUrl( bannerPath + '?rand=' + Math.random() );
            $scope.$apply();
            $timeout(function(){
              $('.imgLiquid').imgLiquid({fill:true});
            });
          };

          $scope.tpl = {
            skill: {
              skillName: __('Skill Name'),
              startUseTime: 2020,
              skillLevel: 5
            },
            educationAndWorkExperience: {
              title: __('Title'),
              timeSpan: __('Time Span'),
              detail: __('Detail')
            },
            projectExperience: {
              title: __('Title'),
              timeSpan: __('Time Span'),
              detail: __('Detail')
            }
          };
          $scope.notSetupYet = __('Not Setup Yet');

          $scope.currentShowEducationAndWorkExperienceId = null;
          $scope.currentShowProjectExperienceId = null;

          $scope.isEditAbled = (id === yhUser.Uid());
          $scope.rate = 5;
          $scope.max = 10;

          yhJobs.itemUser({id:id},function(data){
            if (data === null) {
              yhJobs.itemUserAdd({id:id}, function(data){
                $scope.setupItemData(data);
              });
              return;
            }
            $scope.setupItemData(data);            
          });

          yhJobs.listByCreaterId( id, function(data){
            $scope.recruitmentList = data;
          });

        };        

        $scope.setupItemData = function(data){
          $scope.item = data;

          if ($scope.isEditAbled) {
            $scope.watchItemData();
          }  
        };
        $scope.watchItemData = function(){
          $scope.$watch('item', function(newItem, oldItem) {
              angular.forEach( newItem, function( value, key ) {
                if ( !angular.equals( oldItem[key], value) ){
                  var args = {
                    type: key,
                    value: value
                  };
                  yhJobs.itemUserUpdate(args, function(){});
                }
              });
            }, true);  
        };
        $scope.trashRecruitment = function(item, index) {
          var args = {
            id: item.id
          };
          yhJobs.itemTrash(args, function(){
            $scope.recruitmentList.splice(index, 1);
          });
        };

        $scope.deleteFromArray = function(arr, index) {
          arr.splice(index, 1);
        };

        $scope.toggleShowEducationAndWorkExperience = function(id){
          if ($scope.currentShowEducationAndWorkExperienceId === id) {
            id = null;
          }
          $scope.currentShowEducationAndWorkExperienceId = id;          
        };
        
        $scope.toggleShowProjectExperience = function(id){
          if ($scope.currentShowProjectExperienceId === id) {
            id = null;
          }
          $scope.currentShowProjectExperienceId = id;          
        };

        $scope.listAdd = function(type, value) {
          var newValue = Object.create( value );
          $scope.item[type].push( newValue );
        };

        $scope.init();
      }]
    });
  }]);