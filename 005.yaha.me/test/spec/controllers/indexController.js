'use strict';

describe('Controller: IndexControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('yahaApp'));

  var IndexControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IndexControllerCtrl = $controller('IndexControllerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
