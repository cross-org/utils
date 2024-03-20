import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Retrieves command-line arguments in a cross-runtime compatible manner.
 *
 * @param {boolean} all A boolean indicating if all arguments should be passed, including script name and executable.
 *
 * @returns {string[]} An array containing the command-line arguments.
 * @example
 * // import { args } from "@cross/utils";
 *
 * const args = args();
 * console.log("Arguments:", args);
 */
export function args(all: boolean = false): string[] {
  if (CurrentRuntime === Runtime.Deno) {
    if (all) {
      // Construct 'fake' executable and script name based on Deno.execPath() and Deno.mainModule
      // @ts-ignore Cross Runtime
      const executable = Deno.execPath();
      // @ts-ignore Cross Runtime
      const script = Deno.mainModule;
      // @ts-ignore Cross Runtime
      return [executable, script, ...Deno.args];
    } else {
      // @ts-ignore Cross Runtime
      return Deno.args;
    }
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    // @ts-ignore Cross Runtime
    if (all) {
      // @ts-ignore Cross Runtime
      return process.argv;
    } else {
      // @ts-ignore Cross Runtime
      return process.argv.slice(2); // Skip the first two arguments (executable and script name)
    }
  } else {
    console.error("Cannot determine runtime. Argument retrieval unavailable.");
    return [];
  }
}

/**
 * Provides command-line argument parsing functionality.
 * 
 * **Key Features:**
 * * Handles short and long flags (e.g., `-f` and `--flag`)
 * * Supports multiple values for a single flag
 * * Stores loose arguments (those not associated with flags) 
 * * Collects a "rest command" portion after the `--` delimiter, useful for subcommands.
 */
export class ArgsParser {
  private readonly parsedArgs: Record<string, (string | boolean)[]>;
  private readonly looseArgs: string[];
  private readonly restCommand: string = "";

  /**
   * Parses command-line arguments.
   *
   * @param {string[]} cmdArgs The array of command-line arguments.
   *
   * @returns {Object} An object with the following properties:
   *   - args: An object where keys represent argument names and values are their corresponding values.
   *   - loose: An array of loose arguments.
   */
  public static parseArgs(
    cmdArgs: string[],
  ): {
    args: Record<string, (string | boolean)[]>;
    loose: string[];
    rest: string;
  } {
    const parsedArgs: Record<string, (string | boolean)[]> = {};
    const looseArgs: string[] = [];
    let restCommand = "";
    let collectingRest = false;
    for (let i = 0; i < cmdArgs.length; i++) {
      const arg = cmdArgs[i];

      if (collectingRest) {
        restCommand += (restCommand ? " " : "") + arg; // Join with spaces
      } else if (arg === "--") {
        collectingRest = true;
      } else if (arg.startsWith("--") || arg.startsWith("-")) {
        const parts = arg.slice(arg.startsWith("--") ? 2 : 1).split("=");
        const key = parts[0];
        let value: string | boolean = true; // Default to boolean for flags

        if (parts.length > 1) {
          value = parts[1];
        } else if (i + 1 < cmdArgs.length && !cmdArgs[i + 1].startsWith("-")) {
          value = cmdArgs[i + 1];
          i++;
        }

        // Handle multiple values for a flag
        if (key in parsedArgs) {
          const existingValue = parsedArgs[key];
          parsedArgs[key] = Array.isArray(existingValue)
            ? [...existingValue, value]
            : [existingValue, value];
        } else {
          parsedArgs[key] = [value];
        }
      } else {
        looseArgs.push(arg);
      }
    }

    return { args: parsedArgs, loose: looseArgs, rest: restCommand };
  }

  /**
   * Constructs a new instance of the ArgsParser class, parsing provided command-line arguments.
   * 
   * @param {string[]} cmdArgs - An array of command-line arguments to parse. 
   *
   * @example
   * // Basic usage
   * const argsParser = new ArgsParser(process.argv.slice(2)); 
   * const inputFile = argsParser.get('input'); 
   *
   * // Handling flags, multiple values, and loose arguments
   * const options = argsParser.getArray('option'); 
   * const isVerbose = argsParser.get('verbose');  
   * const looseArgs = argsParser.getLoose();
   */
  constructor(cmdArgs: string[]) {
    const result = ArgsParser.parseArgs(cmdArgs);
    this.parsedArgs = result.args;
    this.looseArgs = result.loose;
    this.restCommand = result.rest;
  }

  /**
   * Retrieves an array of values associated with a given argument name.
   *
   * @param {string} argName The argument name.
   * @returns {(string | boolean)[]} An array of values. Returns an empty array if the argument is not found.
   */
  getArray(argName: string): (string | boolean)[] {
    return this.parsedArgs[argName] || [];
  }

  /**
   * Retrieves the first value associated with a given argument name.
   *
   * @param {string} argName The argument name.
   * @returns {string|boolean|undefined} The first value, or undefined if the argument is not found.
   */
  get(argName: string): string | boolean | undefined {
    const value = this.parsedArgs[argName];
    return Array.isArray(value) ? value[0] : value;
  }

  /**
   * Counts the occurrences of a given argument name.
   *
   * @param {string} argName The argument name.
   * @returns {number} The number of occurrences (0 if not found).
   */
  count(argName: string): number {
    const value = this.parsedArgs[argName];
    return Array.isArray(value) ? value.length : (value ? 1 : 0);
  }

  /**
   * Returns an array of loose arguments
   * @returns {string[]} An array of loose arguments
   */
  getLoose(): string[] {
    return this.looseArgs; // Assuming looseArgs is a private array
  }

  /**
   * Counts the number of loose arguments
   * @returns {number} The number of loose arguments
   */
  countLoose(): number {
    return this.looseArgs.length;
  }

  /**
   * Returns the remaining command portion collected after the "--" delimiter.
   * @returns {string} The rest of the command.
   */
  getRest(): string {
    return this.restCommand;
  }

  /**
   * Checks whether a command portion was collected after the "--" delimiter.
   * @returns {boolean} True if a rest command exists, false otherwise.
   */
  hasRest(): boolean {
    return this.restCommand !== "";
  }
}
