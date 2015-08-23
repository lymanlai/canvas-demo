'use strict';
angular.module('yh.jobs')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('jobs.list', {
      url: '/list/',
      templateUrl: yh.path('jobs/views/list.html'),
      controller: ['$scope', '$http', 'yh', 'yhJobs', '$location', '$timeout', '$modal', '__',
      function(    $scope, $http, yh, yhJobs, $location, $timeout, $modal, __){

        $scope.init = function(){
          yhJobs.getCityList(function(cityList){
            $scope.cityList = cityList;
          });
          var search = yhJobs.getSearchQuery();
          $scope.search = search;     
          $scope.keywordsAndTags = ( search.keywords || [] ).concat(search.tags||[]);
          $scope.tagsList = [];
          
          if (search.city) {
            $scope.updateCity(search.city);
          } else {
            $scope.queryList();
          }
        };

        $scope.updateCity = function(value){
          $scope.search.city = value;
          yhJobs.updateSearchQuery($scope.search);

          yhJobs.getTagsListByCity(value, function(tagsList){
            $scope.tagsList = tagsList;
          });
        };
        $scope.$watch('search.city', $scope.updateCity);

        $scope.$watch('[keywordsAndTags,tagsList]',function(arr){
          var keywordsAndTags = arr[0];
          var keywords = [];
          var tags = [];

          if (!$scope.tagsList) {
            $scope.tagsList = [];
          }
          angular.forEach(keywordsAndTags, function(value){
            if ( $scope.tagsList.indexOf(value) === -1 ) {
              keywords.push(value);
            } else {
              tags.push(value);
            }
          });
          $scope.search.keywords = keywords;
          $scope.search.tags = tags;
          yhJobs.updateSearchQuery($scope.search);
          $scope.queryList();
        }, true);

        $scope.queryList = function(){          
          yhJobs.list(function(items){
            $scope.items = items;
          });
        };

        $scope.addKeywordsAndTags = function(tag){
          if ( !angular.isArray($scope.keywordsAndTags) ) {
            $scope.keywordsAndTags = [];
          }

          if ( -1 === $scope.keywordsAndTags.indexOf( tag )) {
            $scope.keywordsAndTags.push(tag);
          }

          $timeout(function(){
            var offsetTop = $('#keywordsAndTags').offset().top - 15;
            $('html,body').stop().animate({scrollTop: offsetTop}, 500);
          });
        };

        $scope.toggleShow = function(id){
          if ($scope.currentShowId === id) {
            id = null;
          }
          $scope.currentShowId = id;
          $timeout(function(){
            if (id !== null) {
              var offsetTop = $('#item-'+id).offset().top;
              $('html,body').stop().animate({scrollTop: offsetTop}, 500);
            }
          });
        };

        $scope.showModalForm = function(type, item){
          var titleHash = {
            'question': __('Ask Question to %s', item.title),
            'thumbsUp': __('Thumbs Up for %s', item.title),
            'thumbsDown': __('Thumbs Down for %s', item.title)
          };
          var title = titleHash[type];

          var modalInstance = $modal.open({
              templateUrl: yh.path('jobs/views/list-modalForm.html'),
              controller: [ '$scope', '$modalInstance', function(scope, $modalInstance){
                scope.title = title;
                scope.formData = {};
                scope.submitResult = false;
                scope.submit = function(){
                  var formData = scope.formData;
                  formData.jobId = item.id;
                  formData.type = type;
                  yhJobs.addReply(formData, function(data){
                    item[ type + 'Count' ]++;
                    scope.formData = {};
                    scope.submitResult = 'success';
                    $timeout(function(){
                      modalInstance.close();
                    }, 1000);
                  });
                };
              }]
            });
        };

        $scope.init();
      }]
    });
  }]);