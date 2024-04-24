import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Return the current process pid in a cross-runtime compatible manner.
 *
 * @example
 * // import { pid } from "@cross/utils";
 *
 * // Display the process pid
 * console.log(pid());
 */
export function pid(): number {
  if (CurrentRuntime === Runtime.Deno) {
    //@ts-ignore cross-runtime
    return Deno.pid;
  } else {
    //@ts-ignore cross-runtime
    return process.pid;
  }
}
