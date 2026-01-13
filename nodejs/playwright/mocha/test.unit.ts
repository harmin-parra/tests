import assert from "node:assert";
import { typeOf } from "./utils";


describe("typeOf Tests", function () {

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


  it("typeof number primitive", function () {
    const type = typeOf(123);
    assert(type == "Number", "verifying " + type);
  });


  it("typeof Number object", function () {
    const type = typeOf(Number(123));
    assert(type == "Number", "verifying " + type);
  });


  it("typeof boolean primitive", function () {
    const type = typeOf(true);
    assert(type == "Boolean", "verifying " + type);
  });


  it("typeof Boolean object", function () {
    const type = typeOf(Boolean(false));
    assert(type == "Boolean", "verifying " + type);
  });


  it("typeof string primitive", function () {
    const type = typeOf("hello");
    assert(type == "String", "verifying " + type);
  });


  it("typeof String object", function () {
    const type = typeOf(new String("Hello"));
    assert(type == "String", "verifying " + type);
  });


  it("typeof Object json", function () {
    const type = typeOf({});
    assert(type == "Object", "verifying " + type);
  });


  it("typeof Function", function () {
    const type = typeOf(() => {});
    assert(type == "Function", "verifying " + type);
  });

});
