import { assertEquals, assertThrows } from "@std/assert";
import { test } from "@cross/test";
import { deepFreeze, deepSeal } from "./objectManip.ts";

// deepFreeze Tests

test("deepFreeze() freezes object and nested objects", () => {
  const obj = { a: 1, b: { c: 2 } };
  const frozenObj = deepFreeze(obj);

  assertEquals(Object.isFrozen(frozenObj), true);
  assertEquals(Object.isFrozen(frozenObj.b), true);

  assertThrows(() => {
    frozenObj.a = 10;
  }, TypeError);
  assertThrows(() => {
    frozenObj.b.c = 3;
  }, TypeError);
});

test("deepFreeze(createCopy = true) returns a frozen copy, leaves original unchanged", () => {
  const original = { x: 5, y: { z: 6 } };
  const frozenCopy = deepFreeze(original, true);

  assertEquals(Object.isFrozen(frozenCopy), true);
  assertEquals(original.x, 5); // Original is not frozen

  assertThrows(() => {
    frozenCopy.x = 20;
  }, TypeError);
  original.x = 20; // Succeeds for the original
});

test("deepFreeze() handles null and non-objects", () => {
  assertEquals(deepFreeze(null), null);
  assertEquals(deepFreeze(undefined), undefined);
  assertEquals(deepFreeze(5), 5);
});

// deepSeal Tests

test("deepSeal() seals object and nested objects", () => {
  interface TestObject {
    a?: number;
    b: { c: number };
    d?: number;
  }

  const obj: TestObject = { a: 1, b: { c: 2 } };
  const sealedObj: TestObject = deepSeal(obj);

  assertEquals(Object.isSealed(sealedObj), true);
  assertEquals(Object.isSealed(sealedObj.b), true);

  assertThrows(() => {
    sealedObj.d = 4;
  }, TypeError);
  assertThrows(() => {
    delete sealedObj.a;
  }, TypeError);
});

test("deepSeal(createCopy = true) returns a sealed copy, leaves original unchanged", () => {
  // Test insterface that allows for the test cases.
  interface TestObject {
    x?: number;
    y: { z: number };
    w?: number;
  }
  const original: TestObject = { x: 5, y: { z: 6 } };
  const sealedCopy: TestObject = deepSeal(original, true);

  assertEquals(Object.isSealed(sealedCopy), true);
  assertEquals(original.x, 5); // Original is not sealed

  assertThrows(() => {
    sealedCopy.w = 7;
  }, TypeError);
  original.w = 7; // Succeeds for the original
});

test("deepSeal() handles null and non-objects", () => {
  assertEquals(deepSeal(null), null);
  assertEquals(deepSeal(undefined), undefined);
  assertEquals(deepSeal(5), 5);
  assertEquals(deepSeal({}), {});
});
