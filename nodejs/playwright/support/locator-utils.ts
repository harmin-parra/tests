import { expect, type Locator } from "@playwright/test";
import { sleep } from "./utils";


export async function waitFor(
  locator: Locator,
  state: "attached"|"detached"|"visible"|"hidden"|"enabled"|"disabled"|"value" = 'visible',
  timeout: number = 10_000,
  interval: number= 100
): Promise<void> {
  if (state == "attached" || state == "detached" || state == "visible" || state == "hidden")
    return locator.waitFor({ state: state, timeout: timeout });
  const start = Date.now();
  while (Date.now() - start < timeout) {
    switch (state) {
      case 'enabled':
        if (await locator.isEnabled({ timeout: timeout }))
          return;
        break;
      case 'disabled':
        if (await locator.isDisabled({ timeout: timeout }))
          return;
        break;
      case 'value':
        if (await locator.page().waitForFunction(
             (elem: any) => elem.value != '',
             locator.elementHandle(),
             { timeout: timeout }
           )
        )
          return;
        break;
    }
    await sleep(interval);
  }
  throw new Error(`Timeout: locator not ${state} within ${timeout}ms`);
}

export async function getElementValue(locator: Locator): Promise<string> {
  return await locator.evaluate((elem: any) => elem.value, { timeout: 3000 });
}

export async function isElementPresent(element: Locator) {
  return await element.isVisible();
}

export async function assertElementSelected(element: Locator) {
  await expect(element).toContainClass("isSelected");
}

export async function changeBackgroundColor(element: Locator, value: any = 'greenyellow') {
  await element.evaluate((elem, value) => {
    elem.style.backgroundColor = value;
  }, value);
}

export async function removeBackgroundColor(element: Locator) {
  await element.evaluate((elem) => {
    elem.style.removeProperty('background-color');
  });
}
