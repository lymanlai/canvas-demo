'use strict';
angular.module('yh.todo')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('todo.list', {
      url: 'list/',
      templateUrl: yh.path('todo/views/list.html'),
      controller: ['$scope', '$http', 'yh', 'ToDoAPI', '$location', '$timeout', '$modal', '__',
      function(    $scope, $http, yh, ToDoAPI, $location, $timeout, $modal, __){        
        $scope.init = function(){

          ToDoAPI.get( 'list', {}, function(data){
            $scope.loaded = true;
            $scope.items = data;
          });
        };
        
        $scope.init();
      }]
    });
  }]);