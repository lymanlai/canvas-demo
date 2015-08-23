'use strict';
angular.module('yh.node')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('node.add', {
      url: '/add',
      access: 'user',
      views: {
        '@node': {
          templateUrl: yh.path('node/views/add.html'),
          controller: ['$scope', '$http', 'yh', '__', 'yhModal', '$state', '$timeout', 'yhJobs', function($scope, $http, yh, __, yhModal, $state, $timeout, yhJobs){

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

              yhJobs.getCityList(function(cityList){
                $scope.cityList = cityList;
              });
              yhJobs.getUserCity(function(city){
                if (!city) {
                  return;
                }
                $scope.formData.city = city;
                $scope.updateTagsForSelectByCity(city);
              });
            };

            $scope.$watch('formData.city', function(city){
              $scope.updateTagsForSelectByCity(city);
            }, true);

            $scope.$watch('formData.tags', function(value){
              if ( angular.isArray(value) && value.length > 0 && $scope.form.tags ) {
                $scope.form.tags.$dirty = true;
              }
            }, true);
            
            $scope.checkValidate = function(key) {
              if (!$scope.form[key].$valid && !$scope.form[key].$dirty) {
                $scope.form[key].$dirty = true;
              }
            };

            $scope.updateTagsForSelectByCity = function(city){
              yhJobs.getTagsListByCity(city, function(tagsList){
                $scope.tagsList = tagsList;
              });
            };

            $scope.submit = function(){
              yhJobs.add($scope.formData, function(result){
                if(!result) {
                  yhModal(__("Success"), __("Add Success!"));
                  $scope.form.$setPristine();
                  $scope.init();
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