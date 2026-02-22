import { expect, type Locator } from "@playwright/test";
import { NG_EVENT } from "./constants";
import { sleep } from "./utils";
import { stat } from "fs";


export async function waitFor(
  locator: Locator,
  options?: {
    state?: 'attached' | 'detached' | 'visible' | 'hidden' | 'enabled' | 'disabled' | 'value',
    timeout?: number,
    interval?: number
  }
): Promise<void> {
  let state = options?.state ?? 'visible';
  let timeout = options?.timeout ?? NG_EVENT;
  let interval = options?.interval ?? 500;

  if (state == "attached" || state == "detached" || state == "visible" || state == "hidden") {
    await locator.waitFor({ state: state, timeout: timeout });
    return;
  }

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
              // (elem: any) => elem != null && typeof elem.value === 'string' && elem.value != '',
              (elem: any) => (elem?.value ?? '').length > 0,
              await locator.elementHandle(),
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

export async function getElementValue(locator: Locator, timeout?: number): Promise<string> {
  return await locator.evaluate((elem: any) => elem.value, { timeout: timeout });
}

export async function isElementPresent(locator: Locator, timeout: number = 10_000): Promise<boolean> {
  let exists = false;
  try {
    await locator.waitFor({ state: 'attached', timeout: timeout });
    exists = true;
  } catch {
    exists = false;
  }
  return exists;
}

export async function isElementVisible(locator: Locator, timeout: number = 10_000): Promise<boolean> {
  let visible = false;
  try {
    await locator.waitFor({ state: 'visible', timeout: timeout });
    visible = true;
  } catch {
    visible = false;
  }
  return visible;
}

export async function assertElementSelected(locator: Locator, timeout?: number) {
  await expect(locator).toContainClass("isSelected", { timeout: timeout});
}

export async function changeBackgroundColor(locator: Locator, value: any = 'greenyellow') {
  await locator.evaluate((elem, value) => {
    elem.style.backgroundColor = value;
  }, value);
}

export async function removeBackgroundColor(locator: Locator) {
  await locator.evaluate((elem) => {
    elem.style.removeProperty('background-color');
  });
}
