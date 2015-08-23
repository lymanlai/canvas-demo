angular.module('yh')
  .filter('yhContentLink', function () {
    return function (content) {
      var result = content && content.replace(/(http:\/\/[^\ ]*)/g, '<a href="$1" target="_blank">$1</a>') || "";
      return result;
    };
  });