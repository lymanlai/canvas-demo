angular.module('yh')
  .factory('yhCache', ['$q', '$http', function($q, $http){
    var self = {
      checkExpired: function(){
        var key = '_last';
        var expiredTime = 1000;//1 second
        if( location.hostname !== 'localhost' && location.hostname !== '192.168.0.2' ){
          expiredTime = 1000*60*10;//10 minutes
        }
        var now = (new Date()).getTime();
        var last = localStorage.getItem( key );
        if( !last ){
          last = now;
          localStorage.setItem( key, last );
        }
        if( (now - last) > expiredTime ){
          self.removeAll();     
          localStorage.setItem( key, now );     
        }
      },
      put: function(key, value){
        self.checkExpired();
        if (typeof value === 'undefined'){
          value = null;
        } 
        value = JSON.stringify(value);
        localStorage.setItem( key, value );

        return true;
      },
      get: function(key){
        self.checkExpired();
        var item = localStorage.getItem(key);
        item = JSON.parse( item );
        return item;
      },
      $get: function(keyPrefix, url){
        var deferred = $q.defer();
        var promise = deferred.promise;
        var cacheKey = keyPrefix + ':' + url;
        var response = self.get( cacheKey );
        var config = {
                method: 'get',
                url: url
              };

        promise.success = function(fn) {
          promise.then(function(response) {
            fn(response.data, response.status, response.headers, config);
          });
          return promise;
        };

        promise.error = function(fn) {
          promise.then(null, function(response) {
            fn(response.data, response.status, response.headers, config);
          });
          return promise;
        };

        if( response ){
          deferred.resolve( response );
        }else{
          $http.get( url ).
            then(
              function(response){
                self.put( cacheKey, response );
                deferred.resolve( response );
              },
              function(response){
                deferred.reject(response);
              });
        }
        return promise;
      },
      remove: function(key, isPrefix){
        self.checkExpired();
        if( !isPrefix ){
          localStorage.removeItem( key );
          return true;
        }
        var prefix = key;
        var prefixLength = prefix.length;

        for (key in localStorage) {
          if (key.substr(0,prefixLength) === prefix) {
            localStorage.removeItem( key );
          }
        }
        return true;
      },
      removeAll: function(){
        var prefix = '_';
        var prefixLength = prefix.length;
        var key;
        
        for (key in localStorage) {
          if (key.substr(0,prefixLength) !== prefix) {
            localStorage.removeItem( key );
          }
        }
      },
      destroy: function(){
        localStorage.clear();
      }
    };

    return {
      put: self.put, 
      get: self.get,
      $get: self.$get,
      remove: self.remove,
      removeAll: self.removeAll
    };
  }]);