/**
 * Functions that handle object manipulation.
 */

/**
 * Recursively freezes an object and all its nested objects.
 * Freezing an object prevents any modifications to its properties.
 *
 * @template T - The type of the object to freeze.
 * @param {T} obj - The object to freeze.
 * @param {boolean} [createCopy=false] - If true, returns a frozen deep copy of the object, leaving the original unchanged.
 * @returns {T} The frozen object (original if `createCopy` is false, copy otherwise).
 *
 * @example
 * const obj = { a: 1, b: { c: 2 } };
 * deepFreeze(obj);        // obj is now frozen
 * obj.a = 10; // Throws an error in strict mode
 *
 * const original = { x: 5, y: { z: 6 } };
 * const frozenCopy = deepFreeze(original, true); // frozenCopy is a new frozen object
 * frozenCopy.x = 20; // Throws an error in strict mode
 * original.x = 20;  // Succeeds, original is unchanged
 */
export function deepFreeze<T>(obj: T, createCopy = false): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const target = createCopy ? structuredClone(obj) : obj;
  Object.freeze(target);

  for (const prop in target) {
    if (Object.hasOwn(target, prop)) {
      const value = target[prop];
      if (
        typeof value === "object" && value !== null && !Object.isFrozen(value)
      ) {
        deepFreeze(value, createCopy);
      }
    }
  }

  return target;
}
/**
 * Recursively seals an object and all its nested objects.
 * Sealing an object prevents new properties from being added or removed,
 * but existing properties can still be modified if they are writable.
 *
 * @template T - The type of the object to seal.
 * @param {T} obj - The object to seal.
 * @param {boolean} [createCopy=false] - If true, returns a sealed deep copy of the object, leaving the original unchanged.
 * @returns {T} The sealed object (original if `createCopy` is false, copy otherwise).
 *
 * @example
 * const obj = { a: 1, b: { c: 2 } };
 * deepSeal(obj); // obj is now sealed
 * obj.a = 10; // Succeeds because 'a' is writable
 * obj.d = 4;  // Throws an error in strict mode
 * delete obj.a; // Throws an error in strict mode
 *
 * const original = { x: 5, y: { z: 6 } };
 * const sealedCopy = deepSeal(original, true); // sealedCopy is a new sealed object
 * sealedCopy.x = 20; // Succeeds because 'x' is writable
 * sealedCopy.w = 7;  // Throws an error in strict mode
 * original.w = 20;  // Succeeds, original is unchanged
 */
export function deepSeal<T>(obj: T, createCopy = false): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const target = createCopy ? structuredClone(obj) : obj;
  Object.seal(target);

  for (const prop in target) {
    if (Object.hasOwn(target, prop)) {
      const value = target[prop];
      if (
        typeof value === "object" && value !== null && !Object.isSealed(value)
      ) {
        deepSeal(value, false);
      }
    }
  }

  return target;
}
