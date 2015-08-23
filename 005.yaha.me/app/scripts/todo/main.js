'use strict';
angular.module('yh.todo', ['ui.router', 'yh'])
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    yh.langList.push('todo');
    
    $stateProvider.state('todo', {
        url: '/',
        abstract: true,
        templateUrl: yh.path('todo/views/main.html'),
        controller: [ '$stateParams', '$state', '$modal', '$scope', 'ToDoAPI', '$timeout', '__',function($stateParams, $state, $modal, $scope, ToDoAPI, $timeout, __) {
          $scope.showAddModalForm = function(isPrivate){
            var modalInstance = $modal.open({
                  backdrop: 'static',
                  keyboard: false,
                  templateUrl: yh.path('todo/views/itemUser-addForm.html'),
                  controller: [ '$scope', '$modalInstance', function(scope, $modalInstance){
                    scope.formData = {};
                    if (isPrivate) {
                      scope.formData.isPrivate = true;
                    }
                    scope.submitResult = false;
                    scope.submit = function(){
                      var formData = scope.formData;
                      scope.isPosting = true;
                      ToDoAPI.post( 'add', formData, function(data){
                        if (!data.id) {
                          scope.isPosting = false;
                          scope.submitResult = 'error';
                          if (data.status === 'can_add_private_count_not_enough') {
                            scope.errorMsg = __('Your Private Items Count already exceed');
                          } else {
                            scope.errorMsg = __('Unknown Error');
                          }
                          return;
                        }
                        scope.formData = {};
                        scope.isPosting = false;
                        scope.submitResult = 'success';
                        $timeout(function(){
                          modalInstance.close();
                          $state.transitionTo( 'todo.item', {id: data.id} );
                        }, 1000);
                      });
                    };
                  }]
                });
          };
        }]
      })
      .state('todo.home', {
        url: '',
        controller: ['$state', 'yhCache', 'yhUser', function($state, yhCache, yhUser){
          var isReturnUser = yhCache.get('_isReturnUser') || false;
          if (isReturnUser || yhUser.isLoggedIn()) {
            $state.transitionTo( 'todo.list' );
          } else {
            yhCache.put('_isReturnUser', true);
            $state.transitionTo('about');
          }
        }]
      })
      .state('todo.my', {
        url: 'my/',
        access: 'user',
        controller: ['$state', 'yhUser', function($state, yhUser){
          $state.transitionTo( 'todo.itemUser', {id: yhUser.Uid()} );
        }]
      })
      .state('about',{
        url: '/about/',
        templateUrl: yh.path('todo/views/about.html')
      })
    ;
  }])
  .factory('ToDoAPI', ['YhAPI', function(YhAPI){
    function getItemLength(items, index) {
      if (items[index] === undefined) {
        return 0;
      }

      var max = items.length;
      var childrenLength = 0;
      var itemIndent = items[index].indent;
      for (var i = index+1; i < max; i++) {
        if (items[i].indent <= itemIndent) {
          break;
        }
        childrenLength++;
      }
      return childrenLength + 1;
    }

    var ToDoAPI = function(){};
    ToDoAPI.prototype = new YhAPI('todo_v1');

    ToDoAPI.prototype.moveUp = function($scope, index) {
      var items = $scope.items;

      var itemIndent = items[index].indent;
      for (var i = index - 1; i >= 0; i-- ) {
        if (items[i].indent <= itemIndent) {
          break;
        }
      }
      var thatIndex = i;

      var itemLength = getItemLength(items, index );
      var thatLength = getItemLength(items, thatIndex);

      //moving out
      var theItems = items.splice( index, itemLength );
      if (items[thatIndex].indent < itemIndent) {
        var indentReduce = itemIndent - items[thatIndex].indent; 
        angular.forEach( theItems, function(v, k){
          theItems[k].indent = v.indent - indentReduce;
        });
      }
      
      var thatItems = items.splice( thatIndex, thatLength );
      var lastItems = items.splice( thatIndex, items.length - thatIndex );

      //merge in
      $scope.items = items.concat( theItems, thatItems, lastItems );

      var newIndex = thatIndex;
      return newIndex;
    };

    ToDoAPI.prototype.moveDown = function($scope, index) {
      var items = $scope.items;
      var itemLength = getItemLength(items, index );
      var thatLength = getItemLength(items, index + itemLength );

      //moving out
      var thatItems = items.splice( index + itemLength, thatLength );
      var theItems = items.splice( index, itemLength );
      var lastItems = items.splice( index, items.length - index );

      //merge in
      $scope.items = items.concat( thatItems, theItems, lastItems );

      var newIndex = index + thatLength;
      return newIndex;
    };

    ToDoAPI.prototype.deleteItem = function($scope, index, textAfterOffset) {
      if ($scope.items.length === 1) {
        if (textAfterOffset.length === 0) {
          $scope.items[0].title = '';
        }
        return index;
      }

      if ($scope.items[index].childListId) {
        $scope.items[index].title = textAfterOffset;
        if (index === 0) {
          return index;
        } else {
          return index - 1;
        }
      }

      var items = $scope.items;
      var newIndex = index - 1;
      var thatIndent;
      if (index === 0) {
        thatIndent = -1;
        newIndex = 0;
      } else {
        items[index - 1].title = items[index - 1].title + textAfterOffset;
        thatIndent = items[index - 1].indent;
      }

      var theItem = items[index];
      var indentChange = thatIndent - theItem.indent;
      var itemLength = getItemLength(items, index );

      items.splice( index, 1 );
      if (itemLength > 1 && indentChange !== 0) {
        var max = index + itemLength - 1;
        for (var i = index; i < max; i++) {
          items[i].indent = items[i].indent + indentChange;
        }
      }
      $scope.items = items;
      
      return newIndex;
    };

    return new ToDoAPI();
  }])
;
