import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import firefox from "selenium-webdriver/firefox.js";
import edge from "selenium-webdriver/edge.js";


function getBrowserName(): string {
  const arg = process.argv.find(a => a.startsWith("--browser="));
  if (!arg)
    return "firefox";
  let value = arg.split("=")[1].toLowerCase();
  const supported = ["chrome", "firefox", "edge", "chromium"];
  if (!supported.includes(value))
    value = "firefox";
  return value;
}


function getHeadlessOption(): boolean {
  return process.argv.includes("--headless");
}


export async function getWebDriver(): Promise<WebDriver> {
  const browser = getBrowserName();
  const headless = getHeadlessOption();

  let builder = new Builder();
  
  if (browser === "chrome") {
    const options = new chrome.Options();
    options.addArguments("--disable-gpu", "--window-size=1920,1080");
    if (headless) options.addArguments("--headless=new");
    builder = builder.forBrowser("chrome").setChromeOptions(options);
  } 
  else if (browser === "edge") {
    const options = new edge.Options();
    options.addArguments("--disable-gpu", "--window-size=1920,1080");
    if (headless) options.addArguments("--headless=new");
    builder = builder.forBrowser("MicrosoftEdge").setEdgeOptions(options);
  }
  else if (browser === "chromium") {
    const options = new chrome.Options();
    options.setChromeBinaryPath("/usr/bin/chromium");  // adjust path if needed
    options.addArguments("--disable-gpu", "--window-size=1920,1080");
    if (headless) options.addArguments("--headless=new");
    builder = builder.forBrowser("chrome").setChromeOptions(options);
  } 
  else { // firefox
    const options = new firefox.Options();
    if (headless) options.addArguments("-headless");
    builder = builder.forBrowser("firefox").setFirefoxOptions(options);
  }

  return builder.build();
}
