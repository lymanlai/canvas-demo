(function () {
  'use strict';

  /**
   * Introduce the austackApp.repo module
   * and configure it.
   *
   * @requires ui.router
   * @requires ngResource
   * @requires austackApp.repo.main
   * @requires austackApp.repo.list
   * @requires austackApp.repo.create
   */
  angular
    .module('austackApp.repo', [
      'ngResource',
      'ui.router',
      'austackApp.repo.service',
      'austackApp.repo.list',
      'austackApp.repo.detail',
      'austackApp.repo.code'
    ])
    .config(configRepoRoutes);

  // inject configRepoRoutes dependencies
  configRepoRoutes.$inject = ['$urlRouterProvider', '$stateProvider', 'mainMenuProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the abstract repo state with the repo template
   * paired with the RepoController as 'index'.
   * The injectable 'repos' is resolved as a list of all repos
   * and can be injected in all sub controllers.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configRepoRoutes($urlRouterProvider, $stateProvider, mainMenuProvider) {
    // The repo state configuration
    var repoState = {
      name: 'repo',
      parent: 'root',
      url: '/repos',
      //abstract: true,
      ncyBreadcrumb: {
        label: '用户'
      },
      resolve: {
        /* @ngInject */
        repos: function (Repo) {
          return Repo.query().$promise;
        }
      },
      templateUrl: 'app/repo/repo.html',
      controller: 'RepoController',
      controllerAs: 'index'
    };

    $urlRouterProvider.when('/repos/', '/repos');
    $stateProvider.state(repoState);

    mainMenuProvider.addSubMenuItem('user.list', {
      name: '数据列表',
      state: repoState.name,
      icon: 'action:ic_supervisor_account_24px',
      order: 1
    });
  }

})();
