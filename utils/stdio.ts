import { CurrentRuntime, Runtime } from "@cross/runtime";

import process from "node:process";
import { Readable, Writable } from "node:stream";

if (CurrentRuntime === Runtime.Bun) {
  // Bun has a bug in Writable.toWeb, so polyfill
  Writable.toWeb = (streamWritable) => {
    return new WritableStream({
        write(chunk) {
          streamWritable.write(chunk)
        },
    });
  }
}

export const stdin = () => (Readable.toWeb(process.stdin) as ReadableStream);
export const stdout = () => Writable.toWeb(process.stdout);
export const stderr = () => Writable.toWeb(process.stderr);