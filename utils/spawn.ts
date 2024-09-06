import { CurrentRuntime, Runtime } from "@cross/runtime";
import { writeFile } from "@cross/fs/io";
import process from "node:process";

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
export interface StdIO {
  /**
   * The input into the spawned process.
   */
  stdin: ReadableStream | null;

  /**
   * The output from the spawned process.
   */
  stdout: WritableStream | null;

  /**
   * The errors from the spawned process.
   */
  stderr: WritableStream | null;
}

// Runtime-specific execution functions (also using async/await)
async function spawnNodeChildProcess(
  command: string[],
  env: Record<string, string> = {},
  cwd?: string,
  stdio?: StdIO
): Promise<SpawnResult> {
  const { spawn } = await import("node:child_process");

  // Node has its own stream types
  const { Readable, Writable, PassThrough } = await import("node:stream");

  // Node doesn't seem to have any types for streams
  // deno-lint-ignore no-explicit-any
  let stdio_node: any[]

  let stdoutBuffer = "";
  let stderrBuffer = "";

  if (stdio) {
    stdio_node = [
      // @ts-ignore Node is a bit funny with types here
      stdio.stdin ? Readable.fromWeb(stdio.stdin) : "ignore",
      stdio.stdout ? Writable.fromWeb(stdio.stdout) : "ignore",
      stdio.stderr ? Writable.fromWeb(stdio.stderr) : "ignore",
    ];
  } else {
    const stdout = new PassThrough();
    const stderr = new PassThrough();

    stdio_node = ["ignore", stdout, stderr];

    stdout.on("data", (data: string) => stdoutBuffer += data.toString());
    stderr.on("data", (data: string) => stderrBuffer += data.toString());
  }

  const childProcess = spawn(
    command[0],
    command.length > 1 ? command.slice(1) : [],
    {
      env: { ...process.env, ...env },
      cwd: cwd,
      shell: false,
      stdio: stdio_node
    },
  );

  return new Promise((resolve, reject) => { // Still need Promise here due to event listeners
    childProcess.on("error", (error: Error) => reject(error));
    childProcess.on(
      "close",
      (code: number) => resolve({ code, stdout: stdoutBuffer, stderr: stderrBuffer }),
    );
  });
}

async function spawnDenoChildProcess(
  command: string[],
  env: Record<string, string> = {},
  cwd?: string,
  stdio?: StdIO
): Promise<SpawnResult> {
  // @ts-ignore Deno is specific to Deno
  const options: Deno.CommandOptions = {
    args: command.length > 1 ? command.slice(1) : [],
    env: { ...env },
    cwd,
    stdin: stdio?.stdin === null ? "null" : undefined,
    stdout: stdio?.stdout === null ? "null" : undefined,
    stderr: stdio?.stderr === null ? "null" : undefined,
  };

  const cmd = new Deno.Command(command[0], options);
  const childProcess = cmd.spawn();

  if (stdio) {
    if (stdio.stdin) stdio.stdin.pipeTo(childProcess.stdin);
    if (stdio.stdout) childProcess.stdout.pipeTo(stdio.stdout);
    if (stdio.stderr) childProcess.stderr.pipeTo(stdio.stderr);
  }

  const output = await childProcess.output()

  return {
    code: output.code,
    stdout: stdio ? "" : new TextDecoder().decode(output.stdout),
    stderr: stdio ? "" : new TextDecoder().decode(output.stderr),
  };
}

async function spawnBunChildProcess(
  command: string[],
  extraEnvVars: Record<string, string> = {},
  cwd?: string,
  stdio?: StdIO
): Promise<SpawnResult> {
  // @ts-ignore Bun is runtime specific
  const results = await Bun.spawn({
    cmd: command,
    // @ts-ignore process is runtime specific
    env: { ...process.env, ...extraEnvVars }, // Merge environment variables
    stdout: "pipe",
    stderr: "pipe",
    cwd,
  });

  // Convert ReadableStreams to strings
  await results.exited;

  // @ts-ignore Bun is runtime specific
  const stdout = await Bun.readableStreamToText(results.stdout);
  // @ts-ignore Bun is runtime specific
  const stderr = await Bun.readableStreamToText(results.stderr);

  return {
    code: results.exitCode,
    stdout,
    stderr,
  };
}

/**
 * Starts a child processes.
 *
 * @param {string[]} command - An array of strings representing the command and its arguments.
 * @param {Record<string, string>} [extraEnvVars] - An optional object containing additional environment variables to set for the command.
 * @param {string} [cwd] - An optional path specifying the current working directory for the command.
 * @returns {Promise<SpawnResult>} A Promise resolving with an object containing:
 *   * code: The exit code of the executed command.
 *   * stdout: The standard output of the command.
 *   * stderr: The standard error of the command.
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
export async function spawn(
  command: string[],
  extraEnvVars: Record<string, string> = {},
  cwd?: string,
): Promise<SpawnResult> {
  switch (CurrentRuntime) {
    case Runtime.Node:
      return await spawnNodeChildProcess(command, extraEnvVars, cwd);
    case Runtime.Deno:
      return await spawnDenoChildProcess(command, extraEnvVars, cwd);
    case Runtime.Bun:
      return await spawnBunChildProcess(command, extraEnvVars, cwd);
    default:
      throw new Error(`Unsupported runtime: ${CurrentRuntime}`);
  }
}
