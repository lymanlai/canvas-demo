angular.module('yh')
  .factory('yhModal', ['$modal', 'yh', '__', function( $modal, yh, __){
    return function(args){
      if (!args.title) {
        args = {
          title: arguments[0],
          body: arguments[1]
        };
      }
    
      var modalInstance = $modal.open({
        templateUrl: yh.path('yh/yhModal.html'),
        controller: [ '$scope', '$modalInstance', '$timeout', function($scope, $modalInstance, $timeout){
          $scope.title = args.title;
          $scope.body = args.body;

          $scope.btn = {
            cssClass: 'btn-primary',
            label: __('Close')
          };

          if (args.cb) {
            args.cb(modalInstance);
          } else {
            $timeout(function(){
              modalInstance.close();
            }, 1000);
          }

        }]
      });
    };
  }]);