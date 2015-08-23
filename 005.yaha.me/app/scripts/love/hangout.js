'use strict';
angular.module('yh.love')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('love.hangout', {
      url: '/hangout',
      templateUrl: yh.path('love/views/hangout.html'),
      controller: ['$scope', '$http', 'yh', 'yhHangout', function($scope, $http, yh, yhHangout){

        $scope.location = yhHangout.getLocation();

        var query = {
          location: $scope.location
        };
        $http.get( yh.api( 'love/getHangoutList', query ) )
          .success(function(result){
            $scope.items = result.data;
          })
          .error(function(result){
            if (result.err && result.err === 'do_not_have_any_hangout_yet') {
              $scope.noHangoutYet = true;
            }
          });    
      }]
    });
  }]);