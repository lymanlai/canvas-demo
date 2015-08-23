angular.module('yh')
  .factory('onCompleteInterceptor', ['loadingService', '$rootScope', function(loadingService, $rootScope) {
    return function(promise) {
      var decrementRequestCount = function(response) {
        loadingService.requestCount--;
        if( loadingService.requestCount < 1 ){
          loadingService.requestCount = 0;
          NProgress.done(true);
        }
        
        return response;
      };
      return promise.then(decrementRequestCount, decrementRequestCount);
    };
  }]);