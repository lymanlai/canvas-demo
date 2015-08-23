'use strict';
angular.module('yh.love', ['ui.router', 'yh'])
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('love', {
        url: '/love',
        abstract: true,
        templateUrl: yh.path('love/views/main.html')
      }).
      state('love.plan', {
        url: '/plan',
        templateUrl: yh.path('love/views/plan.html')
      }).
      state('love.howitworks', {
        url: '/howitworks',
        templateUrl: yh.path('love/views/howitworks.html')
      });
  }])
  .factory('yhFirstMeet', ['$rootScope', 'yhCache', '$state', '$location', 'yhAlert', '$http', 'yh', '__', 'yhUser', 'yhModal', function ($rootScope, yhCache, $state, $location, yhAlert, $http, yh, __, yhUser, yhModal) {
    
    function _yhFirstMeet(){}

    _yhFirstMeet.updateUserInfo = function(type, value){
      var data = yhCache.get('_yhFirstMeet') || {};
      data[type] = value;
      yhCache.put('_yhFirstMeet', data);
    };

    _yhFirstMeet.getFirstMeetQueryInfo = function(){
      return yhCache.get('_yhFirstMeet') || {};
    };

    _yhFirstMeet.hasTicket = function(){
      var me = yhUser.getMe();
      if (!me.firstMeet) {
        return false;
      }

      if (!me.firstMeet.ticket) {
        return false;
      }

      if (me.firstMeet.ticket <= 0) {
        return false;
      }

      return true;
    };

    _yhFirstMeet.join = function(id, cb){
      $http.post(yh.api('love/joinFirstMeet'), {id: id})
        .success(function () {
          cb();
        })
        .error(function (result) {
          cb(result);
        });
    };

    _yhFirstMeet.updateStationList = function(city, cb){
      var query = {city: city};
      $http.get( yh.api( 'love/getFirstMeetStationList', query ) )
        .success(function(result){
          cb( result.data );
        });
    };

    _yhFirstMeet.getFirstMeetItem = function(query, cb){
      $http.get( yh.api( 'love/getFirstMeetItem', query ) )
        .success(function(result){
          cb( result.data );
        });
    };

    _yhFirstMeet.completeStep = function(args, cb){
      $http.get( yh.api( 'love/firstMeetCompleteStep', args ) )
        .success(function(){
          cb();
        });
    };

    return _yhFirstMeet;
  }])
  .factory('yhHangout', ['$rootScope', 'yhCache', '$state', '$location', 'yhAlert', '$http', 'yh', '__', function ($rootScope, yhCache, $state, $location, yhAlert, $http, yh, __) {
    
    function _yhHangout(){}

    _yhHangout.getLocation = function(){
      return yhCache.get('_location') || '厦门';
    };

    _yhHangout.filter = {
      today: true,
      future: false
    };


    return _yhHangout;
  }])
  ;