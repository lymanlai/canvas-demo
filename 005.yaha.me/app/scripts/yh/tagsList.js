//inspired by https://github.com/lymanlai/angularjs-input-tags
angular.module('yh')
  .directive('tagsList', ['$timeout', 'yh', function($timeout, yh) {
    return {
      restrict: 'A',
      scope: {
        tagsList: '=',
        placeholder: '@',
        ngModel: '='
      },
      replace: true,
      templateUrl: yh.path('yh/tagsList.html'),
      link: function($scope, element, attrs) { 
        if (!$scope.placeholder) {
          $scope.placeholder = '';
        }
        
        $scope.filterTagsList = function(){
          var ngModel = $scope.ngModel || [];
          if ( !$scope.tagsList || $scope.tagsList.length === 0) {
            $scope.filteredTagsList = [];
            return;
          }
          $scope.filteredTagsList = $scope.tagsList.filter(function(value){
            return ngModel.indexOf(value) === -1;
          });
        };

        $scope.$watch('tagsList', $scope.filterTagsList, true);
        $scope.$watch('ngModel', $scope.filterTagsList, true);

        $scope.focus = function(){
          $timeout(function(){
            element.find('input')[0].click();
            element.find('input')[0].focus();
          });
        };

        $scope.selectTag = function(tag){
          $scope.newTag = tag;
          $scope.addTag();
        };

        $scope.addTag = function(){
          var ngModel = $scope.ngModel || [];
          $scope.newTag = $scope.newTag.replace(/^\s+|\s+$/g,'');
          $scope.newTag = $scope.newTag.replace(',','');

          var canBeAdd = (  $scope.newTag !== '' //not empty
                            && (ngModel.indexOf( $scope.newTag ) === -1) //not exist yet
                          );          
          if (canBeAdd) {
            ngModel.push( $scope.newTag );
          }
          $scope.newTag = '';
          $scope.setupInputWidth();
          $scope.ngModel = ngModel;
        };

        $scope.deleteTag = function( key ){
          var ngModel = $scope.ngModel || [];
          if (ngModel.length < 1) {
            return;
          }

          if (key === undefined) {
            key = ngModel.length - 1;
          }
          ngModel.splice(key, 1);
          if (ngModel.length < 1) {
            ngModel = '';
          }
          $scope.ngModel = ngModel;
        };

        $scope.setupInputWidth = function(){
          var length = $scope.placeholder.length;
          if ($scope.newTag) {
            length = $scope.newTag.length;
          }
          $scope.width = (length + 4) * 10;
        };
        $scope.setupInputWidth();
        element.bind('keyup', function(){
          $scope.$apply(function(){
            $scope.setupInputWidth();
          });
        });
          
        element.bind('keydown', function(e) {
          if (e.which === 8 && $scope.newTag === '' ) {//Backspace Key
            $scope.deleteTag();
          }
        });
        
        element.bind('keypress', function(e) {
          switch(e.which) {
            case ','.charCodeAt(0): //,
            case 13:// Enter Key
              e.preventDefault();
              $scope.addTag();
              break;
            default:
              break;
          }
        });
      }
    };
  }]);