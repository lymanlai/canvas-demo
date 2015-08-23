'use strict';

describe('Directive: indexDirective', function () {
  beforeEach(module('yahaApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<index-directive></index-directive>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the indexDirective directive');
  }));
});
