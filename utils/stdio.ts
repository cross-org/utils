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

// @ts-ignore Node has strange typings on Stream objects
export const stdin = (): ReadableStream => (Readable.toWeb(process.stdin));
export const stdout = (): WritableStream => Writable.toWeb(process.stdout);
export const stderr = (): WritableStream => Writable.toWeb(process.stderr);
