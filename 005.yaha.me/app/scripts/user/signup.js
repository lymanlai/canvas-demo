'use strict';
angular.module('yh.user')
  .config(['$stateProvider', 'yh', function($stateProvider, yh) {
    $stateProvider.state('signup', {
      url: '/signup/',
      access: 'anon',
      templateUrl: yh.path('user/views/signup.html'),
      controller: ['$scope', '$state', 'yhAlert', 'yhUser', '__', function($scope, $state, yhAlert, yhUser, __){
        var formKeys = ['email', 'displayName', 'password', 'gender' ];
        $scope.gender = 'male';

        $scope.email = '';
        $scope.email = '316338109@qq.com';
        $scope.displayName = 'Lyman Lai';
        $scope.password = '123456';
        $scope.confirmPassword = '123456';

        $scope.submit = function(){
          var data = yh.getFormData(formKeys,$scope);

          yhUser.signup(data, function(result) {
              switch( result.status ){
                case 'success':
                  yhAlert.push('login', {type:'success', msg: __('Please check your email to get account active.(The Email maybe arrive after some minutes)')} );
                  $state.transitionTo('login');
                  break;
                case 'email_already_exist':
                  $scope.form.email.$dirty = true;
                  $scope.form.email.$pristine = false;
                  $scope.form.email.$setValidity('unique', false);
                  break;
                case 'email_invalid':
                  $scope.form.email.$dirty = true;
                  $scope.form.email.$pristine = false;
                  $scope.form.email.$setValidity('email', false);
                  break;
                default:
                  //unknown error

              }
          });
        };
      }]
    });
  }]);