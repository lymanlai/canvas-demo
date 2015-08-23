'use strict';
angular.module('yh.love')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('love.changeLocation', {
        url: '/changeLocation',
        templateUrl: yh.path('love/views/changeLocation.html'),
        controller: ['$state', '$scope', 'yh', 'yhCache', function($state, $scope, yh, yhCache){
          
          yhCache.$get( 'love-locationList', yh.api( 'love/locationList' ) )
            .success(function(result){
              $scope.items = result.data;
            });

          $scope.update = function( locationText ){
            yhCache.put('_location', locationText);
            $state.transitionTo('love.hangout');
          };
        }]
      });
  }]);