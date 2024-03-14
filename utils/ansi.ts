/**
 * ANSI escape codes for styling text.
 */
const enum AnsiCodes {
  Reset = "\x1b[0m",
  Bold = "\x1b[1m",
  Dim = "\x1b[2m",
  Italic = "\x1b[3m",
  Underline = "\x1b[4m",
  Inverse = "\x1b[7m",
  Hidden = "\x1b[8m",
  Strikethrough = "\x1b[9m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
}

export class Colors {
  /**
   * Applies bold formatting to text.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bold(text: string): string {
    return AnsiCodes.Bold + text + AnsiCodes.Reset;
  }

  /**
   * Applies dim formatting to text.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static dim(text: string): string {
    return AnsiCodes.Dim + text + AnsiCodes.Reset;
  }

  /**
   * Applies italic formatting to text.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static italic(text: string): string {
    return AnsiCodes.Italic + text + AnsiCodes.Reset;
  }

  /**
   * Applies underline formatting to text.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static underline(text: string): string {
    return AnsiCodes.Underline + text + AnsiCodes.Reset;
  }

  /**
   * Applies inverse formatting to text.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static inverse(text: string): string {
    return AnsiCodes.Inverse + text + AnsiCodes.Reset;
  }

  /**
   * Applies hidden formatting to text.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static hidden(text: string): string {
    return AnsiCodes.Hidden + text + AnsiCodes.Reset;
  }

  /**
   * Applies strikethrough formatting to text.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static strikethrough(text: string): string {
    return AnsiCodes.Strikethrough + text + AnsiCodes.Reset;
  }

  /**
   * Sets the foreground color using 24-bit RGB values.
   * @param {number} r Red value (0-255)
   * @param {number} g Green value (0-255)
   * @param {number} b Blue value (0-255)
   * @param {string} text Text
   * @returns {string} The formatted text.
   */
  static rgb(r: number, g: number, b: number, text: string): string {
    return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
  }

  /**
   * Sets the background color to black.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bgBlack(text: string): string {
    return AnsiCodes.BgBlack + text + AnsiCodes.Reset;
  }

  /**
   * Sets the background color to red.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bgRed(text: string): string {
    return AnsiCodes.BgRed + text + AnsiCodes.Reset;
  }

  /**
   * Sets the background color to green.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bgGreen(text: string): string {
    return AnsiCodes.BgGreen + text + AnsiCodes.Reset;
  }

  /**
   * Sets the background color to yellow.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bgYellow(text: string): string {
    return AnsiCodes.BgYellow + text + AnsiCodes.Reset;
  }

  /**
   * Sets the background color to blue.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bgBlue(text: string): string {
    return AnsiCodes.BgBlue + text + AnsiCodes.Reset;
  }

  /**
   * Sets the background color to magenta.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bgMagenta(text: string): string {
    return AnsiCodes.BgMagenta + text + AnsiCodes.Reset;
  }

  /**
   * Sets the background color to cyan.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bgCyan(text: string): string {
    return AnsiCodes.BgCyan + text + AnsiCodes.Reset;
  }

  /**
   * Sets the background color to white.
   * @param {string} text The text to format.
   * @returns {string} The formatted text.
   */
  static bgWhite(text: string): string {
    return AnsiCodes.BgWhite + text + AnsiCodes.Reset;
  }
}

export class Cursor {
  /**
   * Moves the cursor up a specified number of lines.
   * @param {number} lines The number of lines to move up (default: 1).
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static up(lines: number = 1): Cursor {
    console.log(`\x1b[${lines}A`);
    return this;
  }

  /**
   * Moves the cursor down a specified number of lines.
   * @param {number} lines The number of lines to move down (default: 1).
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static down(lines: number = 1): Cursor {
    console.log(`\x1b[${lines}B`);
    return this;
  }

  /**
   * Moves the cursor right a specified number of columns.
   * @param {number} columns The number of columns to move right (default: 1).
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static right(columns: number = 1): Cursor {
    console.log(`\x1b[${columns}C`);
    return this;
  }

  /**
   * Moves the cursor left a specified number of columns.
   * @param {number} columns The number of columns to move left (default: 1).
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static left(columns: number = 1): Cursor {
    console.log(`\x1b[${columns}D`);
    return this;
  }

  /**
   * Hides the cursor.
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static hide(): Cursor {
    console.log("\x1b[?25l");
    return this;
  }

  /**
   * Shows the cursor.
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static show(): Cursor {
    console.log("\x1b[?25h");
    return this;
  }

  /**
   * Clears the entire screen.
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static clearScreen(): Cursor {
    console.log("\x1b[2J\x1b[0;0H");
    return this;
  }

  /**
   * Clears the current line.
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static clearLine(): Cursor {
    console.log("\x1b[K");
    return this;
  }

  /**
   * Moves the cursor to a specific position.
   * @param {number} x The horizontal column (zero-based).
   * @param {number} y The vertical line/row (zero-based).
   * @returns {Cursor} Returns the current Cursor instance.
   */
  static moveTo(x: number, y: number): Cursor {
    console.log(`\x1b[${y + 1};${x + 1}H`);
    return this;
  }
}

/**
 * Removes all ANSI control codes from a given string.
 * @param {string} text The text to strip codes from.
 * @returns {string} The text with ANSI codes removed.
 */
export function stripAnsi(text: string): string {
  // deno-lint-ignore no-control-regex
  return text.replace(/\x1b\[[\d;]*[A-Za-z]/g, "");
}
