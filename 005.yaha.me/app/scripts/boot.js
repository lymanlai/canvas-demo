'use strict';

angular.module('yahaApp', [
    'ngTouch',
    'angular-gestures',
    //angular-ui
    'ui.bootstrap.position', 'ui.bootstrap.bindHtml', 'ui.bootstrap.transition', 'ui.bootstrap.buttons', 'ui.bootstrap.alert', 'ui.bootstrap.modal', 'ui.bootstrap.tabs', 'ui.bootstrap.progressbar', 'ui.bootstrap.tooltip', 'ui.bootstrap.dropdownToggle', 'ui.bootstrap.collapse', 'ui.bootstrap.rating',
    'ui.router', 'ngSanitize', 'ngAnimate', 'localization', 'ui.keypress',
    // vendor
    'angularMoment',
    'timer',
    'xeditable',
    'monospaced.elastic',
    'colorpicker.module',
    'angularytics',
    'yh.user', 'yh.setting', 'yh',
    'yh.yaha'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'yh', 'AngularyticsProvider', 'msdElasticConfig', '$sceDelegateProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, yh, AngularyticsProvider, msdElasticConfig, $sceDelegateProvider) {

    msdElasticConfig.append = '\n';

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://*.yaha.me/**'
      ]);

    var analyticsType = 'console';
    if (IS_ONLINE) {
      analyticsType = 'GoogleUniversal';
    }
    AngularyticsProvider.setEventHandlers([analyticsType]);

    //setup if using pushstate
    // $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.rule(function($injector, $location) {
      var path = $location.path()
        // Note: misnomer. This returns a query object, not a search string
        , search = $location.search()
        , params
        ;

      // check to see if the path already ends in '/'
      if (path[path.length - 1] === '/') {
        return;
      }

      // If there was no search string / query params, return with a `/`
      if (Object.keys(search).length === 0) {
        return path + '/';
      }

      // Otherwise build the search string and return a `/?` prefix
      params = [];
      angular.forEach(search, function(v, k){
        params.push(k + '=' + v);
      });
      return path + '/?' + params.join('&');
    });

    $stateProvider
      .state('home', {
        url: '/'
      })
      .state('404', {
        url: '/404/',
        templateUrl: yh.path('views/404.html')
      })
      .state('403', {
        url: '/403/',
        templateUrl: yh.path('views/403.html')
      })
      .state('feedback',{
        url: '/feedback/',
        templateUrl: yh.path('views/feedback.html'),
        controller: ['$http', '$scope', 'yhModal', '$state', '__', '$timeout', function($http, $scope, yhModal, $state, __, $timeout){
          $scope.submit = function(){
            var data = {
              message: $scope.message,
              type: location.hostname
            };
            $http.post( yh.api('feedback'), data)
              .success(function () {
                yhModal( __('Success'), __('Submit feedback success, please wait while redirecting to home.') );
                  $timeout(function(){
                    $state.transitionTo('home');
                  }, 2000);
              });
          };
        }]
      })
      .state('language',{
        url: '/language/',
        templateUrl: yh.path('views/language.html'),
        controller: ['$state', 'yhUser', '$scope', '$window', 'localize', 'yhCache', function($state, yhUser, $scope, $window, localize, yhCache){
          $scope.items = [
            { lang: 'en-US', label : 'English' },
            { lang: 'zh-CN', label : '中文' }
          ];
          $scope.updateLanguage = function(item) {
            $httpProvider.defaults.headers.common.lang = item.lang;
            localize.reloadLocalizedResources( item.lang );
            yhCache.put('_lang', item.lang);
            $window.history.back();
          };
        }]
      })
     ;

    // $urlRouterProvider.otherwise('/404/');

  }])
  .run(['$rootScope', '$state', '$stateParams', 'yhCache', 'localize', '$http', '$timeout', 'yhUser', 'yh', 'editableOptions', 'Angularytics', function ($rootScope, $state, $stateParams, yhCache, localize, $http, $timeout, yhUser, yh, editableOptions, Angularytics ) {

    Angularytics.init();

    editableOptions.theme = 'bs3';

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.yh = yh;

    yhUser.GetFromServer();

    var headerShow = yhCache.get('_headerShow');
    if (headerShow === null) {
      headerShow = false;
    }
    $rootScope.headerShow = headerShow;
    $rootScope.menuToggle = function(){
      $rootScope.headerShow = !$rootScope.headerShow;
      yhCache.put('_headerShow', $rootScope.headerShow);
    };

    if (IS_ONLINE) {
      $rootScope.menuUrl = 'http://share.yaha.me/menu.html';
    } else {
      $rootScope.menuUrl = '/menu.html';
    }

    var lang = yhCache.get('_lang') || 'zh-CN';
    $http.defaults.headers.common.lang = lang;
    angular.forEach( yh.langList, function(langItem){
      localize.initLocalizedResources( lang, langItem);
    });

    $rootScope.loaded = true;
  }]);