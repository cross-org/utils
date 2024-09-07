import { CurrentRuntime, Runtime } from "@cross/runtime";

import process from "node:process";
import { Readable, Writable } from "node:stream";

if (CurrentRuntime === Runtime.Bun) {
  // Bun has a bug in Writable.toWeb, so polyfill
  Writable.toWeb = (streamWritable) => {
    return new WritableStream({
      write(chunk) {
        streamWritable.write(chunk);
      },
    });
  };
}

/**
 * Get the stdin as a web-standard `ReadableStream` object.
 * @returns the stdin stream
 */
// @ts-ignore Node has strange typings on Stream objects
export const stdin = (): ReadableStream => Readable.toWeb(process.stdin);

/**
 * Get the stdout as a web-standard `WritableStream` object.
 * @returns the stdout stream
 */
export const stdout = (): WritableStream => Writable.toWeb(process.stdout);

/**
 * Get the stderr as a web-standard `WritableStream` object.
 * @returns the stderr stream
 */
export const stderr = (): WritableStream => Writable.toWeb(process.stderr);
