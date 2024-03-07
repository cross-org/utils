# @cross/utils

**Work in progress** A collection of useful routines to simplify cross runtime
(Node, Deno and Bun) development.

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

### Exit

```
import { exit } from "@cross/utils";

console.log("Will show");

exit(); // Exit with error code 0

console.log("Will not show");
```
