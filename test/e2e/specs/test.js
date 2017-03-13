// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.row')
      .assert.containsText('h2', '發言申請')
      .assert.elementCount('input', 2)
      .assert.elementCount('textarea', 2)
      .setValue('#attendee_name', 'Test-e2e')
      .setValue('#email', 'user@example.com')
      .setValue('#summary', "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type a")
      .click('#submit')
      .pause(2000)
      .assert.containsText('.alert-success', '成功送出發言申請，請留意投影幕上的講者 Queue')
      .end();
  },
};
