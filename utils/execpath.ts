import { CurrentRuntime, Runtime } from "@cross/runtime";
import { which } from "@cross/fs/stat";
import process from "node:process";

/**
 * Cross-runtime compatible way to return the current executable path in a  manner, regardless of Node, Deno or Bun.
 *
 * @returns {string} The current working directory path.
 * @throws
 * @example
 * // import { execPath } from "@cross/utils";
 *
 * const currentExecPath = execPath();
 * console.log("The path to the current runtime executable is :", currentExecPath);
 */
export function execPath(): Promise<string> {
  if (CurrentRuntime === Runtime.Deno) {
    //@ts-ignore cross-runtime
    return Deno.execPath();
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    //@ts-ignore cross-runtime
    return process.execPath();
  } else {
    throw new Error(
      `Cannot determine execPath using current runtime ('${CurrentRuntime}').`,
    );
  }
}

/**
 * Cross-runtime compatible way to return the current executable path,
 * prioritizing the executable's location within the user's PATH environment variable.
 * This could result in a more generic path (e.g., `/home/.../nvm/current/node`) than the
 * runtime's actual path (`/home/.../nvm/<version>/node`).
 *
 * @returns {string} The resolved executable path.
 * @throws {Error} If the runtime executable cannot be found within the PATH.
 * @example
 * // import { resolvedExecPath } from "@cross/utils";
 *
 * const currentExecPath = await resolvedExecPath();
 * console.log("The path to the current runtime executable is:", currentExecPath);
 */
export async function resolvedExecPath(): Promise<string> {
  if (CurrentRuntime === Runtime.Deno) {
    const foundDeno = await which("deno");
    if (foundDeno !== null) {
      return foundDeno;
    } else {
      //@ts-ignore cross-runtime
      return Deno.execPath();
    }
  } else if (CurrentRuntime === Runtime.Node) {
    const foundNode = await which("node");
    if (foundNode !== null) {
      return foundNode;
    } else {
      //@ts-ignore cross-runtime
      return process.execPath();
    }
  } else if (CurrentRuntime === Runtime.Bun) {
    const foundBun = await which("bun");
    if (foundBun !== null) {
      return foundBun;
    } else {
      //@ts-ignore cross-runtime
      return process.execPath();
    }
  } else {
    throw new Error(
      `Cannot determine execPath using current runtime ('${CurrentRuntime}').`,
    );
  }
}
