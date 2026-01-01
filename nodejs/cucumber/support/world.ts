import { World } from '@cucumber/cucumber';
import { chromium, firefox, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { Catalog } from '../model/catalog';
import { getBrowserName, getHeadlessOption } from "./argv"


export class CustomWorld extends World {
  ui?: UiContext;
  api?: Catalog;
}

export class UiContext {

  constructor(
    public browser: Browser,
    public context: BrowserContext,
    public page: Page
  ) {}

  static async create(sharedBrowser: Browser): Promise<UiContext> {
    const envBrowser = getBrowserName();
    const envHeadless = getHeadlessOption();
    let browser = null;
    switch(envBrowser) {
      case 'chromium':
        browser = await chromium.launch({ headless: envHeadless });
        break;
      default:
        browser = await firefox.launch({ headless: envHeadless });
        break;
    }
    const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
    const page = await context.newPage();
    return new UiContext(browser, context, page);
  }

  async dispose() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}
