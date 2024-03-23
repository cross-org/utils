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

- **spawn(command: CommandArray, extraEnvVars?: Object, cwd?: string)**
  - Spawns a sub process.

- **cwd()**
  - Returns the current working directory.

- **table(data: string[][])**
  - Generates a neatly formatted table representation of a 2D array and prints
    it to the console.

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
const parser = new ArgsParser(args(true));
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
  - **spawn(command: CommandArray, extraEnvVars?: Object, cwd?: string):
    Promise<>** - Spawns subprocesses in a cross-runtime manner.

- **@cross/utils/args**
  - **args(all?: boolean): string[]** - Fetches command-line arguments
    consistently across environments.
  - **ArgsParser Class** - Advanced parsing of command-line arguments with flag
    and value support.

- **@cross/utils/exit**
  - **exit(code?: number): void** - Terminates the process with control over the
    exit code.

- **@cross/utils/cwd**
  - **cwd(): string** - Returns current working directory.

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
