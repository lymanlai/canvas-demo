angular.module('yh')
  .directive('yhUploader', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<button type="button" class="{{class}}" data-style="expand-right" style="position: relative;overflow: hidden;"' +'>' +
                  '<span class="ladda-label" ng-transclude></span>' +
                  '<input type="file" style="height:100%;position: absolute;top: 0;right: {{rightPosition}};margin: 0;opacity: 0;filter: alpha(opacity=0);cursor: pointer;z-index:999;">' +
                '</button>'
      ,
      link: function(scope, iElement, iAttrs) {
        var Loading = {
                ladda: null
                , element: iElement[0]
                , Init: function(){
                    Loading.ladda = Ladda.create( Loading.element );
                  }
                , EnsureStarted: function(){
                    if( !Loading.ladda.isLoading() ){
                      Loading.ladda.start();
                    }
                  }
                , SetProgress: function(progress){
                    if( !Loading.ladda ){
                      Loading.Init();
                    }
                    Loading.EnsureStarted();
                    Loading.ladda.setProgress( progress );
                  }
                , Stop: function(){
                    Loading.ladda.stop();
                  }
              }
            , Uploader = {
                xhr: null
                , Start: function(){
                    scope.rightPosition = '-9999px';
                  }
                , End: function(){
                    scope.rightPosition = '0';
                  }
                , Progress: function(e){
                    if (e.lengthComputable) {
                      Loading.SetProgress( e.loaded / e.total );
                    }
                  }
                , Load: function(){
                    scope[ iAttrs['onComplete'] ]();
                    Loading.Stop();
                    Uploader.End();
                  }
                , Error: function(e){
                    console.log('error', e);
                    Loading.Stop();
                    Uploader.End();
                  }
                , Abort: function(e){
                    console.log('abort', e);
                    Loading.Stop();
                    Uploader.End();
                  }
              };

        scope.rightPosition = '0';

        iElement.find('input').bind('change', function() {
          var fd = new FormData();
          fd.append( iAttrs.fieldName, this.files[0]);

          for (var name in iAttrs) {
            var beginWithSet = name.substr(0, 3)==='set';
            if ( iAttrs.hasOwnProperty(name) && beginWithSet ) {
              fd.append( name, iAttrs[name]);
            }
          }

          Uploader.xhr = new XMLHttpRequest();
          Uploader.xhr.open('POST', iAttrs.action, true);
          // Uploader.xhr.withCredentials = true;
          Uploader.xhr.setRequestHeader( iAttrs.securityHeaderName, iAttrs.securityHeaderValue );

          Uploader.xhr.upload.addEventListener('progress', Uploader.Progress, false);
          Uploader.xhr.upload.addEventListener('load', Uploader.Load, false);
          Uploader.xhr.upload.addEventListener('error', Uploader.Error, false);
          Uploader.xhr.upload.addEventListener('abort', Uploader.Abort, false);
          Uploader.xhr.send(fd);

        });
      }
    };
  });