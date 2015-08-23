angular.module('yh')
  .directive('contenteditable', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        // view -> model
        element.bind('blur keydown keyup change paste', function() {
          scope.$apply(function() {
            var text = $('<div />').html(  element.html() ).text();
            ctrl.$setViewValue( text );
          });
        });       

        // model -> view
        ctrl.$render = function() {
          var text = $('<div />').html(  ctrl.$viewValue ).text();
          element.html( text );
        };

        ctrl.$render();
      }
    };
  });