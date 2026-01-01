import assert from "node:assert";
import { typeOf } from "./utils";


describe("Unit Tests", function () {

  it("typeof Array", function () {
    const type = typeOf([]);
    assert(type == "Array", "verifying " + type);
  });


  it("typeof Date", function () {
    const type = typeOf(new Date());
    assert(type == "Date", "verifying " + type);
  });


  it("typeof Null", function () {
    const type = typeOf(null);
    assert(type == "Null", "verifying " + type);
  });


  it("typeof Undefined", function () {
    const type = typeOf(undefined);
    assert(type == "Undefined", "verifying " + type);
  });


  it("typeof Number lowercase", function () {
    const type = typeOf(123);
    assert(type == "Number", "verifying " + type);
  });


  it("typeof Number uppercase", function () {
    const type = typeOf(Number(123));
    assert(type == "Number", "verifying " + type);
  });


  it("typeof Object json", function () {
    const type = typeOf({});
    assert(type == "Object", "verifying " + type);
  });


  it("typeof String uppercase", function () {
    const type = typeOf(new String(12.78));
    assert(type == "String", "verifying " + type);
  });


  it("typeof String lowercase", function () {
    const type = typeOf("hello");
    assert(type == "String", "verifying " + type);
  });


  it("typeof Function", function () {
    const type = typeOf(() => {});
    assert(type == "Function", "verifying " + type);
  });

});
