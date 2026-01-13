import { type Locator } from "@playwright/test";
import { changeBackgroundColor, removeBackgroundColor } from "./locator-utils";
import { Attach } from "./allure-utils";


export class SoftAssert {

  private errors: string[] = [];

  /**
   * Generic soft assertion that logs success or failure.
   */
  async assert(condition: boolean | (() => Promise<boolean> | boolean), description: string = ''): Promise<void> {
    try {
      const result = typeof condition === 'function' ? await condition() : condition;

      if (!result) throw new Error('Condition failed');

      console.log(`✅ PASS: ${description}`);
    } catch (error: any) {
      console.error(`❌ FAIL: ${description} → ${error.message}`);
      this.errors.push(`${description}: ${error.message}`);
    }
  }

  /**
   * Check if two values are equal.
   */
  async equals<T>(actual: T, expected: T, description: string = ''): Promise<void> {
    if (actual !== expected) {
      console.error(`❌ FAIL: ${description}`);
      console.error(`   Expected: ${expected}, but got: ${actual}`);
      this.errors.push(`${description}: Expected ${expected}, got ${actual}`);
    } else {
      console.log(`✅ PASS: ${description}`);
    }
  }

  /**
   * Assert that a value is true.
   */
  async isTrue(value: boolean, description: string = ''): Promise<void> {
    await this.assert(value === true, description);
  }

  /**
   * Assert that a value is false.
   */
  async isFalse(value: boolean, description: string = ''): Promise<void> {
    await this.assert(value === false, description);
  }

  /**
   * At the end of the test, verify all soft assertions.
   */
  async verifyAll(): Promise<void> {
    if (this.errors.length > 0) {
      console.error('\n❌ Soft assertion failures:');
      this.errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
      throw new Error(`Soft assertions failed (${this.errors.length})`);
    } else {
      console.log('\n✅ All soft assertions passed!');
    }
  }

  async assertLocator(locator: Locator, description: string) {
    try {
      await locator.waitFor();
      const visible = await locator.isVisible();
      await this.assert(visible, description);
      if (visible) {
        const bg = await locator.evaluate(element => element.style.backgroundColor);
        await changeBackgroundColor(locator);
        //await locator.page().waitForTimeout(pause)
        await Attach.image(locator.page(), description);
        await removeBackgroundColor(locator);
        //await locator.page().waitForTimeout(pause);
        await changeBackgroundColor(locator, bg);
      }
    } catch(error) {
      await this.assert(false, description);
      console.error(error.toString());
    }
  }

}
