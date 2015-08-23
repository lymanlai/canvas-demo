'use strict';
angular.module('yh.node', ['ui.router', 'yh'])
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('node', {
        url: '/node',
        abstract: true,
        templateUrl: yh.path('node/views/main.html')
      })
      .state('node.my', {
        url: '/my/',
        access: 'user',
        controller: ['$state', 'yhUser', function($state, yhUser){
          if( yhUser.isLoggedIn() ){     
            $state.transitionTo( 'node.itemUser', {id: yhUser.Uid()} );
          }
        }]
      })
    ;
  }])
  .factory('yhJobs', ['$rootScope', 'yhCache', '$state', '$location', 'yhAlert', '$http', 'yh', '__', 'yhUser', 'yhModal', function ($rootScope, yhCache, $state, $location, yhAlert, $http, yh, __, yhUser, yhModal) {
    
    function _yhJobs(){}

    _yhJobs.item = function (args, cb) {
      $http.get( yh.api( 'jobs/item', {id:args.id} ) )
        .success(function(result){
          cb( result.data );
        });
    };

    _yhJobs.itemTrash = function (args, cb) {
      $http.get( yh.api( 'jobs/itemTrash', {id:args.id} ) )
        .success(function(result){
          cb( result.data );
        });
    };


    _yhJobs.itemUser = function (args, cb) {
      $http.get( yh.api( 'jobs/itemUser', {id:args.id} ) )
        .success(function(result){
          cb( result.data );
        });
    };
    
    _yhJobs.itemUserAdd = function (args, cb) {
      $http.get( yh.api( 'jobs/itemUserAdd', {id:args.id} ) )
        .success(function(result){
          cb( result.data );
        });
    };
    
    _yhJobs.itemUserUpdate = function (args, cb) {
      $http.post( yh.api( 'jobs/itemUserUpdate' ), args )
        .success(function(result){
          cb( result.data );
        });
    };

    _yhJobs.addReply = function(data, cb){
      $http.post(yh.api('jobs/addReply'), data)
        .success(function (result) {
          cb(result.data);
        });
    };

    _yhJobs.add = function(data, cb){
      $http.post(yh.api('jobs/add'), data)
        .success(function () {
          cb();
        });
    };

    _yhJobs.listReply = function(query, cb){
      $http.get( yh.api( 'jobs/listReply', query ) )
        .success(function(result){
          cb( result.data );
        });
    };

    _yhJobs.thumbsUpReply = function(data, cb){
      $http.post(yh.api('jobs/thumbsUpReply'), data)
        .success(function (result) {
          cb(result.data);
        });
    };
    
    _yhJobs.thumbsDownReply = function(data, cb){
      $http.post(yh.api('jobs/thumbsDownReply'), data)
        .success(function (result) {
          cb(result.data);
        });
    };

    _yhJobs.getUserCity = function(cb){
      var searchQuery = yhCache.get('_yhJobs') || {};
      var city = '';
      if (searchQuery.city) {
        city = searchQuery.city;
      }
      cb( city );
    };

    _yhJobs.getSearchQuery = function(query){
      return yhCache.get('_yhJobs') || {};
    };

    _yhJobs.updateSearchQuery = function(query){
      yhCache.put('_yhJobs', query);
    };

    _yhJobs.list = function(query, cb){
      if (!cb) {
        cb = query;
        query = _yhJobs.getSearchQuery();
      }
      
      $http.get( yh.api( 'jobs/list', query ) )
        .success(function(result){
          cb( result.data );
        });
    };
    
    _yhJobs.listByCreaterId = function(createrId, cb){
      var query = {
        createrId: createrId
      };
      $http.get( yh.api( 'jobs/list', query ) )
        .success(function(result){
          cb( result.data );
        });
    };


    _yhJobs.getTagsListByCity = function(city, cb){
      var query = {
        city: city
      };

      $http.get( yh.api( 'jobs/getTagsListByCity', query ) )
        .success(function(result){
          cb( result.data );
        });
    };

    _yhJobs.getCityList = function(cb){
      $http.get( yh.api( 'jobs/getCityList' ) )
        .success(function(result){          
          cb( result.data );
        });
    };

    return _yhJobs;
  }])
  ;