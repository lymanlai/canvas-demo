/**
 * @ngdoc overview
 * @name austackApp.account
 * @description
 * The `austackApp.account` module
 *
 * @requires ui.router
 */

(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.account', [
      'ui.router',
      'timer',
      'ngMaterial',
      'austackApp.account.settings'
    ])
    .config(configAccountRoute);

  // inject configAccountRoute dependencies
  configAccountRoute.$inject = ['$stateProvider'];

  // route config function configuring the passed $stateProvider
  function configAccountRoute($stateProvider) {
    var accountState = {
      name: 'account',
      abstract: true,
      templateUrl: 'app/account/account.html',
      controller: 'AccountController',
      controllerAs: 'account'
    };

    $stateProvider.state(accountState);
  }

})();
