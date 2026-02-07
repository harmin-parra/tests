import { type Locator } from "@playwright/test";
import { changeBackgroundColor, removeBackgroundColor } from "./locator-utils";
import { Attach } from "./allure-utils";


export class SoftAssert {

  private errors: string[] = [];
  private verification_pending = false;

  /**
   * Generic soft assertion that logs success or failure.
   */
  async assert(condition: boolean | Promise<boolean>, description?: string): Promise<void> {
    try {
      const result = await condition;
      if (!result) throw new Error();
      console.log(`✅ PASS: ${description ?? 'Condition passed'}`);
    } catch (error: any) {
      console.error(`❌ FAIL: ${description ?? 'Condition failed'}`);
      this.errors.push(`${description ?? 'Condition failed'}`);
    }
    this.verification_pending = true;
  }

  /**
   * Check if two values are equal.
   */
  async equals<T>(actual: T, expected: T, description?: string): Promise<void> {
    if (await actual !== await expected) {
      console.error(`❌ FAIL: ${description ?? 'Condition failed'}`);
      console.error(`   Expected: ${expected}, but got: ${actual}`);
      this.errors.push(`${description ?? 'Condition failed'}: Expected ${expected}, got ${actual}`);
    } else {
      console.log(`✅ PASS: ${description ?? 'Condition passed'}`);
    }
    this.verification_pending = true;
  }

  /**
   * Check if two values are not equal.
   */
  async notEquals<T>(actual: T, expected: T, description?: string): Promise<void> {
    if (await actual === await expected) {
      console.error(`❌ FAIL: ${description ?? 'Condition failed'}`);
      console.error(`   Unexpected: ${actual}`);
      this.errors.push(`${description ?? 'Condition failed'}: Expected ${expected}, got ${actual}`);
    } else {
      console.log(`✅ PASS: ${description ?? 'Condition passed'}`);
    }
    this.verification_pending = true;
  }

  /**
   * Assert that a value is true.
   */
  async isTrue(value: boolean | Promise<boolean>, description?: string): Promise<void> {
    await this.assert(await value === true, description);
    this.verification_pending = true;
  }

  /**
   * Assert that a value is false.
   */
  async isFalse(value: boolean | Promise<boolean>, description?: string): Promise<void> {
    await this.assert(await value === false, description);
    this.verification_pending = true;
  }

  /**
   * At the end of the test, verify all soft assertions.
   */
  async verifyAll(): Promise<void> {
    if (this.errors.length > 0) {
      console.error('\n❌ Soft assertion failures:');
      this.errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
      throw new Error(`Soft assertions failed`);
    } else if (this.verification_pending) {
      console.log('\n✅ All soft assertions passed!');
    }
    // reset for further use
    this.errors = [];
    this.verification_pending = false;
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
