export { exit } from "./utils/exit.ts";
export { pid } from "./utils/pid.ts";
export { args, ArgsParser } from "./utils/args.ts";
export { Colors, Cursor, stripAnsi } from "./utils/ansi.ts";
export { spawn } from "./utils/spawn.ts";
export type { SpawnResult, SpawnStdIO } from "./utils/spawn.ts";
export { execPath, resolvedExecPath } from "./utils/execpath.ts";
export {
  loadAvg,
  memoryUsage,
  type ProcessMemoryInfo,
  type SystemMemoryInfo,
  systemMemoryInfo,
  uptime,
} from "./utils/sysinfo.ts";
export { deepFreeze, deepSeal } from "./utils/objectManip.ts";
export { stderr, stdin, stdout } from "./utils/stdio.ts";
