angular.module('yh')
  .filter('nl2br', function(){
    return function (value) {
        if (!value || !angular.isString(value)) {
            return value;
        }
        var result = value.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br ' + '/>$2');
        return result;
    };
  });
