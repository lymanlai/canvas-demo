(function () {
  'use strict';

  /**
   * Introduce the austackApp.account.login module
   * and configure it.
   *
   * @requires {ui.router}
   */

  angular
    .module('austackApp.account')
    .config(configAccountLogin);

  // inject configAccountLogin dependencies
  configAccountLogin.$inject = ['$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the user.login state with the list template for the
   * 'login' view paired with the UserMainController as 'login'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configAccountLogin($stateProvider) {
    // The login state configuration
    var loginState = {
      name: 'account.login',
      url: '/login',
      authenticate: false,
      // role: 'anonymous',
      templateUrl: 'app/account/login/login.html',
      controller: 'AccountLoginController',
      controllerAs: 'login',
      ncyBreadcrumb: {
        skip: true
      }
    };

    $stateProvider.state(loginState);
  }

})();
