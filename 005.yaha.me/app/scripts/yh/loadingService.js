angular.module('yh')
  .factory('loadingService', function() {
    var service = {
      requestCount: 0,
      isLoading: function() {
        return service.requestCount > 0;
      }
    };
    return service;
  });