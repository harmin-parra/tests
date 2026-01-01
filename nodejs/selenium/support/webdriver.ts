import { Builder, WebDriver } from "selenium-webdriver";
import { Buffer } from "node:buffer";
import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";
import edge from "selenium-webdriver/edge";
import { getBrowserName, getHeadlessOption, getHubOption } from "./argv"


export async function getWebDriver(): Promise<WebDriver> {
  const browser = getBrowserName();
  const headless = getHeadlessOption();
  const hub = getHubOption();

  let builder = new Builder();
  
  if (browser == "chrome") {
    const options = new chrome.Options();
    options.addArguments("--disable-gpu", "--window-size=1920,1080");
    if (headless)
      options.addArguments("--headless=new");
    builder = builder.forBrowser("chrome").setChromeOptions(options);
  } 
  else if (browser == "msedge" || browser == "edge") {
    const options = new edge.Options();
    options.addArguments("--disable-gpu", "--window-size=1920,1080");
    if (headless)
      options.addArguments("--headless=new");
    builder = builder.forBrowser("MicrosoftEdge").setEdgeOptions(options);
  }
  else if (browser == "chromium") {
    const options = new chrome.Options();
    options.setChromeBinaryPath("/usr/bin/chromium");  // adjust path if needed
    options.addArguments("--disable-gpu", "--window-size=1920,1080");
    if (headless)
      options.addArguments("--headless=new");
    builder = builder.forBrowser("chrome").setChromeOptions(options);
  } 
  else { // firefox
    const options = new firefox.Options();
    if (headless)
      options.addArguments("-headless");
    builder = builder.forBrowser("firefox").setFirefoxOptions(options);
  }

  if (!hub)
    builder = builder.usingServer(hub);

  return builder.build();
}


export async function getScreenshot(driver: WebDriver): Promise<Buffer> {
  return Buffer.from(await driver.takeScreenshot(), "base64");
}
