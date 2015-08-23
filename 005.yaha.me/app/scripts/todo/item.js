'use strict';
angular.module('yh.todo')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('todo.item', {
      url: 'item/:id/',
      templateUrl: yh.path('todo/views/item.html'),
      controller: ['$scope', '$http', 'yh', 'ToDoAPI', '$location', '$stateParams', '__', 'yhModal', '$modal', '$state', '$timeout', 'yhUser', '$window',  function($scope, $http, yh, ToDoAPI, $location, $stateParams, __, yhModal, $modal, $state, $timeout, yhUser, $window){
        $scope.init = function(){
          var id = $stateParams.id;

          $scope.itemId = id;
          $scope.loaded = false;
          $scope.isEditAbled = false;          

          $scope.items = {};
          ToDoAPI.get( 'item', {id:id},function(data){
            if (data) {
              $scope.todoData = data;
              $scope.items = data.items; 

              $scope.loaded = true;
              if (data.createrId === yhUser.Uid()) {
                $scope.isEditAbled = true;
                $scope.hideComments = true;

                $scope.itemsChanged = false;            
                $scope.watchData();
                $scope.updateItems();
                $timeout(function(){
                  $scope.focusIndex = 0;
                  $scope.focusPosition = false;
                });
              }
            }
          });

          $scope.typeNameA = 'comment';
          $scope.typeNameThumbsUp = 'thumbsUp';
          $scope.typeNameThumbsDown = 'thumbsDown';
          
          ToDoAPI.get( 'listReply', {itemId:id, type:'comment'}, function(data){
            $scope.listA = data;
          });

          ToDoAPI.get( 'listReply', {itemId:id, type:'thumbsUp'}, function(data){
            $scope.thumbsUpList = data;
          });

          ToDoAPI.get( 'listReply', {itemId:id, type:'thumbsDown'}, function(data){
            $scope.thumbsDownList = data;
          });
        };

        $scope.onAdd = function(formData, cb) {
          formData.itemId = $scope.itemId;
          ToDoAPI.post( 'addReply', formData, cb);
        };
        $scope.onAddChild = function(formData, cb) {
          formData.itemId = $scope.itemId;
          ToDoAPI.post( 'addReply', formData, cb);
        };
        $scope.onGetChildren = function(formData, cb) {
          formData.itemId = $scope.itemId;
          ToDoAPI.get( 'listReply', formData, cb);
        };
        $scope.onThumbsUp = function(data, cb){
          ToDoAPI.post( 'thumbsUpReply', data, cb);
        };
        $scope.onThumbsDown = function(data, cb){
          ToDoAPI.post( 'thumbsDownReply', data, cb);
        };
        $scope.replyUserLink = function(id){
          return $state.href('todo.itemUser', {id: id});
        };

        $scope.timerModalForm = function(index){
          var modalInstance = $modal.open({
              backdrop: 'static',
              keyboard: false,
              templateUrl: yh.path('todo/views/item-timerModalForm.html'),
              controller: [ '$scope', '$modalInstance', function(scope, $modalInstance){
                scope.isTicking = false;
                scope.totalCountDownSecond = 0;
                scope.item = $scope.items[index];
                if (!scope.item.history) {
                  // scope.item.history = {
                  //   '2013-12-27' : {
                  //     summary: {
                  //       'success': 1,
                  //       'rest': 1,
                  //       'broken': 1
                  //     },
                  //     logs: [
                  //       {title: '^^v 终于又完成了一个番茄！', type:'success', totalSecond: 25 * 60, timeStartEnd: '13:30 - 13:55'},
                  //       {title: '└(^o^)┘ 休息，休息一下。', type:'rest', totalSecond: 25 * 60, timeStartEnd: '13:30 - 13:55'},
                  //       {title: '>o< 外星人进攻地球了！你说我能不停下来么！', type:'broken', totalSecond: 25 * 60, timeStartEnd: '13:30 - 13:55'}
                  //     ]
                  //   }
                  //   ,
                  //   '2013-12-28': {                      
                  //     summary: {
                  //       'success': 2,
                  //       'rest': 1,
                  //       'broken': 1
                  //     },
                  //     logs: [
                  //       {title: '^^v 终于又完成了一个番茄！', type:'success', totalSecond: 25 * 60, timeStartEnd: '13:30 - 13:55'},
                  //       {title: '└(^o^)┘ 休息，休息一下。', type:'rest', totalSecond: 25 * 60, timeStartEnd: '13:30 - 13:55'},
                  //       {title: '>o< 外星人进攻地球了！你说我能不停下来么！', type:'broken', totalSecond: 25 * 60, timeStartEnd: '13:30 - 13:55'}
                  //     ]
                  //   }
                  //  };
                   scope.item.history = {};
                }                
                   // scope.item.history = {};

                scope.fighting = function() {
                  scope.totalCountDownSecond = 25 * 60;
                  // scope.totalCountDownSecond = 3;
                  scope.tickingType = 'success';

                  $timeout(function(){
                    scope.$broadcast('timer-start');
                  });
                };
                scope.takeARest = function() {
                  scope.totalCountDownSecond = 5 * 60;
                  // scope.totalCountDownSecond = 1;
                  scope.tickingType = 'rest';
                  $timeout(function(){
                    scope.$broadcast('timer-start');
                  });
                };

                scope.broken = function() {
                  scope.$broadcast('timer-stop');
                };

                scope.$on('timer-start', function (event, args) {
                  scope.isTicking = true;
                  scope.timeStart = moment(new Date()).format('HH:mm:ss');
                  $window.onbeforeunload = function(){
                    return __('The ticking is working, if you leave the page, unsaved data will lost!');
                  };                  
                });

                scope.$on('timer-tick', function (event, args) {
                  $timeout(function(){
                    scope.progress = 100 * args.millis / 1000 / scope.totalCountDownSecond;
                  });
                });

                scope.$on('timer-stopped', function (event, args) {
                  var todayDate = moment(new Date()).format('YYYY-MM-DD');
                  var timeEnd = moment(new Date()).format('HH:mm:ss');
                  var timeStartEnd = scope.timeStart + ' - ' + timeEnd;
                  var countedSeconds = scope.totalCountDownSecond -  args.millis / 1000;
                  scope.finalTickingType = scope.tickingType;
                  if (args.millis !== 0) {
                    scope.finalTickingType = 'broken';
                  }
                  $timeout(function(){
                    scope.formData = {};
                    scope.formData.content = '';

                    scope.isTicking = false;
                    scope.isWaitForInput = true;
                    scope.progress = 0;
                  });
                  
                  scope.submit = function(){
                    scope.isWaitForInput = false;

                    // var title = '^^v 终于又完成了一个番茄！';
                    var title = scope.formData.content;

                    $timeout(function(){
                      if ( !scope.item.history[todayDate] ) {
                        scope.item.history[todayDate] = {
                          summary: {
                            'success': 0,
                            'rest': 0,
                            'broken': 0 
                          },
                          logs: []
                        };
                      }

                      scope.item.history[todayDate].summary[scope.finalTickingType]++;
                      var newLog = {title: title, type: scope.finalTickingType, countedSeconds: countedSeconds, timeStartEnd: timeStartEnd};
                      scope.item.history[todayDate].logs.unshift( newLog );
                      if (!scope.item.logCount) {
                        scope.item.logCount = 0;
                      }
                      scope.item.logCount++;
                      $window.onbeforeunload = null;
                    });
                  };
                });                
              }]
            });

          // modalInstance.result.then(function () {
          //   $window.onbeforeunload = null;
          // });
        };

        $scope.watchData = function(){
          $scope.$watch('todoData.title', function(newVal, oldVal){
            if (newVal === oldVal) {
              return;
            }

            $scope.itemsChanged = true;
          });

          $scope.$watch('items', function(newVal, oldVal){
            if (newVal === oldVal) {
              return;
            }
            
            $scope.itemsChanged = true;
          }, true);

        };

        $scope.updateItems = function(cb){
          
          if ($scope.itemsChanged) {
            var postData = {
              itemId: $scope.itemId,
              title: $scope.todoData.title,
              items: $scope.items
            };
            ToDoAPI.post( 'itemUpdate', postData,function(data){
              if (cb) {
                cb();
              }
            });
          }

          $scope.itemsChanged = false;
          $timeout($scope.updateItems, 5000);
        };

        $scope.goToParentList = function(id) {
          $scope.itemsChanged = true;
          $scope.updateItems(function(){
            $state.transitionTo( 'todo.item', {id: id} );
          });
        };

        $scope.goToChildList = function(index) {
          $scope.itemsChanged = true;
          $scope.updateItems(function(){
            if ($scope.items[index].childListId) {
              $state.transitionTo( 'todo.item', {id: $scope.items[index].childListId} );
            } else {
              var postData = {
                title: $scope.items[index].title,
                parentId: $scope.todoData.id,
                isPrivate: $scope.todoData.isPrivate || null,
                index: index
              };
              ToDoAPI.post( 'add', postData,function(data){
                if (data && data.id) {
                  $state.transitionTo( 'todo.item', {id: data.id} );
                }
              });
            }
          });
        };

        $scope.setFocus = function(index, position) {
          $scope.focusIndex = index;          
          if (position) {
            $scope.focusPosition = position;
          } else {
            $scope.focusPosition = false;
          }
        };

        $scope.isFocus = function(index) {
          if ($scope.focusIndex === index) {
            return true;
          }
          return false;
        };

        $scope.up = function($event, index) {          
          $event.preventDefault();
          if (index === 0) {
            return false;
          }          
          $scope.setFocus( index - 1 );
        };

        $scope.down = function($event, index) {
          $event.preventDefault();
          var max = $scope.items.length - 1;
          if (index === max) {
            return false;
          }
          $scope.setFocus( index + 1 );
        };

        $scope.enter = function($event, index) {
          var selection = window.getSelection();      
          var offset = selection.baseOffset;
          var originalTitle = $scope.items[index].title;
          var newTitle = originalTitle.substr(offset);        
          var updateTitle = originalTitle.substr(0, offset);
          var indent = $scope.items[index].indent;
          var newItem = {
                title: newTitle, 
                indent: indent, 
                createDate: (new Date()).valueOf()
              };

          $scope.items[index].title = updateTitle;
          $scope.items.splice(index+1, 0, newItem);
          $scope.setFocus( index+1 );
          $event.preventDefault();
        };

        $scope.shiftEnter = function($event, index) {
          $event.preventDefault();
        };

        $scope.backspaceItem = function($event, index) {
          var selection = window.getSelection();
          var offset = selection.baseOffset;        

          if (offset === 0 || $event.shiftKey) {
            var textAfterOffset = $scope.items[index].title;
            if ($event.shiftKey) {
              textAfterOffset = '';
            }

            var newIndex = ToDoAPI.deleteItem( $scope, index, textAfterOffset );
            var position = 0 - textAfterOffset.length;
            $scope.setFocus( newIndex, position );
          }
        };
        
        $scope.deleteItem = function($event, index) {
          var selection = window.getSelection();
          var offset = selection.baseOffset;  
          var title = $scope.items[index].title;
          if (offset !== title.length) {
            return;
          }

          if ( !$scope.items[index + 1] ) {
            return;
          }

          $scope.setFocus( index + 1 );
          $event.preventDefault();

          var textAfterOffset = $scope.items[index + 1].title;
          var position = title.length;          
          ToDoAPI.deleteItem( $scope, index + 1, textAfterOffset );
          $timeout(function(){
            $scope.setFocus( index, position );
          }, 200);
        };

        $scope.moveUp = function($event, index) {
          $event.preventDefault();
          if (index === 0) {
            return;
          }

          var newIndex = ToDoAPI.moveUp( $scope, index );          
          $scope.setFocus( newIndex );
        };

        $scope.moveDown = function($event, index) {
          $event.preventDefault();
          if ( (index + 1) === $scope.items.length) {
            return;
          }

          var newIndex = ToDoAPI.moveDown( $scope, index );          
          $scope.setFocus( newIndex );
        };

        $scope.indent = function($event, index) {
          $event.preventDefault();
          if (index === 0) {
            return;
          }
          var upOneIndent = $scope.items[index-1].indent;
          var thisIndent = $scope.items[index].indent;
          if (thisIndent > upOneIndent) {
            return false;
          }
          $scope.items[index].indent++;

          var max = $scope.items.length;
          for(var i=index+1; i < max; i++) {
            if($scope.items[i].indent <= thisIndent) {
              break;
            }
            $scope.items[i].indent++;
          }
        };

        $scope.unIndent = function($event, index) {
          $event.preventDefault();
          var thisIndent = $scope.items[index].indent;
          if (thisIndent <= 0) {
            return false;
          }
          $scope.items[index].indent--;

          var max = $scope.items.length;
          for(var i=index+1; i < max; i++) {
            if($scope.items[i].indent <= thisIndent) {
              break;
            }
            $scope.items[i].indent--;
          }
        };        

        $scope.init();
      }]
    });
  }]);