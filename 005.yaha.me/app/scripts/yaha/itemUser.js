'use strict';
angular.module('yh.yaha')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('yaha.itemUser', {
      url: 'user/:id/',
      templateUrl: yh.path('yaha/views/itemUser.html'),
      controller: ['$scope', '$http', 'yh', 'yahaAPI', '$location', '$stateParams', '__', 'yhModal', '$modal', '$state', 'yhUser', '$timeout', function($scope, $http, yh, yahaAPI, $location, $stateParams, __, yhModal, $modal, $state, yhUser, $timeout){

        $scope.init = function(){
          var id = $stateParams.id;
          $scope.item = {};
          $scope.postList = [];

          $scope.sid = yhUser.Sid();
          $scope.uploadActionUrl = yh.api( 'static/yahaBanner' );
          $scope.photoUrl = yh.staticUrl( 'yahaBanner/' + id );

          $timeout(function(){
            $('.imgLiquid').imgLiquid({fill:true});            
          });
          $scope.updatePhoto = function(){
            $scope.photoUrl = yh.staticUrl( 'yahaBanner/' + id + '?rand=' + Math.random() );
            $scope.$apply();
            $timeout(function(){
              $('.imgLiquid').imgLiquid({fill:true});
            });
          };

          $scope.notSetupYet = __('Not Setup Yet');

          $scope.currentShowEducationAndWorkExperienceId = null;
          $scope.currentShowProjectExperienceId = null;

          $scope.isEditAbled = (id === yhUser.Uid());
         
          yahaAPI.get( 'itemUser', {id:id},function(data){            
            if (data === null) {
              yahaAPI.get( 'itemUserAdd', {id:id}, function(data){
                $scope.setupItemData(data);
              });
              return;
            }
            $scope.setupItemData(data);            
          });

          yahaAPI.get( 'list', {createrId: id}, function(data){
            $scope.postList = data;
          });

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
                  yahaAPI.post( 'itemUserUpdate', args, function(){});
                }
              });
            }, true);  
        };
        
        $scope.init();
      }]
    });
  }]);