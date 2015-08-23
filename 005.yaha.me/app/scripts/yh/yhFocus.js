angular.module('yh')
  .directive('yhFocus', ['$timeout', function($timeout) {    
    return {
      restrict: 'A',
      scope: {
        yhFocus: '=',
        yhFocusPosition: '='
      },
      link: function(scope, element, attrs) {
        function placeCaret(el, position) {
          if (el.childNodes.length === 0) {
            return;
          }
          var range = document.createRange();
          var sel = window.getSelection();          
          var lastNode = el.childNodes[ el.childNodes.length - 1 ];
          if (position < 0) {
            position = lastNode.length + position;
          }
          if (position === 'end') {
            position = lastNode.length;
          }
          if (lastNode.length < position) {
            position = lastNode.length;
          }
          range.setStart( lastNode, position );          
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        scope.$watch('yhFocus',
          function (newValue) {            
            var selection = window.getSelection();      
            var position = selection.baseOffset;  
            $timeout(function() {
              if( newValue ){
                if (scope.yhFocusPosition) {
                  position = scope.yhFocusPosition;
                }
                placeCaret( element[0], position );
                element[0].focus();
              } else {
                element[0].blur(); 
              }
            });
            scope[attrs.yhFocus] = false;
        });
      }
    };
  }]);