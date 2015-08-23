'use strict';
angular.module('yh.yaha')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('yaha.add', {
      url: 'add/',
      access: 'user',
      views: {
        '@yaha': {
          templateUrl: yh.path('yaha/views/add.html'),
          controller: ['$scope', '$http', 'yh', '__', 'yhModal', '$state', '$timeout', 'yahaAPI', function($scope, $http, yh, __, yhModal, $state, $timeout, yahaAPI){

            $scope.init = function(){
              $scope.formData = {
                title: '',
                tags: []
              };

              //for test only
              var formData = {};
              // formData = {
              //   title: 'test ' + new Date()
              //   ,
              //   tags: ['testTag' + new Date()],
              //   content: 'test ' + new Date()
              // };
              
              $scope.formData = formData;
            };

            $scope.submit = function(){
              yahaAPI.post( 'add', $scope.formData, function(result){
                if(!result) {
                  yhModal( {
                    title: __("Success"),
                    body: __("Add Success!"),
                    cb: function(modalInstance) {
                      $scope.form.$setPristine();
                      $scope.init();
                      $timeout(function(){
                        modalInstance.close();
                        $state.transitionTo('yaha.list');
                      }, 1500);
                    }
                  } );
                } else {
                  yhModal(__("Unknown Error"), __("Add Error! Please send us feedback"));
                }
              });
            };
            $scope.init();
          }]
        }
      }      
    });
  }]);