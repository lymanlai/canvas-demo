describe('Y signup', function() {
  it('should make a signup', function() {
    browser.get('http://localhost:9000/#/signup/');

    element(by.model('email')).sendKeys('316338109@qq.com');
    element(by.model('displayName')).sendKeys('Lyman Lai');
    element(by.model('password')).sendKeys('123456');
    element(by.model('confirmPassword')).sendKeys('123456');

    element(by.css('[type="submit"]')).click();
  });
});