**@cross/utils**

A collection of cross-runtime JavaScript utilities for Node.js, Deno, and Bun.
Part of the @cross suite - check out our growing collection of cross-runtime
tools at [github.com/cross-org](https://github.com/cross-org).

**Installation**

Full instructions are available at
[https://jsr.io/@cross/utils](https://jsr.io/@cross/utils), but here's the short
version:

```bash
# Deno
deno add @cross/utils

# Node.js
npx jsr add @cross/utils

# Bun
bunx jsr add @cross/utils
```

**Core Utilities**

**Methods**

- **exit(code?: number): void**
  - Terminates the current process with the provided exit code (defaults to 0).

- **args(all?: boolean): string[]**
  - Extracts command-line arguments.
  - `all` (optional): If true, includes the executable path and script name.

- **stripAnsi(text: string): string**
  - Removes all ANSI control codes from a string for cleaner logs and output.

- **spawn(command: CommandArray, extraEnvVars?: Object, cwd?: string, stdio: StdIO)**
  - Spawns a sub process.

- **table(data: string[][])**
  - Generates a neatly formatted table representation of a 2D array and prints
    it to the console.

- **execPath()**
  - Get the path to the current runtime executable.

- **pid()**
  - Get the pid of the currently running process.

- **resolvedExecPath()**
  - Get the path to the current runtime executable, as indicated by the PATH
    variable. Could be a version independent link such as `...nvm/current...`
    instead of `...nvm/<version>...`.

- **deepFreeze<T>(obj: T, createCopy?: boolean): T**
  - Recursively freezes an object and all its nested objects. Freezing prevents
    any modifications to the object's properties.
  - If `createCopy` is `true` (default is `false`), a new frozen deep copy of
    the object is returned, leaving the original unchanged.

- **deepSeal<T>(obj: T, createCopy?: boolean): T**
  - Recursively seals an object and all its nested objects. Sealing prevents new
    properties from being added or removed, but existing properties can still be
    modified.
  - If `createCopy` is `true` (default is `false`), a new sealed deep copy of
    the object is returned, leaving the original unchanged.

- **stdin(): ReadableStream**
  - Get the stdin as a web-standard `ReadableStream` object.

- **stdout(): WritableStream**
  - Get the stdout as a web-standard `WritableStream` object.

- **stderr(): WritableStream**
  - Get the stderr as a web-standard `WritableStream` object.

**Classes**

- **Colors**
  - Provides methods for styling text in the console for all supported runtimes.
  - Example: `console.log(Colors.bold(Colors.bgGreen("Success!")));`

- **Cursor**
  - Methods for controlling the cursor in the console, enabling more interactive
    CLI experiences across environments.
  - Example: `console.log(Cursor.hide() + "Secret Text" + Cursor.show());`

- **ArgsParser**
  - Parses command-line arguments in a standardized way, supporting named flags,
    multiple values, and positional arguments.

**Example Usage**

```javascript
import {
  args,
  ArgsParser,
  Colors,
  Cursor,
  exit,
  spawn,
  stripAnsi,
} from "@cross/utils";

// Argument processing
const parser = new ArgsParser(args(true), {
  aliases: { "verbose": "v", boolean: ["verbose"] },
});
const port = parser.get("port") || "8080";

// Colorful output
console.log(Colors.bold(Colors.bgGreen("Server starting on port " + port)));

// User input with cleaned logging
const input = stripAnsi(await prompt("Enter text: "));
console.log("Input (no formatting):", input);

// Interactive prompt replacement
console.log("Doing work...");
console.log(Cursor.up(1) + Cursor.clearLine() + "Work complete!");

// Execute a shell command (e.g., 'git status')
const cmdResult = await spawn(["git", "status"]);
console.log(cmdResult.stdout);
```

**Submodules**

The @cross/utils package is organized into the following submodules for focused
functionality:

- **@cross/utils/ansi**
  - **stripAnsi(text: string): string** - Removes ANSI control codes for cleaner
    output.
  - **Colors Class** - Provides methods for easy console text styling.

- **@cross/utils/spawn**
  - **spawn(command: CommandArray, extraEnvVars?: Object, cwd?: string, stdio: StdIO):
    Promise<>** - Spawns subprocesses in a cross-runtime manner.

- **@cross/utils/args**
  - **args(all?: boolean): string[]** - Fetches command-line arguments
    consistently across environments.
  - **ArgsParser Class** - Advanced parsing of command-line arguments with flag
    and value support.

- **@cross/utils/exit**
  - **exit(code?: number): void** - Terminates the process with control over the
    exit code.

* **@cross/utils/format**
  - **table(data: string[][]): void** - Generates a neatly formatted table
    representation of a 2D array and prints it to the console.
    - **Parameter:**
      - data: A 2D array of strings representing the table data.
    - **Example:**
      ```javascript
      // Uses @cross/utils/colors to create bold headers
      const myData = [
        [Colors.bold("Name"), Colors.bold("Age"), Colors.bold("City")],
        ["Alice", "25", "New York"],
        ["Bob", "32", "London"],
      ];
      table(myData);
      ```

- **execPath(): Promise<string>**
  - Returns the actual path to the current runtime executable.
  - **Examples:**
  ```javascript
  const runtimeExecPath = await execPath();

  // Log the runtime for debugging:
  console.log(`Process started using ${runtimeExecPath}`);

  // Spawn a child process with the same runtime:
  const childProcess = spawn(runtimeExecPath, ["other-script.js"]);
  ```

- **resolvedExecPath(): Promise<string>**
  - Returns the resolved path (through PATH) to the current runtime executable.
  - **Examples:**
  ```javascript
  const runtimeExecPath = await resolvedExecPath();

  // Log the runtime for debugging:
  console.log(`Process started using ${runtimeExecPath}`);

  // Spawn a child process with the same runtime:
  const childProcess = spawn(runtimeExecPath, ["other-script.js"]);
  ```

- **@cross/utils/objectManip**
  - **deepFreeze(obj: T, createCopy?: boolean): T** - Recursively freezes an
    object and all its nested objects.
  - **deepSeal(obj: T, createCopy?: boolean): T** - Recursively seals an object
    and all its nested objects.
  - **Examples:**
  ```javascript
  // deepFreeze
  const obj = { a: 1, b: { c: 2 } };
  deepFreeze(obj); // obj is now frozen
  obj.a = 10; // Throws an error in strict mode

  const original = { x: 5, y: { z: 6 } };
  const frozenCopy = deepFreeze(original, true); // frozenCopy is a new frozen object
  frozenCopy.x = 20; // Throws an error in strict mode
  original.x = 20; // Succeeds, original is unchanged

  // deepSeal
  const obj = { a: 1, b: { c: 2 } };
  deepSeal(obj); // obj is now sealed
  obj.a = 10; // Succeeds because 'a' is writable
  obj.d = 4; // Throws an error in strict mode
  delete obj.a; // Throws an error in strict mode

  const original = { x: 5, y: { z: 6 } };
  const sealedCopy = deepSeal(original, true); // sealedCopy is a new sealed object
  sealedCopy.x = 20; // Succeeds because 'x' is writable
  sealedCopy.w = 7; // Throws an error in strict mode
  original.w = 20; // Succeeds, original is unchanged
  ```
