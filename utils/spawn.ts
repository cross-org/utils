import { CurrentRuntime, Runtime } from "@cross/runtime";

import { spawn as spawnChild } from "node:child_process";
import { Readable, Writable } from "node:stream";

import process from "node:process";

if (CurrentRuntime === Runtime.Bun) {
  // Bun has a bug in Writable.fromWeb, so polyfill
  Writable.fromWeb = (writableStream) => {
    const writer = writableStream.getWriter();

    return new Writable({
      write(chunk) {
        writer.write(chunk);
      },
    });
  };
}

/**
 * Represents the results of a spawned child process.
 */
export interface SpawnResult {
  /**
   * The exit code of the executed command. A value of 0 typically indicates success.
   */
  code: number;

  /**
   * The standard output of the command.
   */
  stdout: string;

  /**
   * The standard error of the command.
   */
  stderr: string;
}

/**
 * Use to pass stdin, stdout and stderr to spawn() instead of getting all the
 * text at the end.
 */
export interface SpawnStdIO {
  /**
   * The input into the spawned process.
   */
  stdin: ReadableStream | "inherit" | null;

  /**
   * The output from the spawned process.
   */
  stdout: WritableStream | "inherit" | null;

  /**
   * The errors from the spawned process.
   */
  stderr: WritableStream | "inherit" | null;
}

/**
 * Starts a child processes.
 *
 * @param {string[]} command - An array of strings representing the command and its arguments.
 * @param {Record<string, string>} [env] - An optional object containing additional environment variables to set for the command.
 * @param {string} [cwd] - An optional path specifying the current working directory for the command.
 * @param {StdIO} [stdio] - An optional object specifying streams to use instead of buffering the output.
 * @returns {Promise<SpawnResult>} A Promise resolving with an object containing:
 *   * code: The exit code of the executed command.
 *   * stdout: The standard output of the command (empty if stdio argument supplied).
 *   * stderr: The standard error of the command (empty if stdio argument supplied).
 *
 * @throws {Error} If the current runtime is not supported.
 *
 * @example
 * const command = ["/bin/bash", "-c", "echo \"running a shell\""];
 *
 * try {
 *   const result = await spawn(command, { HOME: "/home/overridden/home/dir" });
 *   console.log("Return Code:", result.code);
 *   console.log("Stdout:", result.stdout);
 *   console.log("Stderr:", result.stderr);
 * } catch (error) {
 *   console.error(error);
 * }
 */
export function spawn(
  command: string[],
  env: Record<string, string> = {},
  cwd?: string,
  stdio?: SpawnStdIO,
): Promise<SpawnResult> {
  let stdoutBuffer = "";
  let stderrBuffer = "";

  if (!stdio) {
    stdio = {
      stdin: null,
      stdout: new WritableStream({
        write(chunk) {
          stdoutBuffer += chunk.toString();
        },
      }),
      stderr: new WritableStream({
        write(chunk) {
          stderrBuffer += chunk.toString();
        },
      }),
    };
  }

  const stdio_node: ("pipe" | "inherit" | "ignore")[] = [
    stdio.stdin === "inherit" ? "inherit" : stdio.stdin ? "pipe" : "ignore",
    stdio.stdout === "inherit" ? "inherit" : stdio.stdout ? "pipe" : "ignore",
    stdio.stderr === "inherit" ? "inherit" : stdio.stderr ? "pipe" : "ignore",
  ];

  const childProcess = spawnChild(
    command[0],
    command.length > 1 ? command.slice(1) : [],
    {
      env: { ...process.env, ...env },
      cwd: cwd,
      shell: false,
      stdio: stdio_node,
    },
  );

  if (stdio.stdin instanceof ReadableStream) {
    // @ts-ignore Node's types here are weird
    Readable.fromWeb(stdio.stdin).pipe(childProcess.stdin, { end: false });
  }

  if (stdio.stdout instanceof WritableStream) {
    // @ts-ignore Node's types here are weird
    childProcess.stdout.pipe(Writable.fromWeb(stdio.stdout), { end: false });
  }

  if (stdio.stderr instanceof WritableStream) {
    // @ts-ignore Node's types here are weird
    childProcess.stderr.pipe(Writable.fromWeb(stdio.stderr), { end: false });
  }

  return new Promise((resolve, reject) => { // Still need Promise here due to event listeners
    childProcess.on("error", (error: Error) => reject(error));
    childProcess.on(
      "close",
      (code: number) =>
        resolve({ code, stdout: stdoutBuffer, stderr: stderrBuffer }),
    );
  });
}
