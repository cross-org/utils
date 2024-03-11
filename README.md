# @cross/utils

A collection of useful routines to simplify cross runtime (Node, Deno and Bun)
development.

Available for Node, Deno Bun and Browser at
[jsr.io/@cross/utils](https://jsr.io/@cross/utils), and works seamlessly with
both JavaScript and TypeScript.

## Installation

Full instructions available at at [jsr.io](https://jsr.io/@cross/utils), short
version:

```bash
# Deno
deno add @cross/utils

# Node
npx jsr add @cross/utils

# Bun
bunx jsr add @cross/utils
```

## Methods

### exit

Terminates the current process with a provided exit code.

```js
import { exit } from "@cross/utils";

console.log("Will show");

exit(); // Exit with error code 0

console.log("Will not show");
```

**Parameters**

- `code` (number, optional): The exit code for the process. Defaults to 0
  (success).

### args

Extracts command-line arguments in a cross-runtime compatible manner.

```js
import { args } from "@cross/utils";

console.log("These are the arguments", args()); // Default behavior
console.log("All arguments (including executable and script)", args(true));
```

**Parameters**

- `all` (boolean, optional): When true, includes the executable path and script
  name at the beginning of the returned array. Defaults to false.
