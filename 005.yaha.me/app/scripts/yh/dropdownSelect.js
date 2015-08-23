'use strict';

angular.module('yh')
  .directive('dropdownSelect', ['yh', function(yh) {
    return {
      restrict: 'EA',
      scope: {
        selectList: '=',
        placeholder: '@',
        ngModel: '='
      },
      replace: true,
      templateUrl: yh.path('yh/dropdownSelect.html'),
      link: function($scope, element, attrs) {        
        $scope.updateSelect = function(item){
          $scope.ngModel = item;
        };
      }
    };
  }]);