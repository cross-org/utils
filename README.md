# @cross/utils

A collection of useful routines to simplify cross-runtime (Node, Deno, and Bun)
development.

Available for Node, Deno, Bun and Browser at
[jsr.io/@cross/utils](https://jsr.io/@cross/utils), and works seamlessly with
both JavaScript and TypeScript.

## Installation

Full instructions available at [jsr.io](https://jsr.io/@cross/utils), short
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

- **exit(code?: number): void** Terminates the current process with a provided
  exit code (defaults to 0).

- **args(all?: boolean): string[]** Extracts command-line arguments in a
  cross-runtime compatible manner.
  - `all` (optional): If true, includes the executable path and script name.

- **stripAnsi(text: string): string** Removes all ANSI control codes from a
  given string.

## Classes

### Colors

Provides methods for styling text in the console:

- **Colors.bold(text: string): string** - Applies bold formatting.
- **Colors.dim(text: string): string** - Applies dim formatting.
- **Colors.italic(text: string): string** - Applies italic formatting.
- **Colors.underline(text: string): string** - Applies underline formatting.
- **Colors.inverse(text: string): string** - Applies inverse formatting.
- **Colors.hidden(text: string): string** - Applies hidden formatting.
- **Colors.strikethrough(text: string): string** - Applies strikethrough
  formatting.
- **Colors.rgb(r: number, g: number, b: number, text: string): string** - Sets
  the foreground color using 24-bit RGB values.
- **Colors.bgBlack(text: string): string** - Sets the background color to black.
- **Colors.bgRed(text: string): string** - Sets the background color to red.
- **Colors.bgGreen(text: string): string** - Sets the background color to green.
- **Colors.bgYellow(text: string): string** - Sets the background color to
  yellow.
- **Colors.bgBlue(text: string): string** - Sets the background color to blue.
- **Colors.bgMagenta(text: string): string** - Sets the background color to
  magenta.
- **Colors.bgCyan(text: string): string** - Sets the background color to cyan.
- **Colors.bgWhite(text: string): string** - Sets the background color to white.

### Cursor

Provides chainable methods for controlling the cursor in the console:

- **Cursor.up(lines?: number): Cursor** - Moves the cursor up (default: 1 line).
- **Cursor.down(lines?: number): Cursor** - Moves the cursor down (default: 1
  line).
- **Cursor.right(columns?: number): Cursor** - Moves the cursor right (default:
  1 column).
- **Cursor.left(columns?: number): Cursor** - Moves the cursor left (default: 1
  column).
- **Cursor.hide(): Cursor** - Hides the cursor.
- **Cursor.show(): Cursor** - Shows the cursor.
- **Cursor.clearScreen(): Cursor** - Clears the entire screen.
- **Cursor.clearLine(): Cursor** - Clears the current line.
- **Cursor.moveTo(x: number, y: number): Cursor** - Moves the cursor to a
  specific position.

## Example Usage

```javascript
import { args, Colors, Cursor, exit, stripAnsi } from "@cross/utils";

// Get all command-line arguments
const allArgs = args(true);

// Color some output
console.log(Colors.bold(Colors.bgGreen("Hello, world!")));

// Move the cursor and clear the line
Cursor.up(2).clearLine();

// If an unknown argument is passed, exit with an error
if (!["hello", "goodbye"].includes(allArgs[1])) {
  console.log(Colors.red("Invalid argument"));
  exit(1);
}

// Remove ANSI codes from input for clean logging
const userInput = stripAnsi(await prompt("Enter some text: "));
console.log("You entered (without formatting):", userInput);
```
