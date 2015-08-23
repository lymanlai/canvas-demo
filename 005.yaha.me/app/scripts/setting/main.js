'use strict';
angular.module('yh.setting', ['ui.router', 'yh'])
  .config(['$stateProvider', 'yh', function($stateProvider, yh){
    $stateProvider.state('setting', {
      url: '/setting',
      abstract: true,
      access: 'user',
      templateUrl: yh.path('setting/views/main.html')
    });
  }]);