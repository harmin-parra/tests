import assert from "node:assert";
import { SoftAssert } from "../support/SoftAssert";


function getPromiseValue<T>(value: T): Promise<T> {
  return new Promise(resolve => {
    resolve(value);
  });
}


describe("SoftAssert tests", function () {

  it("Equals values passed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.equal(2, 2);
    soft_assert.equal("hello", "hello");
    soft_assert.verifyAll();
  });

  it("Equals promises passed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.equal(await getPromiseValue(5), await getPromiseValue(5));
    soft_assert.equal(await getPromiseValue("hello"), await getPromiseValue("hello"));
    try {
      soft_assert.verifyAll();
    } catch (error) { assert.fail("Test failed"); }
  });

  it("Equals values failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.equal(2, 3);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("Equals promises failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.equal(await getPromiseValue("Hello"), await getPromiseValue("Bye"));
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });


  it("NotEquals values passed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.notEqual(2, 3);
    soft_assert.notEqual("hello", "bye");
    soft_assert.verifyAll();
  });

  it("NotEquals promises passed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.notEqual(await getPromiseValue(5.3), await getPromiseValue(5.9));
    soft_assert.notEqual(await getPromiseValue("hello"), await getPromiseValue("bye"));
    try {
      soft_assert.verifyAll();
    } catch (error) { assert.fail("Test failed"); }
  });

  it("NotEquals values failed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.notEqual(2, 2);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("NotEquals promises failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.equal(await getPromiseValue("Hello"), await getPromiseValue("Hello"));
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });


  it("True value passed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.true(2 == 2);
    soft_assert.true("hello" == "hello");
    soft_assert.verifyAll();
  });

  it("True promise passed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.true(await getPromiseValue(true));
    try {
      soft_assert.verifyAll();
    } catch (error) { assert.fail("Test failed"); }
  });

  it("True value failed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    let a = 2, b = 3;
    soft_assert.true(a == b);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("True promise failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.true(await getPromiseValue(false));
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });


  it("False value passed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    let a = 2, b = 3;
    soft_assert.false(a == b);
    soft_assert.verifyAll();
  });

  it("False promise passed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.false(await getPromiseValue(false));
    try {
      soft_assert.verifyAll();
    } catch (error) { assert.fail("Test failed"); }
  });

  it("False value failed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.false(5.3 == 5.3);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("False promise failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.false(await getPromiseValue(true));
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });


  it("Assert value passed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.verify(true);
    soft_assert.verifyAll();
  });

  it("Assert promise passed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.verify(await getPromiseValue(true));
    try {
      soft_assert.verifyAll();
    } catch (error) { assert.fail("Test failed"); }
  });

  it("Assert value failed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.verify(false);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("Assert promise failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.verify(await getPromiseValue(false));
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });


  it("Null value passed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.doesNotExist(null);
    soft_assert.verifyAll();
  });

  it("Null promise passed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.doesNotExist(await getPromiseValue(null));
    try {
      soft_assert.verifyAll();
    } catch (error) { assert.fail("Test failed"); }
  });

  it("Null value failed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.doesNotExist(2);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("Null promise failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.doesNotExist(await getPromiseValue(3));
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });


  it("Undefined value passed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.doesNotExist(undefined);
    soft_assert.verifyAll();
  });

  it("Undefined promise passed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.doesNotExist(await getPromiseValue(undefined));
    try {
      soft_assert.verifyAll();
    } catch (error) { assert.fail("Test failed"); }
  });


  it("NotNull value passed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.exist(2);
    soft_assert.verifyAll();
  });

  it("NotNull promise passed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.exist(await getPromiseValue("abc"));
    soft_assert.verifyAll();
  });

  it("NotNull value failed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.exist(null);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("NotNull promise failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.exist(await getPromiseValue(null));
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("NotUndefined value failed", function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.exist(undefined);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("NotUndefined promise failed", async function () {
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.exist(await getPromiseValue(undefined));
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  });

  it("Throw passed", function () {
    function foo() {
      throw new SyntaxError();
    }
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.raise(foo, SyntaxError);
    try {
      soft_assert.verifyAll();
    } catch (error) {
      assert.fail("Test failed");
    }
  })

  it("Throw unexpected failed", function () {
    function foo() {
      throw new SyntaxError();
    }
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.raise(foo, RangeError);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) {
    }
  })

  it("Throw failed: no exception", function () {
    function foo() { }
    let soft_assert: SoftAssert = new SoftAssert();
    soft_assert.raise(foo, RangeError);
    try {
      soft_assert.verifyAll();
      assert.fail("Test failed");
    } catch (error) { }
  })
});
