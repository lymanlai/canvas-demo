angular.module('yh')
  .factory('onStartInterceptor', ['loadingService', '$rootScope', function(loadingService, $rootScope) {
    return function (data) {      
      loadingService.requestCount++;
      NProgress.start();
      return data;
    };
  }]);