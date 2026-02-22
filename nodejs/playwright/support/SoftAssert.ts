import { type Locator } from "@playwright/test";
import { changeBackgroundColor, removeBackgroundColor } from "./locator-utils";
import { Attach } from "./allure-utils";


type ErrorConstructor<T extends Error> = new (...args: any[]) => T;


export class SoftAssert {

  private errors: string[] = [];
  private verification_pending = false;

  /**
   * Generic soft assertion that logs success or failure.
   */
  assert(condition: boolean, description?: string): void {
    try {
      if (!condition) throw new Error();
      console.log(`✅ PASS: ${description ?? 'Assertion passed'}`);
    } catch (error: any) {
      console.error(`❌ FAIL: ${description ?? 'Assertion failed'}`);
      this.errors.push(`${description ?? 'Assertion failed'}`);
    }
    this.verification_pending = true;
  }

  /**
   * Check if two values are equal.
   */
  equal<T>(actual: T, expected: T, description?: string): void {
    if (actual !== expected) {
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
  notEqual<T>(actual: T, expected: T, description?: string): void {
    if (actual === expected) {
      console.error(`❌ FAIL: ${description ?? 'Condition failed'}`);
      console.error(`   Expected: !${expected}, but got: ${actual}`);
      this.errors.push(`${description ?? 'Condition failed'}: Expected: !${expected}, got: ${actual}`);
    } else {
      console.log(`✅ PASS: ${description ?? 'Condition passed'}`);
    }
    this.verification_pending = true;
  }

  /**
   * Assert that a condition is true.
   */
  true(condition: boolean, description?: string): void {
    this.equal(condition, true, description);
    this.verification_pending = true;
  }

  /**
   * Assert that a condition is false.
   */
  false(condition: boolean, description?: string): void {
    this.equal(condition, false, description);
    this.verification_pending = true;
  }

  doesNotExist<T>(value: T, description?: string): void {
    if (value != null) {
      console.error(`❌ FAIL: ${description ?? 'Condition failed'}`);
      console.error(`   Expected: null|undefined, but got: ${value}`);
      this.errors.push(`${description ?? 'Condition failed'}: Expected: null|undefined, got ${value}`);
    } else {
      console.log(`✅ PASS: ${description ?? 'Condition passed'}`);
    }
    this.verification_pending = true;
  }

  exits<T>(value: T, description?: string): void {
    if (value == null) {
      console.error(`❌ FAIL: ${description ?? 'Condition failed'}`);
      console.error(`   Expected: !(null|undefined), but got: ${value}`);
      this.errors.push(`${description ?? 'Condition failed'}: Expected: !(null|undefined), got ${value}`);
    } else {
      console.log(`✅ PASS: ${description ?? 'Condition passed'}`);
    }
    this.verification_pending = true;
  }

  // throws<T extends Error>(fn: (...args: unknown[]) => unknown, ex: new (...args: any[]) => T, description?: string) {
  throws<T extends Error>(fn: (...args: unknown[]) => unknown, ex: ErrorConstructor<T>, description?: string) {
    try {
      fn()
      console.log(`❌ FAIL: ${description ?? 'Expected exception not thrown'}`);
      console.log(`   Expected ${ex.name}, but nothing got thrown`);
      this.errors.push(`${description ?? 'Expected exception not thrown'}: Expected: ${ex.name}, nothing got thrown`);
    } catch(error) {
      if (error instanceof ex) {
        console.log(`✅ PASS: ${description ?? 'Expected exception thrown'}`)
      } else {
        const actual = error instanceof Error ? error.constructor.name : typeof error;
        const message = error instanceof Error ? error.message : String(error);
        console.log(`❌ FAIL: ${description ?? 'Unexpected exception thrown'}`);
        console.log(`   Expected ${ex.name}, but got ${actual}: ${message}`);
        this.errors.push(`${description ?? 'Unexpected exception thrown'}: Expected: ${ex.name}, got: ${actual}`);
      }
    } finally {
      this.verification_pending = true;
    }
  }

  // throws<T extends Error>(fn: (...args: unknown[]) => unknown, ex: new (...args: any[]) => T, description?: string) {
  doesNotThrow<T extends Error>(fn: (...args: unknown[]) => unknown, ex: ErrorConstructor<T>, description?: string) {
    try {
      fn()
      console.log(`✅ PASS: ${description ?? 'Expected exception not thrown'}`);
    } catch(error) {
      if (!(error instanceof ex)) {
        console.log(`✅ PASS: ${description ?? 'Expected exception not thrown'}`)
      } else {
        const actual = error instanceof Error ? error.constructor.name : typeof error;
        const message = error instanceof Error ? error.message : String(error);
        console.log(`❌ FAIL: ${description ?? 'Unexpected exception thrown'}`);
        console.log(`   Unexpected ${actual}: ${message}`);
        this.errors.push(`${description ?? 'Unexpected exception thrown'}: ${actual}`);
      }
    } finally {
      this.verification_pending = true;
    }
  }

  /**
   * At the end of the test, verify all soft assertions.
   */
  verifyAll(): void {
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
      this.assert(visible, description);
      if (visible) {
        const bg = await locator.evaluate(element => element.style.backgroundColor);
        await changeBackgroundColor(locator);
        await Attach.image(locator.page(), description);
        await removeBackgroundColor(locator);
        await changeBackgroundColor(locator, bg);
      }
    } catch(error) {
      this.assert(false, description);
      console.error(error.toString());
    }
  }

}
