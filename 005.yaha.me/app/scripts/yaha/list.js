'use strict';
angular.module('yh.yaha')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('yaha.list', {
      url: 'list/',
      templateUrl: yh.path('yaha/views/list.html'),
      controller: ['$scope', '$http', 'yh', 'yahaAPI', '$location', '$timeout', '$modal', '__',
      function(    $scope, $http, yh, yahaAPI, $location, $timeout, $modal, __){

        $scope.init = function(){
          // $scope.items = [];

          $scope.list();
        };

        $scope.list = function(){
          yahaAPI.get( 'list', function(items){
            $scope.loaded = true;
            $scope.items = items;
          });
        };

        $scope.toggleShow = function(id){
          if ($scope.currentShowId === id) {
            id = null;
          }
          $scope.currentShowId = id;
          $timeout(function(){
            if (id !== null) {
              var offsetTop = $('#item-'+id).offset().top;
              $('html,body').stop().animate({scrollTop: offsetTop}, 500);
            }
          });
        };

        $scope.showModalForm = function(type, item){
          var titleHash = {
            'comment': __('Comment to %s', item.title),
            'thumbsUp': __('Thumbs Up for %s', item.title),
            'thumbsDown': __('Thumbs Down for %s', item.title)
          };
          var title = titleHash[type];

          var modalInstance = $modal.open({
              templateUrl: yh.path('yaha/views/list-modalForm.html'),
              controller: [ '$scope', '$modalInstance', function(scope, $modalInstance){
                scope.title = title;
                scope.formData = {};
                scope.submitResult = false;
                scope.submit = function(){
                  var formData = scope.formData;
                  formData.itemId = item.id;
                  formData.type = type;
                  yahaAPI.post( 'addReply', formData, function(data){
                    item[ type + 'Count' ]++;
                    scope.formData = {};
                    scope.submitResult = 'success';
                    $timeout(function(){
                      modalInstance.close();
                    }, 1000);
                  });
                };
              }]
            });
        };

        $scope.init();
      }]
    });
  }]);