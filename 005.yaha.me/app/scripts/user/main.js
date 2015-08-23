'use strict';
angular.module('yh.user', ['ui.router', 'yh', 'localization'])
  .config(['$httpProvider', function($httpProvider){
    $httpProvider.responseInterceptors.push('userNotLoginHttpInterceptor');
  }])
  .factory('yhUser', ['$rootScope', 'yhCache', '$state', '$location', 'yhAlert', 'yhModal', '$http', 'yh', '__', function ($rootScope, yhCache, $state, $location, yhAlert, yhModal, $http, yh, __) {

    var Permission = {
          accessLevels: {
              public: 7, // 111
              anon:   1, // 001
              user:   6, // 110
              admin:  4  // 100
            }
          , userRoles: {
              public: 1, // 001
              user:   2, // 010
              admin:  4  // 100
            }
          , Init: function(){
              var role = 'public';

              if( yhCache.get('_role') ){
                role = yhCache.get('_role');
              }

              $rootScope.role = role;
            }
          , Can : function(accessLevel) {
              return Permission.accessLevels[accessLevel] & Permission.userRoles[$rootScope.role];
            }
          , Save: function(role){
              yhCache.put('_role', role);
              $rootScope.role = role;
            }
          , Remove: function(){
              yhCache.remove('_role');
              $rootScope.role = 'public';
            }
        }
      , User = {
          Init: function(){
              $rootScope.me = yhCache.get('_me');
            }
          , Get: function(){
              return $rootScope.me;
            }
          , GetUid: function(){
              if ($rootScope.me && $rootScope.me.id) {
                return $rootScope.me.id;
              }
              return null;
            }
          , Save: function( user ){
              yhCache.put('_me', user);
              $rootScope.me = user;
            }
          , GetFromServer: function(cb){
              if( cb === undefined ){
                cb = function(){};
              }

              $http.get( yh.api('user/login') ).
                success(function(data){
                  User.Save(data);
                  Permission.Save( data.role );
                  cb(null, data);
                }).
                error(function(data){
                  cb(true, data );
                });
            }
          , Remove: function(){
              yhCache.remove('_me');
              $rootScope.me = null;
            }
          , LoginThenBackToRequest: function(data){
              var stateName = $state.current.name;
              if( data ){
                saveFormOldData( stateName, data );
              }
              saveState($state.current, $state.params);
              yhAlert.push('login', {type:'danger', msg: __('Your login session is experid! Please login again.')} );
              $state.transitionTo('login');
            }
          , ClearClientSession: function(){
              Sid.Remove();
              User.Remove();
              Permission.Remove();
            }
        }
      , Sid = {
          Init: function(){
              var sid = yhCache.get('_sid');
              if( sid ){
                $http.defaults.headers.common['sid'] = sid;
              }
            }
          , Get: function(){
              return yhCache.get('_sid');
            }
          , Save: function(value){
              yhCache.put('_sid', value);
              $http.defaults.headers.common['sid'] = value;
            }
          , Remove: function(){
              delete $http.defaults.headers.common['sid'];
              yhCache.remove('_sid');
            }
        }
      ;

    var saveState = function(state, stateParams){
          if( state && state.name ){
            oldState = {
              name: state.name,
              stateParams: stateParams
            };
          }
        }
        , formOldDataHash = {}
        , saveFormOldData = function( stateName, data ){
          formOldDataHash[stateName] = data;
        }
        , oldState;

    $rootScope.hasPermission = Permission.Can;

    Permission.Init();
    User.Init();
    Sid.Init();

    $rootScope.accessLevels = Permission.accessLevels;
    $rootScope.userRoles = Permission.userRoles;

    return {
        hasPermission: Permission.Can,
        isLoggedIn: function() {
            var role = $rootScope.role;
            return ( role === 'user' ) || ( role === 'admin' );
        },
        signup: function(data, callback) {
          $http.post( yh.api('user'), data ).
            then(function( res ){
              callback( res.data );
            });
        },
        login: function(data, cb) {
          $http.post( yh.api('user/login'), data )
            .success(function(data){
              Sid.Save( data.sid );
              User.GetFromServer(cb);
            })
            .error(function(result){
              cb(result);
            });
        },
        UpdateSid: Sid.Save,
        changePassword: function(data, cb){
          $http.put( yh.api('user/changePassword'), data )
            .success(function(){
              yhModal( __('Success'), __('Update password success.') );
            })
            .error(function(){
              yhModal( __('Failure'), __('Old password is not correct') );
              cb(true);
            });
        },
        update: function(data, cb){
          // var userId = $rootScope.me.id;
          $http.put( yh.api('user'), data ).
            success(function(){
              User.GetFromServer(function(err){
                if (cb) {
                  cb(err);
                  return;
                }

                if( err ){
                  yhModal( __('Failure'), __('Update failure') );
                } else {
                  yhModal( __('Success'), __('Update success') );
                }
              });
            });
        },
        GetFromServer: User.GetFromServer,
        clearClientSession: User.ClearClientSession,
        logout: function(cb) {
          $http.get( yh.api('user/logout') ).
            success(function(){
              User.ClearClientSession();
            })
            .then(function(){
              cb();
            });
        },
        Sid: Sid.Get,
        getMe: User.Get,
        Uid: User.GetUid,
        initUserPermission: Permission.Init,
        saveState: saveState,
        restoreStateOrToHome: function(){
          if(oldState && oldState.name !== 'logout' ){
            $state.transitionTo(oldState.name, oldState.stateParams);
          }else{
            $location.path('/');
          }
          oldState = null;
        },
        loginThenBackToRequest: User.LoginThenBackToRequest,
        saveFormOldData: saveFormOldData,
        getFormOldData: function( ){
          var formOldData = null
            , stateName = $state.current.name;

          if( formOldDataHash[stateName] ){
            formOldData = formOldDataHash[stateName];
            formOldDataHash[stateName] = null;
          }

          return formOldData;
        },
        accessLevels: Permission.accessLevels,
        userRoles: Permission.userRoles
    };
  }])
  .factory('userNotLoginHttpInterceptor', ['$injector', '$rootScope', '$q', function($injector, $rootScope, $q) {
    var yhUser;
    var __;

    function response401(response){
      if(response.status === 401) {
        yhUser = yhUser || $injector.get('yhUser');
        yhUser.clearClientSession();
        yhUser.loginThenBackToRequest( response.config.data );
      }
      return $q.reject(response);
    }

    function success(response) {
      __ = __ || $injector.get('__');
      switch( response.status ){
        case 0:
          response.data =  __('Can not connect to server!');
          return $q.reject(response);
        case 401: //unauthorized
          return response401(response);
        case 403:
          return $q.reject(response);
        default:
          return response;
      }
    }

    function error(response) {
      return $q.reject(response);
    }

    return function(promise) {
      return promise.then(success, error);
    };
  }])
  .run(['$rootScope', '$state', 'yhUser', 'yhAlert', '$timeout', '__', function($rootScope, $state, yhUser, yhAlert, $timeout, __){
    $rootScope.$on('$stateChangeSuccess', function (event, next, nextParams, current, currentParams) {
      if( next.name === 'logout' || next.name === 'login' ){
        if( current.name !== 'signup'
            && current.name !== '403'
            && current.name !== '404'
            && current.name !== 'homeNotLogin'
          ){
          yhUser.saveState(current, currentParams);
        }
        return false;
      }
      if ( next.access && !$rootScope.hasPermission(next.access) ) {
          if( yhUser.isLoggedIn() ){
            $state.transitionTo('403');
          }else{
            yhUser.saveState(next, nextParams);
            yhAlert.push('login', {type:'danger', msg: __('Please login first.')} );
            $timeout(function(){
              $state.transitionTo('login');
            });
          }
          return false;
      }
    });
  }]);