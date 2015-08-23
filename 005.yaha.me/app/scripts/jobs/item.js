'use strict';
angular.module('yh.jobs')
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('jobs.item', {
      url: '/item/:id/{path:.*}',
      templateUrl: yh.path('jobs/views/item.html'),
      controller: ['$scope', '$http', 'yh', 'yhJobs', '$location', '$stateParams', '__', 'yhModal', '$modal', '$state', function($scope, $http, yh, yhJobs, $location, $stateParams, __, yhModal, $modal, $state){

        $scope.init = function(){
          var id = $stateParams.id;
          $scope.jobId = id;
          $scope.typeNameQuestion = 'question';
          $scope.typeNameThumbsUp = 'thumbsUp';
          $scope.typeNameThumbsDown = 'thumbsDown';

          yhJobs.item({id:id},function(data){
            $scope.item = data;
          });

          yhJobs.listReply({jobId:id, type:'question'}, function(data){
            $scope.questionList = data;
          });

          yhJobs.listReply({jobId:id, type:'thumbsUp'}, function(data){
            $scope.thumbsUpList = data;
          });

          yhJobs.listReply({jobId:id, type:'thumbsDown'}, function(data){
            $scope.thumbsDownList = data;
          });
        };

        $scope.addKeywordsAndTags = function(tag){
          var search = yhJobs.getSearchQuery();
          if (!search.tags) {
            search.tags = [];
          }
          if ( -1 === search.tags.indexOf( tag )) {
            search.tags.push( tag );
          }
          yhJobs.updateSearchQuery(search);
          $state.transitionTo('jobs.list');
        };

        $scope.onAdd = function(formData, cb) {
          formData.jobId = $scope.jobId;
          yhJobs.addReply(formData, cb);
        };
        $scope.onAddChild = function(formData, cb) {
          formData.jobId = $scope.jobId;
          yhJobs.addReply(formData, cb);
        };
        $scope.onGetChildren = function(formData, cb) {
          formData.jobId = $scope.jobId;
          yhJobs.listReply(formData, cb);
        };
        $scope.onThumbsUp = yhJobs.thumbsUpReply;
        $scope.onThumbsDown = yhJobs.thumbsDownReply;
        $scope.replyUserLink = function(id){
          return $state.href('jobs.itemUser', {id: id});
        };

        $scope.init();
      }]
    });
  }]);