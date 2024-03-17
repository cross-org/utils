import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Terminates the current process in a cross-runtime compatible manner.
 *
 * @param {number} code - Optional exit code (defaults to 0).
 * @throws
 * @example
 * // import { exit } from "@cross/utils";
 *
 * // Exit with code 0
 * exit();
 *
 * // Exit with code 1
 * exit(1);
 */
export function exit(code = 0) {
  if (CurrentRuntime === Runtime.Deno) {
    // @ts-ignore Cross Runtime@
    Deno.exit(code);
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    // @ts-ignore Cross Runtime
    process.exit(code);
  } else {
    throw new Error(
      "Cannot determine runtime. Exit functionality unavailable.",
    );
  }
}
