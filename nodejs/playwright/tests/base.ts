import { test as base, expect, type Locator, type Page } from '@playwright/test';
import { DBFixture, dbFixture, PageFixture, pageFixture, SoftAssertFixture, softAssertFixture } from '../support/fixtures';


export { expect, type Locator, type Page };

export const test = base
  .extend<PageFixture>(pageFixture)
  .extend<SoftAssertFixture>(softAssertFixture)
  .extend<DBFixture>(dbFixture);
