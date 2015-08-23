'use strict';
angular.module('yh.yaha')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('yaha.item', {
      url: 'item/:id/{path:.*}',
      templateUrl: yh.path('yaha/views/item.html'),
      controller: ['$scope', '$http', 'yh', 'yahaAPI', '$location', '$stateParams', '__', 'yhModal', '$modal', '$state', function($scope, $http, yh, yahaAPI, $location, $stateParams, __, yhModal, $modal, $state){

        $scope.init = function(){
          var id = $stateParams.id;
          $scope.itemId = id;
          $scope.typeNameA = 'comment';
          $scope.typeNameThumbsUp = 'thumbsUp';
          $scope.typeNameThumbsDown = 'thumbsDown';

          yahaAPI.get( 'item', {id:id},function(data){
            $scope.item = data;
          });

          yahaAPI.get( 'listReply', {itemId:id, type:'comment'}, function(data){
            $scope.listA = data;
          });

          yahaAPI.get( 'listReply', {itemId:id, type:'thumbsUp'}, function(data){
            $scope.thumbsUpList = data;
          });

          yahaAPI.get( 'listReply', {itemId:id, type:'thumbsDown'}, function(data){
            $scope.thumbsDownList = data;
          });
        };

        $scope.onAdd = function(formData, cb) {
          formData.itemId = $scope.itemId;
          yahaAPI.post( 'addReply', formData, cb);
        };
        $scope.onAddChild = function(formData, cb) {
          formData.itemId = $scope.itemId;
          yahaAPI.post( 'addReply', formData, cb);
        };
        $scope.onGetChildren = function(formData, cb) {
          formData.itemId = $scope.itemId;
          yahaAPI.get( 'listReply', formData, cb);
        };
        $scope.onThumbsUp = function(data, cb){
          yahaAPI.post( 'thumbsUpReply', data, cb);
        };
        $scope.onThumbsDown = function(data, cb){
          yahaAPI.post( 'thumbsDownReply', data, cb);
        };
        $scope.replyUserLink = function(id){
          return $state.href('yaha.itemUser', {id: id});
        };

        $scope.init();
      }]
    });
  }]);