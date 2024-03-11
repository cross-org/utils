import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Retrieves command-line arguments in a cross-runtime compatible manner.
 *
 * @param {boolean} all A boolean indicating if all arguments should be passed, including script name and executable.
 *
 * @returns {string[]} An array containing the command-line arguments.
 * @example
 * // import { args } from "@cross/utils";
 *
 * const args = args();
 * console.log("Arguments:", args);
 */
export function args(all: boolean = false): string[] {
  if (CurrentRuntime === Runtime.Deno) {
    if (all) {
      // Construct 'fake' executable and script name based on Deno.execPath() and Deno.mainModule
      // @ts-ignore Cross Runtime
      const executable = Deno.execPath();
      // @ts-ignore Cross Runtime
      const script = Deno.mainModule;
      // @ts-ignore Cross Runtime
      return [executable, script, ...Deno.args];
    } else {
      // @ts-ignore Cross Runtime
      return Deno.args;
    }
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    // @ts-ignore Cross Runtime
    if (all) {
      // @ts-ignore Cross Runtime
      return process.argv;
    } else {
      // @ts-ignore Cross Runtime
      return process.argv.slice(2); // Skip the first two arguments (executable and script name)
    }
  } else {
    console.error("Cannot determine runtime. Argument retrieval unavailable.");
    return [];
  }
}
