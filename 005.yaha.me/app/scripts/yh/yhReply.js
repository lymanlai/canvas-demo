angular.module('yh')
  //<yh-reply item-list="questionList" on-get-children="onGetChildren" on-add="onAddMetaNode" on-add-child="onAddChild" on-thumbs-up="onThumbsUp" on-thumbs-down="onThumbsDown"/>
  // itemList: first level item list
  // onGetChildren: get children node function
  // onAdd: add first level item function
  // onAddChild: add reply function
  // onThumbsUp: thumbsUp function
  // onThumbsDown: thunbsDown function
  .directive('yhReply', ['$modal', 'yh', 'yhUser', 'yhModal', '__', function($modal, yh, yhUser, yhModal, __) {
    return {
      restrict: 'E',
      scope: {
        itemList: '=',
        onAdd: '=',
        type: '=',
        replyUserLink: '=',
        onGetChildren: '=',
        onAddChild: '=',
        onThumbsUp: '=',
        onThumbsDown: '='
      },
      replace: true,
      templateUrl: yh.path('yh/yhReply.html'),
      link: function($scope, element, attrs) {
        $scope.userId = yhUser.Uid();
        $scope.yh = yh;
        $scope.formData = {};

        $scope.add = function(){
          var formData = $scope.formData;
          formData.type = $scope.type;
          $scope.onAdd(formData, function(data){
            if(data) {
              if (!angular.isArray($scope.itemList)) {
                $scope.itemList = [];
              }

              $scope.itemList.unshift( data );
              yhModal(__("Success"), __("Add Success!"));
              $scope.form.$setPristine();
              $scope.formData.content = '';
            } else {
              yhModal(__("Unknown Error"), __("Add Error! Please send us feedback"));
            }
          });
        };

      }
    };
  }])
  .directive('yhReplyMeta', ['$compile', 'yh', '$modal', '__', function($compile, yh, $modal, __) {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        type: '=',
        replyUserLink: '=',
        onGetChildren: '=',
        onAddChild: '=',
        onThumbsUp: '=',
        onThumbsDown: '='
      },
      replace: true,
      templateUrl: yh.path('yh/yhReplyMeta.html'),
      link: function($scope, element, attrs) {
        $scope.showChildren = function(item) {
          if (item.children) {
            item.childrenShow = true;
            return;
          }

          var formData = {
            parentId: item.id,
            type: $scope.type
          };
          $scope.onGetChildren(formData, function(data){
            item.childrenShow = true;
            item.children = data;
            item.childCount = data.length;
            var el = $compile( '<yh-reply-children-list item="item" reply-user-link="replyUserLink" on-get-children="onGetChildren" on-add-child="onAddChild" ng-if="item.children" on-thumbs-up="onThumbsUp" on-thumbs-down="onThumbsDown" type="type"></yh-reply-children-list>' )( $scope );
            element.parent().append( el );
          });
        };

        $scope.showReplyForm = function(item){
          var modalInstance = $modal.open({
              templateUrl: yh.path('yh/yhReplyForm.html'),
              controller: [ '$scope', '$modalInstance', '$timeout', function(scope, $modalInstance, $timeout){
                scope.title = __('Reply') + ' ' + item.content;
                scope.formData = {};
                scope.submit = function(){
                  var formData = scope.formData;
                  formData.parentId = item.id;
                  formData.type = $scope.type;
                  $scope.onAddChild(formData, function(data){
                    if (item.children) {
                      item.childCount++;
                      item.children.unshift( data );
                      item.childrenShow = true;
                    } else {
                      $scope.showChildren(item);
                    }
                    $timeout(function(){
                      modalInstance.close();
                      scope.formData = {};
                    }, 1000);
                  });                  
                };
              }]
            });
        };  
      }
    };
  }])  
  .directive('yhReplyChildrenList', ['$timeout', 'yh', function($timeout, yh) {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        type: '=',
        replyUserLink: '=',
        onGetChildren: '=',
        onAddChild: '=',
        onThumbsUp: '=',
        onThumbsDown: '='
      },
      replace: true,
      templateUrl: yh.path('yh/yhReplyChildrenList.html'),
      link: function($scope, element, attrs) {        
        $scope.yh = yh;
      }
    };
  }])
  .directive('yhReplyThumbsUpDown', ['$timeout', 'yh', function($timeout, yh) {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        type: '=',
        onThumbsUp: '=',
        onThumbsDown: '='
      },
      replace: true,
      templateUrl: yh.path('yh/yhReplyThumbsUpDown.html'),
      link: function($scope, element, attrs) {
        $scope.yh = yh;
        $scope.thumbsUp = function(item) {
          var formData = {
            id: item.id
          };
          $scope.onThumbsUp(formData, function(data){
            $scope.item = data;
          });
        };
        $scope.thumbsDown = function(item){
          var formData = {
            id: item.id
          };
          $scope.onThumbsDown(formData, function(data){
            $scope.item = data;
          });
        };
      }
    };
  }])
;