import { stripAnsi } from "./ansi.ts";

/**
 * Generates a formatted table representation from a 2D array of data and prints it to the console.
 *
 * @param {string[][]} data - A 2D array of strings representing the table data.
 *
 * @example
 * const myData = [
 *   ["Name", "Age", "City"],
 *   ["Alice", "25", "New York"],
 *   ["Bob",   "32", "London"]
 * ];
 *
 * table(myData);
 */
export function table(data: string[][]) {
  // Calculate column widths
  const columnWidths: number[] = data.reduce((acc: number[], row) => {
    row.forEach((item, index) => {
      acc[index] = Math.max(acc[index] || 0, stripAnsi(item).length + 2); // +2 for spacing
    });
    return acc;
  }, []);
  // Print table
  data.forEach((row) => {
    let line = "";
    row.forEach((item, index) => {
      const ansiDiff = item.length - stripAnsi(item).length;
      line += item.padEnd(columnWidths[index] + ansiDiff) + "  ";
    });
    console.log(line);
  });
}
