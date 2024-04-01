import { spawn } from "./utils/spawn.ts";

console.log(await spawn(["apt", "list"]));
