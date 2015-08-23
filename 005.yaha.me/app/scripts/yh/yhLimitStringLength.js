angular.module('yh')
  .filter('yhLimitStringLength', function () {
    return function (input, maxLength) {
      maxLength = maxLength || 20;
      var l = []
        , count = 0;

      for(var i=0; i< input.length; i++) {
        count += /[^\x00-\xff]/.test(input.charAt(i)) && 2 || 1;
        l.push(input.charAt(i));
        if (count >= maxLength) {
          l.push("...");
          break;
        }
      }

      return l.join("");
    };
  });