function fn() {

  var headless = 'true';
  var browser = 'firefox';
  var engine = 'selenium';

  var config = {
    url_form_page: 'https://www.selenium.dev/selenium/web/web-form.html',
    url_ajax_page: 'http://qa-demo.gitlab.io/reports/web/ajax.html',
    url_rest_api: 'https://petstore.swagger.io/v2/pet',
  };

  headless = karate.properties['headless'] || headless;
  headless = (headless == 'true') ? true : false;
  browser = karate.properties['browser']|| browser;
  engine = karate.properties['engine'] || engine;

  if (engine == 'playwright') {
    if (browser != "chromium")
      throw new Error("Unsopported browser for Playwright: " + browser);
    else
      karate.configure('driver', { type: 'playwright', headless: headless, playwrightOptions: { browserType: browser } });
  } else {  // engine == 'selenium'
    if (browser != "firefox" && browser != "chrome")
      throw new Error("Unsopported browser for Selenium: " + browser);
    if (headless) {
      if (browser == "firefox")
        karate.configure('driver', { type: 'geckodriver', executable: '/opt/webdriver/geckodriver', webDriverSession: { capabilities: { alwaysMatch: {browserName: 'firefox', "moz:firefoxOptions": { args: ['--headless'] } } } } });
      else
        karate.configure('driver', { type: 'chromedriver', executable: '/opt/webdriver/chromedriver', webDriverSession: { capabilities: { alwaysMatch: {browserName: 'chrome', "goog:chromeOptions": { args: ['headless'] } } } } });
        // karate.configure('driver', { type: 'playwright', headless: true });
    } else {
      if (browser == "firefox")
        karate.configure('driver', { type: 'geckodriver', executable: '/opt/webdriver/geckodriver' });
      else
        karate.configure('driver', { type: 'chromedriver', executable: '/opt/webdriver/chromedriver' });
    }
  }

  karate.log('browser =', browser);
  karate.log('engine =', engine);
  karate.log('headless =', headless);

  return config;
}
