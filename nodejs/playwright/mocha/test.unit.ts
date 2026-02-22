import assert from "node:assert";
import { typeOf } from "../support/utils";


describe("typeOf Tests", function () {

  it("typeof Array", function () {
    const type = typeOf([]);
    assert(_type == "Array", "verifying " + _type);
  });


  it("typeof Date", function () {
    const _type = typeOf(new Date());
    assert(_type == "Date", "verifying " + _type);
  });


  it("typeof Null", function () {
    const _type = typeOf(null);
    assert(_type == "Null", "verifying " + _type);
  });


  it("typeof Undefined", function () {
    const _type = typeOf(undefined);
    assert(_type == "Undefined", "verifying " + _type);
  });


  it("typeof String lowercase", function () {
    const _type = typeOf("hello");
    assert(_type == "String", "verifying " + _type);
  });


  it("typeof Number lowercase", function () {
    const _type = typeOf(123);
    assert(_type == "Number", "verifying " + _type);
  });


  it("typeof Set", function () {
    const _type = typeOf(new Set());
    assert(_type == "Set", "verifying " + _type);
  });

  it("typeof Map", function () {
    const _type = typeOf(new Map());
    assert(_type == "Map", "verifying " + _type);
  });

  it("typeof RegExp", function () {
    const _type = typeOf(/abc/);
    assert(_type == "RegExp", "verifying " + _type);
  });

  it("typeof literal Object", function () {
    const _type = typeOf({});
    assert(_type == "Object", "verifying " + _type);
  });


  it("typeof Number uppercase", function () {
    const _type = typeOf(new Number(123));
    assert(_type == "Number", "verifying " + _type);
  });

  it("typeof String uppercase", function () {
    const _type = typeOf(new String(12.78));
    assert(_type == "String", "verifying " + _type);
  });


  it("typeof Function", function () {
    const _type = typeOf(() => {});
    assert(_type == "Function", "verifying " + _type);
  });

  it("typeof Class", function () {
    class MyClass {}
    const _type = typeOf(new MyClass());
    assert(_type == "MyClass", "verifying " + _type);
  });

  it("typeof Sub Class", function () {
    class MySuperClass {}
    class MySubClass extends MySuperClass{}
    const _type = typeOf(new MySubClass());
    assert(_type == "MySubClass", "verifying " + _type);
  });

});
