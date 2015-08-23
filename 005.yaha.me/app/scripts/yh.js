'use strict';
angular.module('yh',[])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.responseInterceptors.push('onCompleteInterceptor');

    $httpProvider.interceptors.push(['$q', function($q) {
      return {
       'request': function(config) {
           // fix the push state error while do not start with the '/'
           if (config.method === 'GET' && config.url.substring(0,'template'.length) === 'template') {
              config.url = '/' + config.url;
           }
           return config || $q.when(config);
        }
      };
    }]);
  }])  
  .constant('yh', {
    langList: ['share'],
    api: function(url, jsonParams){
      url = API + url;
      if( jsonParams ){
        url = url + '?';
        angular.forEach(jsonParams, function(value, key){
          url += key + '=' + value + '&';
        });
      }
      return url;
    },
    staticUrl: function(path){return STATIC_HOST + path;},
    avatarUrl: function(path){return STATIC_HOST + 'avatar/' + path;},
    path: function(path){
      return '/scripts/' + path;
    },    
    shuffle: function(arr){
      return arr.sort( function() { return Math.random() - 0.5; } );
    },
    getFormData: function(formKeys, $scope){
      var data = {};
      angular.forEach(formKeys, function(value){
        data[value] = $scope[value];
      });
      return data;
    }
  })
  .factory('YhAPI', ['$rootScope', 'yhCache', '$state', '$location', 'yhAlert', '$http', 'yh', '__', 'yhUser', 'yhModal', function ($rootScope, yhCache, $state, $location, yhAlert, $http, yh, __, yhUser, yhModal) {

    var _yhAPI = function(prefix){
      this.prefix = prefix;
    };

    _yhAPI.prototype.get = function (path, args, cb) {
      if (cb === undefined) {
        cb = args;
        args = {};
      }

      $http.get( yh.api( this.prefix + '/' + path, args ) )
        .success(function(result){
          cb( result.data );
        });
    };

    _yhAPI.prototype.post = function (path, args, cb) {
      if (cb === undefined) {
        cb = args;
        args = {};
      }
      
      $http.post( yh.api( this.prefix + '/' + path ), args )
        .success(function(result){
          cb( result.data );
        });
    };

    return _yhAPI;
  }])
  .run(['$rootScope', 'yh', 'onStartInterceptor', '$http', function($rootScope, yh, onStartInterceptor, $http){
    $rootScope.isDirty = function(field){
      if (!field) {
        return false;
      }
      return field.$dirty && field.$invalid;
    };

    $rootScope.isError = function(field, type){
      return field.$dirty && field.$error[type];
    };

    $rootScope.avatarUrl = yh.avatarUrl;

    $http.defaults.transformRequest.push(onStartInterceptor);    
  }]);