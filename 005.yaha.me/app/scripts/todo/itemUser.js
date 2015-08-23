'use strict';
angular.module('yh.todo')
  .filter('theToDoTypeFilter', function() {
    return function( posts, typeFilter) {
      if (typeFilter === '') {
        return posts;
      }

      var filtered = [];
      angular.forEach(posts, function(post) {
        if (!post.status) {
          post.status = 'ToDo';
        }

        if(typeFilter === post.status) {
          filtered.push(post);
        }
      });
      return filtered;
    };
  })
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('todo.itemUser', {
      url: 'user/:id/',
      templateUrl: yh.path('todo/views/itemUser.html'),
      controller: ['$scope', '$http', 'yh', 'ToDoAPI', '$location', '$stateParams', '__', 'yhModal', '$modal', '$state', 'yhUser', '$timeout', function($scope, $http, yh, ToDoAPI, $location, $stateParams, __, yhModal, $modal, $state, yhUser, $timeout){

        $scope.init = function(){
          var id = $stateParams.id;
          $scope.uid = id;
          $scope.avatarUrl = yh.avatarUrl(id);
          $scope.publicListTypeFilter = '';
          $scope.privateListTypeFilter = 'ToDo';
          $scope.item = {};
          $scope.privateList = [];
          $scope.publicList = [];

          $scope.sid = yhUser.Sid();
          $scope.uploadActionUrl = yh.api( 'static/todoBanner' );
          $scope.photoUrl = yh.staticUrl( 'todoBanner/' + id );

          $timeout(function(){
            $('.imgLiquid').imgLiquid({fill:true});            
          });
          $scope.updatePhoto = function(){
            $scope.photoUrl = yh.staticUrl( 'todoBanner/' + id + '?rand=' + Math.random() );
            $scope.$apply();
            $timeout(function(){
              $('.imgLiquid').imgLiquid({fill:true});
            });
          };

          $scope.notSetupYet = __('Not Setup Yet');

          $scope.currentShowEducationAndWorkExperienceId = null;
          $scope.currentShowProjectExperienceId = null;

          $scope.isEditAbled = (id === yhUser.Uid());
         
          ToDoAPI.get( 'itemUser', {id:id},function(data){            
            if (data === null) {
              ToDoAPI.get( 'itemUserAdd', {id:id}, function(data){
                $scope.setupItemData(data);
              });
              return;
            }
            $scope.setupItemData(data);            
          });

          if ($scope.isEditAbled) {
            ToDoAPI.get( 'list', {isPrivate: true }, function(data){
              $scope.privateList = data;
            });
          }
          ToDoAPI.get( 'list', {createrId: id}, function(data){
            $scope.publicList = data;
          });

        };        

        $scope.updateStatus = function(post, status) {
          var postData = {
            itemId: post.id,
            status: status
          };
          post.status = status;
          ToDoAPI.post( 'itemUpdate', postData, function(data){
            
          });

          return status;
        };

        $scope.isEmpty = function(data) {
          if (!data) {
            return __('Should not empty!');
          }
        };

        $scope.setupItemData = function(data){
          $scope.item = data;

          if ($scope.isEditAbled) {
            $scope.watchItemData();
          }

          $timeout(function(){
            $scope.height = $('.imgLiquid').height() 
                            + parseInt( $('.imgLiquid').css('padding-top') , 10)
                            + parseInt( $('.imgLiquid').css('padding-bottom'), 10)
                          ;
          });
        };
        $scope.watchItemData = function(){
          $scope.$watch('item', function(newItem, oldItem) {
              angular.forEach( newItem, function( value, key ) {
                if ( !angular.equals( oldItem[key], value) ){
                  var args = {
                    type: key,
                    value: value
                  };
                  ToDoAPI.post( 'itemUserUpdate', args, function(){});
                }
              });
            }, true);  
        };

        $scope.init();
      }]
    });
  }]);