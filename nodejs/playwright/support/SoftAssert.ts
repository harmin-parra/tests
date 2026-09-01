import { expect, type Locator } from "@playwright/test";
import { changeBackgroundColor, removeBackgroundColor } from "./locator-utils";
import { Attach } from "./allure-utils";


type ErrorConstructor<T extends Error> = new (...args: any[]) => T;


export class SoftAssert {

  private errors: string[] = [];
  private verification_pending = false;

  /**
   * Generic soft assertion that logs success or failure.
   */
  verify(condition: boolean, description?: string): void {
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

  /**
   * Assert that a value is nullish (null or undefined).
   */
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

  /**
   * Assert that a value is not nullish (null or undefined).
   */
  exist<T>(value: T, description?: string): void {
    if (value == null) {
      console.error(`❌ FAIL: ${description ?? 'Condition failed'}`);
      console.error(`   Expected: !(null|undefined), but got: ${value}`);
      this.errors.push(`${description ?? 'Condition failed'}: Expected: !(null|undefined), got ${value}`);
    } else {
      console.log(`✅ PASS: ${description ?? 'Condition passed'}`);
    }
    this.verification_pending = true;
  }

  /**
   * Verify if an expression throws an exception.
   * @param fn A function with the expression to evaluate.
   * @param exception The Exception type to verify.
   * @param description The description for the assertion log.
   */
  // throws<T extends Error>(fn: (...args: unknown[]) => unknown, ex: new (...args: any[]) => T, description?: string) {
  raise<T extends Error>(fn: (...args: unknown[]) => unknown, exception: ErrorConstructor<T>, description?: string) {
    try {
      fn()
      console.log(`❌ FAIL: ${description ?? 'Expected exception not thrown'}`);
      console.log(`   Expected ${exception.name}, but nothing got thrown`);
      this.errors.push(`${description ?? 'Expected exception not thrown'}: Expected: ${exception.name}, nothing got thrown`);
    } catch(error) {
      if (error instanceof exception) {
        console.log(`✅ PASS: ${description ?? 'Expected exception thrown'}`)
      } else {
        const actual = error instanceof Error ? error.constructor.name : typeof error;
        const message = error instanceof Error ? error.message : String(error);
        console.log(`❌ FAIL: ${description ?? 'Unexpected exception thrown'}`);
        console.log(`   Expected ${exception.name}, but got ${actual}: ${message}`);
        this.errors.push(`${description ?? 'Unexpected exception thrown'}: Expected: ${exception.name}, got: ${actual}`);
      }
    } finally {
      this.verification_pending = true;
    }
  }

  /**
   * Verify if an expression does not throw an exception.
   * @param fn A function with the expression to evaluate.
   * @param exception The Exception type to verify.
   * @param description The description for the assertion log.
   */
  doesNotRaise<T extends Error>(fn: (...args: unknown[]) => unknown, exception: ErrorConstructor<T>, description?: string) {
    try {
      fn()
      console.log(`✅ PASS: ${description ?? 'Expected exception not thrown'}`);
    } catch(error) {
      if (!(error instanceof exception)) {
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
      throw new Error("Soft assertions failed");
    } else if (this.verification_pending) {
      console.log('\n✅ All soft assertions passed!');
    }
    // expect(this.errors.length, "Soft assertions failed").toBe(0);
    // reset for further use
    this.errors = [];
    this.verification_pending = false;
  }

  async verifyLocator(locator: Locator, description: string) {
    let visible = null;
    try {
      await locator.waitFor();
      visible = await locator.isVisible();
      this.verify(visible, description);
      if (visible) {
        const bg = await locator.evaluate(element => element.style.backgroundColor);
        await changeBackgroundColor(locator);
        await Attach.image(locator.page(), description);
        await removeBackgroundColor(locator);
        await changeBackgroundColor(locator, bg);
      }
    } catch(error) {
      this.verify(false, description);
      console.error(error.toString());
    }
  }

}
