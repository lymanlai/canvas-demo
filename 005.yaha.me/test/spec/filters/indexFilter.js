'use strict';

describe('Filter: indexFilter', function () {

  // load the filter's module
  beforeEach(module('yahaApp'));

  // initialize a new instance of the filter before each test
  var indexFilter;
  beforeEach(inject(function ($filter) {
    indexFilter = $filter('indexFilter');
  }));

  it('should return the input prefixed with "indexFilter filter:"', function () {
    var text = 'angularjs';
    expect(indexFilter(text)).toBe('indexFilter filter: ' + text);
  });

});
