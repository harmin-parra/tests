import { World } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { Catalog } from '../model/catalog';


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
    const browser = await chromium.launch();
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
