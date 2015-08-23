angular.module('yh')
  .factory('yhAlert', function () {
    var alerts = {};
    return {
        pull: function(type){
            var alert = [];
            if( alerts[type] ){
                alert = alerts[type];
                alerts[type] = [];
            }
            return alert;
        },
        push: function(type, alertObj){
            if( !alerts[type] ){
                alerts[type] = [];
            }
            alerts[type].push(alertObj);
        }
    };
  });