'use strict';
angular.module('yh.yaha', ['ui.router', 'yh'])
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    yh.langList.push('yaha');

    $stateProvider.state('yaha', {
        url: '/',
        // abstract: true,
        templateUrl: yh.path('yaha/views/main.html'),
        controller: ['$state', 'yhUser', function($state, yhUser){
          if( $state.is('yaha') ){
            if (yhUser.isLoggedIn()) {
              $state.transitionTo('yaha.list');
            } else {
              $state.transitionTo('about');
            }
          }
        }]
      })
      .state('yaha.my', {
        url: 'my/',
        access: 'user',
        controller: ['$state', 'yhUser', function($state, yhUser){
          if( yhUser.isLoggedIn() ){
            $state.transitionTo( 'yaha.itemUser', {id: yhUser.Uid()} );
          }
        }]
      })
      .state('about',{
        url: '/about/',
        templateUrl: yh.path('yaha/views/about.html')
      })
    ;
  }])
  .factory('yahaAPI', ['YhAPI', function(YhAPI){
    var YahaAPI = function(){};
    YahaAPI.prototype = new YhAPI('yaha');

    return new YahaAPI();
  }])
  ;