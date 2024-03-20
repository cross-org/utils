import { CurrentRuntime, Runtime } from "@cross/runtime";


// Runtime-specific execution functions (also using async/await)
async function spawnNodeChildProcess(
  command: string[],
  env: Record<string, string> = {},
  cwd?: string,
): Promise<{ code: number; stdout: string; stderr: string }> {
  const { spawn } = await import("node:child_process");
  //@ts-ignore Node specific
  const options: SpawnOptionsWithoutStdio = {
    env,
    cwd: cwd,
    shell: false,
  };
  const childProcess = spawn(
    command[0],
    command.length > 1 ? command.slice(1) : [],
    options,
  );

  let stdout = "";
  let stderr = "";

  childProcess.stdout.on("data", (data: string) => stdout += data.toString());
  childProcess.stderr.on("data", (data: string) => stderr += data.toString());

  return new Promise((resolve, reject) => { // Still need Promise here due to event listeners
    childProcess.on("error", (error: Error) => reject(error));
    childProcess.on(
      "close",
      (code: number) => resolve({ code, stdout, stderr }),
    );
  });
}

async function spawnDenoChildProcess(
  command: string[],
  env: Record<string, string> = {},
  cwd?: string,
): Promise<{ code: number; stdout: string; stderr: string }> {
  // @ts-ignore Deno is specific to Deno
  const options: Deno.CommandOptions = {
    args: command.length > 1 ? command.slice(1) : [],
    env: { ...env },
    cwd,
  };
  const cmd = new Deno.Command(command[0], options);
  const output = await cmd.output();
  return {
    code: output.code,
    stdout: new TextDecoder().decode(output.stdout),
    stderr: new TextDecoder().decode(output.stderr),
  };
}

async function spawnBunChildProcess(
  command: string[],
  extraEnvVars: Record<string, string> = {},
  cwd?: string,
): Promise<{ code: number; stdout: string; stderr: string }> {
  // @ts-ignore Bun is runtime specific
  const results = await Bun.spawn({
    cmd: command,
    // @ts-ignore process is runtime specific
    env: { ...extraEnvVars }, // Merge environment variables
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
 * @returns {Promise<{ code: number; stdout: string; stderr: string }>} A Promise resolving with an object containing:
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
): Promise<{ code: number; stdout: string; stderr: string }> {
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
